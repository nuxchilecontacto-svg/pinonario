import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticuloGuia } from "@/components/ArticuloGuia";
import { ElegirDientes } from "@/contenido/ElegirDientes";
import { EuropeaAmericana } from "@/contenido/EuropeaAmericana";
import { MaterialTratamiento } from "@/contenido/MaterialTratamiento";
import { MedirPinon } from "@/contenido/MedirPinon";
import { GUIAS, guiaPorSlug } from "@/lib/guias";
import { alternativas, GUIAS_SLUG } from "@/lib/idioma";

const CONTENIDO: Record<string, () => React.ReactElement> = {
  "como-medir-un-pinon": MedirPinon,
  "08b-vs-asa-40": EuropeaAmericana,
  "como-elegir-numero-de-dientes": ElegirDientes,
  "material-y-tratamiento-termico": MaterialTratamiento,
};

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guiaPorSlug((await params).slug);
  if (!g) return {};
  return {
    title: { absolute: g.tituloSeo },
    description: g.descripcion,
    alternates: alternativas(`/guias/${g.slug}/`, `/en/guides/${GUIAS_SLUG.find((x) => x.es === g.slug)!.en}/`, "es"),
    openGraph: { type: "article", title: g.tituloSeo, description: g.descripcion, images: [{ url: `/img/${g.foto}` }] },
  };
}

export default async function PaginaGuia({ params }: Props) {
  const g = guiaPorSlug((await params).slug);
  const Contenido = g && CONTENIDO[g.slug];
  if (!g || !Contenido) notFound();
  return (
    <ArticuloGuia guia={g}>
      <Contenido />
    </ArticuloGuia>
  );
}
