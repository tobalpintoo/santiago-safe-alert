import { z } from "zod";

// Shared schema used by both the client form and the server function.
// Keeping it in one place guarantees client and server validation never
// drift apart.
//
// `company` is a honeypot: a field that's hidden from real users via CSS
// but visible to most basic bots that auto-fill every input. If it comes
// back non-empty, we silently drop the submission.
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  message: z.string().trim().min(5, "Cuéntanos un poco más").max(1000),
  company: z.string().max(0, "Campo inválido").optional(),
});

export type ContactForm = z.infer<typeof contactSchema>;

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string };
