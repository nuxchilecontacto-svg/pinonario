# Piñonario

Calculadora gratuita de piñones para cadena de rodillos (ISO 606 / DIN 8187 y ANSI B29.1 / ASA), en mm y pulgadas.
Sitio 100 % estático (Next.js con `output: "export"`): no necesita servidor ni base de datos.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # genera el sitio en ./out
```

## Publicación (Cloudflare Pages, gratis)

1. Subir este repositorio a GitHub.
2. En Cloudflare → Workers & Pages → Create → Pages → *Connect to Git* → elegir el repositorio.
3. Configuración de build:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Cada `git push` a `main` vuelve a publicar el sitio solo.

Al comprar el dominio: agregarlo en Cloudflare Pages → *Custom domains* y cambiar `url` en `src/lib/sitio.ts`.

## Estructura

- `src/lib/cadenas.ts` — medidas de cadenas ISO (serie B) y ASA (serie A)
- `src/lib/calculo.ts` — fórmulas del piñón (diámetros, control, anchos, perfil, cubo, material)
- `src/components/Calculadora.tsx` — calculadora interactiva
- `src/app/tablas/[cadena]/` — una tabla Z 8–120 por cadena (páginas para buscadores)
