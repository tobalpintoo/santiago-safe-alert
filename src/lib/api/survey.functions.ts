import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { getContactConfig } from "../config.server";
import { surveySchema, type SurveySubmitResult } from "../survey-schema";
import { checkRateLimit } from "../rate-limit.server";

const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora (encuesta se completa una vez)

const LABELS: Record<string, Record<string, string>> = {
  frecuencia: {
    "todos-los-dias": "Todos los días",
    "3-5-semana": "3 a 5 veces por semana",
    "1-2-semana": "1 a 2 veces por semana",
    ocasionalmente: "Ocasionalmente",
    "no-uso": "No utilizo Metro",
  },
  experiencia_acoso: {
    si: "Sí",
    no: "No",
    "prefiero-no-responder": "Prefiero no responder",
  },
  usaria_plataforma: { si: "Sí", no: "No", "tal-vez": "Tal vez" },
  anonimato: { si: "Sí", no: "No", "tal-vez": "Tal vez" },
  confirmacion: { si: "Sí", no: "No", "tal-vez": "Tal vez" },
};

const SCALE_LABELS: Record<string, Record<number, string>> = {
  velocidad: {
    1: "Muy lento",
    2: "Lento",
    3: "Regular",
    4: "Rápido",
    5: "Muy rápido",
  },
  discrecion: {
    1: "Nada discreta",
    2: "Poco discreta",
    3: "Medianamente discreta",
    4: "Discreta",
    5: "Muy discreta",
  },
  facilidad: {
    1: "Muy difícil",
    2: "Difícil",
    3: "Regular",
    4: "Fácil",
    5: "Muy fácil",
  },
  confianza: {
    1: "Nada de confianza",
    2: "Poca confianza",
    3: "Confianza media",
    4: "Confianza alta",
    5: "Mucha confianza",
  },
};

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export const submitSurvey = createServerFn({ method: "POST" })
  .inputValidator(surveySchema)
  .handler(async ({ data }): Promise<SurveySubmitResult> => {
    const parsed = surveySchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: "Respuestas inválidas. Por favor revisa el formulario." };
    }

    // Honeypot
    if (parsed.data.website) return { ok: true };

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (!checkRateLimit(`survey:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
      return {
        ok: false,
        error: "Ya registramos tu respuesta. ¡Gracias por participar!",
      };
    }

    const d = parsed.data;
    const { resendApiKey, toEmail, fromEmail } = getContactConfig();

    if (!resendApiKey || !toEmail) {
      console.error("[survey] Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars.");
      return { ok: false, error: "No se pudo registrar tu respuesta. Intenta más tarde." };
    }

    const html = `
      <h2 style="color:#e8202a;font-family:sans-serif">Nueva respuesta — Encuesta Alerta Metro</h2>
      <p style="font-family:sans-serif;font-size:14px"><strong>Respondido por:</strong> ${d.nombre}</p>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr style="background:#f5f5f5">
          <td style="padding:10px 14px;font-weight:bold;width:60%">1. Frecuencia de uso del Metro</td>
          <td style="padding:10px 14px">${LABELS.frecuencia[d.frecuencia]}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold">2. ¿Ha sentido inseguridad o acoso en Metro?</td>
          <td style="padding:10px 14px">${LABELS.experiencia_acoso[d.experiencia_acoso]}</td>
        </tr>
        <tr style="background:#f5f5f5">
          <td style="padding:10px 14px;font-weight:bold">3. ¿Usaría esta plataforma para denunciar?</td>
          <td style="padding:10px 14px">${LABELS.usaria_plataforma[d.usaria_plataforma]}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold">4. Velocidad del proceso de reporte</td>
          <td style="padding:10px 14px">${stars(d.velocidad)} ${d.velocidad}/5 — ${SCALE_LABELS.velocidad[d.velocidad]}</td>
        </tr>
        <tr style="background:#f5f5f5">
          <td style="padding:10px 14px;font-weight:bold">5. Discreción del proceso de reporte</td>
          <td style="padding:10px 14px">${stars(d.discrecion)} ${d.discrecion}/5 — ${SCALE_LABELS.discrecion[d.discrecion]}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold">6. Facilidad para entender la denuncia</td>
          <td style="padding:10px 14px">${stars(d.facilidad)} ${d.facilidad}/5 — ${SCALE_LABELS.facilidad[d.facilidad]}</td>
        </tr>
        <tr style="background:#f5f5f5">
          <td style="padding:10px 14px;font-weight:bold">7. Confianza en la plataforma</td>
          <td style="padding:10px 14px">${stars(d.confianza)} ${d.confianza}/5 — ${SCALE_LABELS.confianza[d.confianza]}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold">8. ¿El anonimato aumentaría tu disposición?</td>
          <td style="padding:10px 14px">${LABELS.anonimato[d.anonimato]}</td>
        </tr>
        <tr style="background:#f5f5f5">
          <td style="padding:10px 14px;font-weight:bold">9. ¿Confirmación de reporte generaría más seguridad?</td>
          <td style="padding:10px 14px">${LABELS.confirmacion[d.confirmacion]}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold">10. ¿Qué mejorarías o agregarías?</td>
          <td style="padding:10px 14px">${d.mejoras ? d.mejoras.replace(/\n/g, "<br>") : "<em>Sin respuesta</em>"}</td>
        </tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:20px">
        Respuesta recibida el ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}
      </p>
    `;

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
          subject: `Nueva respuesta encuesta — ${d.nombre} — Alerta Metro`,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[survey] Resend error", res.status, body);
        return { ok: false, error: "No se pudo registrar tu respuesta. Intenta más tarde." };
      }

      return { ok: true };
    } catch (err) {
      console.error("[survey] Unexpected error", err);
      return { ok: false, error: "No se pudo registrar tu respuesta. Intenta más tarde." };
    }
  });