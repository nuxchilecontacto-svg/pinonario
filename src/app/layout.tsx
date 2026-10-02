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
    default: `${SITIO.nombre} — Calculadora de piñones para cadena ISO y ASA`,
    template: `%s | ${SITIO.nombre}`,
  },
  description:
    "Calcula gratis todas las medidas de un piñón para cadena de rodillos: diámetro primitivo, exterior, de fondo, ancho de diente y material. Normas ISO 606 / DIN 8187 y ANSI (ASA), en mm y pulgadas.",
  openGraph: { type: "website", locale: "es_CL", siteName: SITIO.nombre },
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
