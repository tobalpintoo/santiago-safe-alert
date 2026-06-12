## Landing page — App de seguridad para el Metro de Santiago

Construir una landing de una sola columna, con paleta roja sobre negro, tipografía Space Grotesk (titulares) + DM Sans (cuerpo), que presente el producto usando el video que subiste y capture leads vía un formulario de contacto.

### Estructura (single column)

1. **Nav minimalista** — logo/nombre + ancla a "Contacto".
2. **Hero** — Titular fuerte ("Reporta. Llega ayuda. Viaja segura."), subtítulo explicando la propuesta enfocada al Metro de Santiago, CTA primario "Quiero saber más" (scroll a contacto).
3. **Video del producto** — tu .mov como pieza central, autoplay muteado, en loop, con borde sutil rojo y aspect ratio preservado.
4. **El problema** — 2–3 datos / frases sobre acoso y violencia en el transporte público.
5. **Cómo funciona** — 3 pasos en vertical (Detectas → Reportas con un toque → Llega ayuda al andén).
6. **Beneficios** — 3–4 bullets (respuesta inmediata, geolocalización por estación, anonimato, red de apoyo).
7. **Contacto** — formulario (nombre, email, mensaje) + nota "Cuéntanos si te interesa colaborar, invertir o probar la app".
8. **Footer** — créditos del equipo + año.

### Decisiones de diseño

- Fondo `#0a0a0a` (negro), acento `#e11d2e` (rojo señalética metro), texto `#f5f5f5`, muted `#a1a1aa`. Definidos como tokens semánticos en `src/styles.css` (oklch).
- Tipografía: Space Grotesk para H1–H3, DM Sans para body. Cargadas vía Google Fonts en el head.
- Estética: bordes finos, mucho espacio, números grandes en los pasos, leve grano/glow rojo en el hero. Sin gradientes saturados.
- Mobile-first, ancho máximo ~720px en single column.
- SEO: title + meta description en español, og:title/description, H1 único.

### Plan técnico

- **Video**: subir el .mov a Lovable Assets (`lovable-assets create`), referenciar la URL CDN. Tag `<video autoplay muted loop playsinline>` con poster.
- **Tokens**: añadir variables rojas/negras en `src/styles.css` bajo `:root` y mapearlas en `@theme inline`.
- **Ruta**: reemplazar el placeholder en `src/routes/index.tsx` con la landing real. Head con title/description en español.
- **Formulario de contacto**: usar `react-hook-form` + `zod` para validación (nombre 1–100, email válido, mensaje 1–1000). En esta primera versión, al enviar muestra toast de éxito y abre `mailto:` con el contenido pre-llenado (no requiere backend). Si más adelante quieres guardar mensajes en base de datos o recibir emails reales, activamos Lovable Cloud.

### Fuera de alcance (por ahora)

- Backend / base de datos / envío real de emails (lo añadimos cuando lo pidas).
- Autenticación, página de producto interna, blog.

¿Procedo con esto?