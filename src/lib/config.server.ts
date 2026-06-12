import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    // Add server-only values here, e.g.:
    //   databaseUrl: process.env.DATABASE_URL,
    //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
}

/**
 * Config for the contact form's email delivery (Resend).
 * Set these in your deployment's environment variables — never commit
 * real values. See .env.example.
 */
export function getContactConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    // The address that receives new contact form submissions.
    toEmail: process.env.CONTACT_TO_EMAIL,
    // The "from" address Resend sends as. Must be a verified domain on
    // your Resend account (or "onboarding@resend.dev" for quick testing).
    fromEmail: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
  };
}
