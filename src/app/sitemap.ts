import type { MetadataRoute } from "next";
import { CADENAS } from "@/lib/cadenas";
import { GUIAS_SLUG, RUTAS } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

const PRIORIDAD: Record<string, number> = {
  "/": 1, "/transmision/": 0.9, "/identificar/": 0.9, "/engranajes/": 0.9, "/cremalleras/": 0.8, "/tablas/": 0.8,
  "/cadenas/": 0.7, "/guias/": 0.7, "/acerca/": 0.3, "/contacto/": 0.3, "/privacidad/": 0.2,
};

/** Cada página en ambos idiomas, con sus alternativas hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const fecha = new Date(); // fecha del build = última publicación
  const pares: { es: string; en: string; prioridad: number }[] = [
    ...RUTAS.map((r) => ({ ...r, prioridad: PRIORIDAD[r.es] ?? 0.5 })),
    ...GUIAS_SLUG.map((g) => ({ es: `/guias/${g.es}/`, en: `/en/guides/${g.en}/`, prioridad: 0.7 })),
    ...CADENAS.map((c) => ({ es: `/tablas/${c.id}/`, en: `/en/tables/${c.id}/`, prioridad: 0.6 })),
  ];
  return pares.flatMap(({ es, en, prioridad }) => {
    const languages = { es: `${SITIO.url}${es}`, en: `${SITIO.url}${en}` };
    return [
      { url: `${SITIO.url}${es}`, lastModified: fecha, priority: prioridad, alternates: { languages } },
      { url: `${SITIO.url}${en}`, lastModified: fecha, priority: prioridad, alternates: { languages } },
    ];
  });
}
