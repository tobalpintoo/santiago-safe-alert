import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { ShieldAlert, MapPin, Bell, Lock, ArrowRight, Mail } from "lucide-react";
import demoVideo from "@/assets/demo.mov.asset.json";
import { submitContactForm } from "@/lib/api/contact.functions";
import { contactSchema, type ContactForm } from "@/lib/contact-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alerta Metro — Reporta acoso y violencia en el Metro de Santiago" },
      {
        name: "description",
        content:
          "App para reportar acoso o violencia en el Metro de Santiago y enviar ayuda inmediata a la estación. Únete al proyecto.",
      },
      { property: "og:title", content: "Alerta Metro — Viaja segura en el Metro de Santiago" },
      {
        property: "og:description",
        content:
          "Reporta acoso o violencia con un toque y recibe ayuda inmediata en tu estación. Únete al proyecto.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" richColors />
      <Nav />
      <Hero />
      <VideoSection />
      <Problem />
      <HowItWorks />
      <Benefits />
      <Contact />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <ShieldAlert className="h-4 w-4" />
          </span>
          Alerta Metro
        </a>
        <a
          href="#contacto"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary"
        >
          Contacto
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-20 pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.22 25 / 0.35) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Metro de Santiago
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Reporta.{" "}
          <span className="text-primary">Llega ayuda.</span>
          <br />
          Viaja seguro.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Una app para denunciar acoso y violencia en el metro con un solo toque.
          Tu reporte llega al instante al personal de la estación más cercana.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contacto"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Quiero saber más
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <a
            href="#como-funciona"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-primary"
          >
            Cómo funciona
          </a>
        </div>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_-20px_oklch(0.62_0.22_25_/_0.5)]">
          <video
            src="/demo.mov"
            autoPlay
            muted
            loop
            playsInline
            className="h-auto w-full"
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Una demostración del flujo de reporte dentro de la app.
        </p>
      </div>
    </section>
  );
}

function Problem() {
  const stats = [
    { value: "1 de 3", label: "mujeres reporta haber vivido acoso en el transporte público" },
    { value: "85%", label: "de los casos no se denuncia por falta de canales rápidos" },
    { value: "2.4M", label: "de viajes diarios en el Metro de Santiago" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/40 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          El metro debería ser un espacio seguro.
          <span className="text-muted-foreground"> Hoy no siempre lo es.</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-primary pl-4">
              <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Detectas un incidente",
      body: "Ves o vives una situación de acoso o violencia dentro del metro.",
    },
    {
      n: "02",
      title: "Reportas con un toque",
      body: "Abres la app y envías una alerta georreferenciada de forma anónima.",
    },
    {
      n: "03",
      title: "Llega ayuda al andén",
      body: "El personal de la estación recibe la alerta y responde en segundos.",
    },
  ];
  return (
    <section id="como-funciona" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cómo funciona</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tres pasos. Sin fricción. Sin exponer tu identidad.
        </p>
        <ol className="mt-12 space-y-8">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-6 border-t border-border pt-8">
              <div className="font-display text-4xl font-bold text-primary/80">{step.n}</div>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Bell, title: "Respuesta inmediata", body: "La alerta llega al instante a la estación más cercana." },
    { icon: MapPin, title: "Geolocalización por estación", body: "Sabemos exactamente dónde enviar ayuda." },
    { icon: Lock, title: "100% anónimo", body: "No necesitas dar tu nombre para reportar." },
    { icon: ShieldAlert, title: "Red de apoyo", body: "Conexión con personal capacitado y protocolos del metro." },
  ];
  return (
    <section className="border-t border-border/60 bg-card/40 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Diseñada para actuar rápido.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border border-border bg-background/60 p-6 transition hover:border-primary/60">
              <it.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const result = await submitContactForm({ data });
      if (result.ok) {
        toast.success("¡Gracias! Te contactaremos pronto.");
        reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("No se pudo enviar el mensaje. Intenta más tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <Mail className="h-3 w-3" /> Contacto
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            ¿Quieres ser parte?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Cuéntanos si te interesa colaborar, invertir, sumarte al equipo o
            probar la app cuando esté lista.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {/* Honeypot field: hidden from sighted users and screen readers,
              but visible to most basic form-filling bots. Real users
              should never interact with this. */}
          <div
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company")}
            />
          </div>

          <Field label="Nombre" error={errors.name?.message}>
            <input
              {...register("name")}
              maxLength={100}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              maxLength={255}
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Mensaje" error={errors.message?.message}>
            <textarea
              {...register("message")}
              rows={5}
              maxLength={1000}
              placeholder="¿Cómo te gustaría participar?"
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Enviando…" : "Enviar mensaje"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-primary">{error}</span>}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          <ShieldAlert className="h-4 w-4 text-primary" />
          App Alerta Metro
        </div>
        <div>© {new Date().getFullYear()} — Under water, Universidad Andres Bello</div>
      </div>
    </footer>
  );
}
