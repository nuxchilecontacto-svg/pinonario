import Link from "next/link";
import { GUIAS, type Guia } from "@/lib/guias";
import { SITIO } from "@/lib/sitio";

/** Marco común de las guías: miga, título, foto, datos estructurados y "seguir leyendo". */
export function ArticuloGuia({ guia, children }: { guia: Guia; children: React.ReactNode }) {
  const otras = GUIAS.filter((g) => g.slug !== guia.slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.descripcion,
    image: `${SITIO.url}/img/${guia.foto}`,
    inLanguage: "es",
    mainEntityOfPage: `${SITIO.url}/guias/${guia.slug}/`,
    publisher: { "@type": "Organization", name: SITIO.nombre, url: SITIO.url },
  };
  return (
    <article className="guia">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="miga"><Link href="/guias/">Guías</Link> / {guia.titulo}</p>
      <h1>{guia.titulo}</h1>
      <p className="guia-meta">{guia.minutos} min de lectura · escrito desde la experiencia de taller</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="guia-foto" src={`/img/${guia.foto}`} alt="" width={760} height={570} />
      <div className="guia-cuerpo">{children}</div>
      <aside className="guia-mas">
        <h2>Sigue leyendo</h2>
        <ul className="grilla-links">
          {otras.map((g) => (
            <li key={g.slug}><Link href={`/guias/${g.slug}/`}><b>{g.titulo}</b><span>{g.resumen}</span></Link></li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
