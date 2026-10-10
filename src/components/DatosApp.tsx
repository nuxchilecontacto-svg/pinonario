import type { Idioma } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

const EDITOR = {
  "@type": "Organization",
  "@id": `${SITIO.url}/#organizacion`,
  name: SITIO.nombre,
  url: SITIO.url,
  email: SITIO.correo,
  logo: `${SITIO.url}/apple-icon.png`,
};

/**
 * Datos estructurados (schema.org) de una calculadora: le dicen a Google y Bing que la página es una
 * herramienta web gratuita. En la portada (portada=true) se agregan además el sitio y la organización.
 */
export function DatosApp({ nombre, descripcion, ruta, l, portada = false }: { nombre: string; descripcion: string; ruta: string; l: Idioma; portada?: boolean }) {
  const app = {
    "@type": "WebApplication",
    name: nombre,
    description: descripcion,
    url: `${SITIO.url}${ruta}`,
    inLanguage: l,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": EDITOR["@id"] },
  };
  const grafo = portada
    ? [{ "@type": "WebSite", "@id": `${SITIO.url}/#sitio`, name: SITIO.nombre, url: SITIO.url, inLanguage: ["es", "en"], publisher: { "@id": EDITOR["@id"] } }, EDITOR, app]
    : [EDITOR, app];
  const ld = { "@context": "https://schema.org", "@graph": grafo };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}
