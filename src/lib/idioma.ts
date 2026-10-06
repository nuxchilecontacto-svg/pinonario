import type { Cadena } from "./cadenas";

export type Idioma = "es" | "en";

export const LOCALE: Record<Idioma, string> = { es: "es-CL", en: "en-US" };

/** Páginas equivalentes en cada idioma (rutas fijas). */
export const RUTAS: { es: string; en: string }[] = [
  { es: "/", en: "/en/" },
  { es: "/transmision/", en: "/en/chain-length/" },
  { es: "/identificar/", en: "/en/identify/" },
  { es: "/engranajes/", en: "/en/gears/" },
  { es: "/cremalleras/", en: "/en/racks/" },
  { es: "/tablas/", en: "/en/tables/" },
  { es: "/cadenas/", en: "/en/chains/" },
  { es: "/guias/", en: "/en/guides/" },
  { es: "/acerca/", en: "/en/about/" },
  { es: "/contacto/", en: "/en/contact/" },
  { es: "/privacidad/", en: "/en/privacy/" },
];

/** Guías: slug en español ↔ slug en inglés. */
export const GUIAS_SLUG: { es: string; en: string }[] = [
  { es: "como-medir-un-pinon", en: "how-to-measure-a-sprocket" },
  { es: "08b-vs-asa-40", en: "08b-vs-ansi-40" },
  { es: "como-elegir-numero-de-dientes", en: "how-many-teeth-sprocket" },
  { es: "material-y-tratamiento-termico", en: "sprocket-gear-material-heat-treatment" },
];

/** Ruta equivalente en el otro idioma (incluye tablas y guías con parámetro). */
export function rutaEn(ruta: string, destino: Idioma): string {
  const r = ruta.endsWith("/") ? ruta : `${ruta}/`;
  const origen: Idioma = r.startsWith("/en/") || r === "/en/" ? "en" : "es";
  if (origen === destino) return r;
  const fija = RUTAS.find((x) => x[origen] === r);
  if (fija) return fija[destino];
  const tabla = origen === "es" ? r.match(/^\/tablas\/([^/]+)\/$/) : r.match(/^\/en\/tables\/([^/]+)\/$/);
  if (tabla) return destino === "en" ? `/en/tables/${tabla[1]}/` : `/tablas/${tabla[1]}/`;
  const guia = origen === "es" ? r.match(/^\/guias\/([^/]+)\/$/) : r.match(/^\/en\/guides\/([^/]+)\/$/);
  if (guia) {
    const g = GUIAS_SLUG.find((x) => x[origen] === guia[1]);
    if (g) return destino === "en" ? `/en/guides/${g.en}/` : `/guias/${g.es}/`;
  }
  return destino === "en" ? "/en/" : "/";
}

/** Metadatos de idioma para una página que existe en ambos idiomas. */
export function alternativas(es: string, en: string, actual: Idioma) {
  return { canonical: actual === "es" ? es : en, languages: { "es-CL": es, es, en, "x-default": es } };
}

/** Código de la cadena para mostrar: en inglés "ANSI 40" en vez de "ASA 40". */
export const codigo = (c: Cadena, l: Idioma) => (l === "en" ? c.codigo.replace("ASA", "ANSI") : c.codigo);
