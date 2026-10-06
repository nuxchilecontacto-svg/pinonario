import Link from "next/link";
import { GUIAS, GUIAS_EN, type Guia } from "@/lib/guias";
import type { Idioma } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

const TX = {
  es: { base: "/guias/", guias: "Guías", meta: (m: number) => `${m} min de lectura · escrito desde la experiencia de taller`, sigue: "Sigue leyendo" },
  en: { base: "/en/guides/", guias: "Guides", meta: (m: number) => `${m} min read · written from shop-floor experience`, sigue: "Keep reading" },
};

/** Marco común de las guías: miga, título, foto, datos estructurados y "seguir leyendo". */
export function ArticuloGuia({ guia, children, l = "es" }: { guia: Guia; children: React.ReactNode; l?: Idioma }) {
  const t = TX[l];
  const otras = (l === "en" ? GUIAS_EN : GUIAS).filter((g) => g.slug !== guia.slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.descripcion,
    image: `${SITIO.url}/img/${guia.foto}`,
    inLanguage: l,
    mainEntityOfPage: `${SITIO.url}${t.base}${guia.slug}/`,
    publisher: { "@type": "Organization", name: SITIO.nombre, url: SITIO.url },
  };
  return (
    <article className="guia">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="miga"><Link href={t.base}>{t.guias}</Link> / {guia.titulo}</p>
      <h1>{guia.titulo}</h1>
      <p className="guia-meta">{t.meta(guia.minutos)}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="guia-foto" src={`/img/${guia.foto}`} alt={guia.titulo} width={760} height={570} />
      <div className="guia-cuerpo">{children}</div>
      <aside className="guia-mas">
        <h2>{t.sigue}</h2>
        <ul className="grilla-links">
          {otras.map((g) => (
            <li key={g.slug}><Link href={`${t.base}${g.slug}/`}><b>{g.titulo}</b><span>{g.resumen}</span></Link></li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
