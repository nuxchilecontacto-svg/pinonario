import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { Cabecera } from "@/components/Cabecera";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: "Calculadora de Piñones para Cadena: Olvida el Catálogo",
    template: `%s | ${SITIO.nombre}`,
  },
  description:
    "¿Aún buscas medidas en un catálogo de papel? Elige paso y Z y obtén Dp, De, Df, cubo, ancho de diente y material de corte. ISO y ASA, mm y pulgadas. Gratis.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITIO.nombre,
    title: "Calculadora de Piñones para Cadena: Olvida el Catálogo",
    description: "Elige paso y Z: todas las medidas del piñón al instante. ISO y ASA, mm y pulgadas. Gratis.",
    images: [{ url: "/img/pinon.jpg", width: 760, height: 570 }],
  },
  // Search Console (no quitar: Google la revisa periódicamente)
  // [pinonario.pages.dev, pinonario.com]
  verification: { google: ["LeXq9zOw8soEpK4bv8jos1elTcCdE82V7t6vllzq5QY", "3-mqe_6EDN8KwlzHvSTPxtr8etZJHlk2NJ179r6gt2A"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121417",
};

// Tema oscuro por defecto; se recuerda la elección del visitante (antes de pintar, sin parpadeo)
const scriptTema = `try{var t=localStorage.getItem("tema");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <Cabecera nombre={SITIO.nombre} />
        <main>{children}</main>
        <footer className="pie no-print">
          <div className="pie-in">
            <span>{SITIO.nombre} · Herramienta gratuita para maestranzas y talleres.</span>
            <span>Cálculos según ISO 606 / DIN 8187 y ANSI B29.1.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
