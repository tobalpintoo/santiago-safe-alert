import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { getContactConfig } from "../config.server";
import { contactSchema, type ContactSubmitResult } from "../contact-schema";
import { checkRateLimit } from "../rate-limit.server";

// Allow at most 5 submissions per IP every 10 minutes. Generous enough for
// a real visitor (who'll submit once), tight enough to blunt scripted abuse.
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Handles a contact form submission.
 *
 * Security notes:
 * - All input is re-validated with `contactSchema` on the server. The
 *   client-side validation (react-hook-form + zod) is only a UX nicety —
 *   never trust it.
 * - `company` is a honeypot field. Real users never see or fill it; bots
 *   that auto-fill forms usually do. If it's non-empty we report success
 *   to the caller (so the bot doesn't learn anything) but never send an
 *   email.
 * - Requests are rate-limited per IP (best-effort, see rate-limit.server.ts).
 * - The Resend API key lives only in server env vars and is never sent to
 *   the client.
 */
export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }): Promise<ContactSubmitResult> => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (!checkRateLimit(`contact:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
      return {
        ok: false,
        error: "Demasiados intentos. Intenta de nuevo en unos minutos.",
      };
    }

    const { name, email, message, company } = parsed.data;

    // Honeypot tripped: pretend everything is fine so the bot moves on,
    // but don't actually send anything.
    if (company) {
      return { ok: true };
    }

    const { resendApiKey, toEmail, fromEmail } = getContactConfig();

    if (!resendApiKey || !toEmail) {
      console.error(
        "[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars — submission not sent.",
      );
      return {
        ok: false,
        error: "El formulario no está disponible en este momento. Intenta más tarde.",
      };
    }

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Alerta Metro <${fromEmail}>`,
          to: [toEmail],
          // Replying to this email replies straight to the person who
          // wrote in, without exposing their address in the "from".
          reply_to: email,
          subject: `Interés en Alerta Metro — ${name}`,
          html: `
            <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
          `,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[contact] Resend error", res.status, body);
        return {
          ok: false,
          error: "No se pudo enviar el mensaje. Intenta más tarde.",
        };
      }

      return { ok: true };
    } catch (err) {
      console.error("[contact] Unexpected error sending email", err);
      return {
        ok: false,
        error: "No se pudo enviar el mensaje. Intenta más tarde.",
      };
    }
  });
