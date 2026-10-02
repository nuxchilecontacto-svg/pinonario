import type { MetadataRoute } from "next";
import { CADENAS } from "@/lib/cadenas";
import { SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = ["/", "/tablas/", "/cadenas/", ...CADENAS.map((c) => `/tablas/${c.id}/`)];
  return rutas.map((r) => ({ url: `${SITIO.url}${r}` }));
}
