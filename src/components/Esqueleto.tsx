import { JetBrains_Mono, Manrope } from "next/font/google";
import Link from "next/link";
import { GUIAS, GUIAS_EN } from "@/lib/guias";
import type { Idioma } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";
import { Cabecera } from "./Cabecera";

const sans = Manrope({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap", weight: ["500", "600", "700"] });

// Tema oscuro por defecto; se recuerda la elección del visitante (antes de pintar, sin parpadeo)
const scriptTema = `try{var t=localStorage.getItem("tema");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

const PIE = {
  es: {
    aria: "Todas las herramientas", cadena: "Cadena de rodillos", engranajes: "Engranajes", guiasTit: "Guías",
    links1: [["/", "Calculadora de piñones"], ["/transmision/", "Largo de cadena"], ["/identificar/", "Identificar cadena o piñón"], ["/tablas/", "Tablas de piñones"], ["/cadenas/", "Medidas de cadenas"]],
    links2: [["/engranajes/", "Engranajes por módulo"], ["/cremalleras/", "Cremalleras"]],
    links4: [["/acerca/", "Acerca de"], ["/contacto/", "Contacto"], ["/privacidad/", "Política de privacidad"], ["/en/", "English version"]],
    guias: GUIAS.map((g) => [`/guias/${g.slug}/`, g.titulo]),
    l1: "Herramienta gratuita para maestranzas y talleres.", l2: "Cálculos según ISO 606 / DIN 8187, ANSI B29.1 e ISO 53.",
  },
  en: {
    aria: "All tools", cadena: "Roller chain", engranajes: "Gears", guiasTit: "Guides",
    links1: [["/en/", "Sprocket calculator"], ["/en/chain-length/", "Chain length calculator"], ["/en/identify/", "Identify a chain or sprocket"], ["/en/tables/", "Sprocket tables"], ["/en/chains/", "Roller chain dimensions"]],
    links2: [["/en/gears/", "Spur gear calculator"], ["/en/racks/", "Gear rack calculator"]],
    links4: [["/en/about/", "About"], ["/en/contact/", "Contact"], ["/en/privacy/", "Privacy policy"], ["/", "Versión en español"]],
    guias: GUIAS_EN.map((g) => [`/en/guides/${g.slug}/`, g.titulo]),
    l1: "Free tools for machine shops and maintenance teams.", l2: "Calculations per ISO 606 / DIN 8187, ANSI B29.1 and ISO 53.",
  },
};

/** Documento HTML completo de cada idioma: <html lang>, cabecera, contenido y pie. */
export function Esqueleto({ l, children }: { l: Idioma; children: React.ReactNode }) {
  const p = PIE[l];
  const lista = (xs: string[][]) => xs.map(([href, txt]) => <li key={href}><Link href={href}>{txt}</Link></li>);
  return (
    <html lang={l} data-theme="dark" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <Cabecera nombre={SITIO.nombre} l={l} />
        <main>{children}</main>
        <footer className="pie no-print">
          <nav className="pie-links" aria-label={p.aria}>
            <div><h4>{p.cadena}</h4><ul>{lista(p.links1)}</ul></div>
            <div><h4>{p.engranajes}</h4><ul>{lista(p.links2)}</ul></div>
            <div><h4>{p.guiasTit}</h4><ul>{lista(p.guias)}</ul></div>
            <div><h4>{SITIO.nombre}</h4><ul>{lista(p.links4)}</ul></div>
          </nav>
          <div className="pie-in">
            <span>{SITIO.nombre} · {p.l1}</span>
            <span>{p.l2}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
