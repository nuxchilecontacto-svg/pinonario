import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#15171a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="top no-print">
          <Link href="/" className="marca">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.6 2.6 3-.6.4 3 2.8 1.2-1.2 2.8L20 13.6l-2.6 1.6.6 3-3 .4-1.2 2.8-2.8-1.2L9.4 22 7.8 19.4l-3 .6-.4-3L1.6 15.8l1.2-2.8L1 10.4 3.6 8.8 3 5.8l3-.4L7.2 2.6 10 3.8z" /><circle cx="12" cy="12" r="3.2" /></svg>
            {SITIO.nombre}
          </Link>
          <nav>
            <Link href="/">Calculadora</Link>
            <Link href="/tablas/">Tablas</Link>
            <Link href="/cadenas/">Cadenas</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="pie no-print">
          <p>{SITIO.nombre} · Herramienta gratuita para maestranzas y talleres. Cálculos según ISO 606 / DIN 8187 y ANSI B29.1.</p>
        </footer>
      </body>
    </html>
  );
}
