import type { MetadataRoute } from "next";
import { CADENAS } from "@/lib/cadenas";
import { GUIAS } from "@/lib/guias";
import { SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fecha = new Date(); // fecha del build = última publicación
  const rutas: [string, number][] = [
    ["/", 1],
    ["/tablas/", 0.8],
    ["/transmision/", 0.9],
    ["/identificar/", 0.9],
    ["/engranajes/", 0.9],
    ["/cremalleras/", 0.8],
    ["/cadenas/", 0.7],
    ["/guias/", 0.7],
    ...GUIAS.map((g): [string, number] => [`/guias/${g.slug}/`, 0.7]),
    ...CADENAS.map((c): [string, number] => [`/tablas/${c.id}/`, 0.6]),
  ];
  return rutas.map(([r, prioridad]) => ({ url: `${SITIO.url}${r}`, lastModified: fecha, priority: prioridad }));
}
