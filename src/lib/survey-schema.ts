import { z } from "zod";

export const surveySchema = z.object({
  website: z.string().max(0).optional(),
  nombre: z.string().trim().min(1, "Por favor ingresa tu nombre").max(100),
  frecuencia: z.enum(
    ["todos-los-dias", "3-5-semana", "1-2-semana", "ocasionalmente", "no-uso"],
    { required_error: "Por favor selecciona una opción" },
  ),
  experiencia_acoso: z.enum(["si", "no", "prefiero-no-responder"], {
    required_error: "Por favor selecciona una opción",
  }),
  usaria_plataforma: z.enum(["si", "no", "tal-vez"], {
    required_error: "Por favor selecciona una opción",
  }),
  velocidad: z.number().int().min(1, "Selecciona una opción").max(5),
  discrecion: z.number().int().min(1, "Selecciona una opción").max(5),
  facilidad: z.number().int().min(1, "Selecciona una opción").max(5),
  confianza: z.number().int().min(1, "Selecciona una opción").max(5),
  anonimato: z.enum(["si", "no", "tal-vez"], {
    required_error: "Por favor selecciona una opción",
  }),
  confirmacion: z.enum(["si", "no", "tal-vez"], {
    required_error: "Por favor selecciona una opción",
  }),
  mejoras: z.string().max(1000).optional(),
});

// Input type (used for useForm — fields can be undefined before user interacts)
export type SurveyForm = z.input<typeof surveySchema>;

// Output type (used server-side after parsing — mejoras is always string)
export type SurveyData = z.output<typeof surveySchema>;

export type SurveySubmitResult =
  | { ok: true }
  | { ok: false; error: string };