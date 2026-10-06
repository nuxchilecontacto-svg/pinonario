import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticuloGuia } from "@/components/ArticuloGuia";
import { AnsiVsIso } from "@/contenido/en/AnsiVsIso";
import { HowManyTeeth } from "@/contenido/en/HowManyTeeth";
import { MaterialHeat } from "@/contenido/en/MaterialHeat";
import { MeasureSprocket } from "@/contenido/en/MeasureSprocket";
import { GUIAS_EN, guiaEnPorSlug } from "@/lib/guias";
import { alternativas, GUIAS_SLUG } from "@/lib/idioma";

const CONTENIDO: Record<string, () => React.ReactElement> = {
  "how-to-measure-a-sprocket": MeasureSprocket,
  "08b-vs-ansi-40": AnsiVsIso,
  "how-many-teeth-sprocket": HowManyTeeth,
  "sprocket-gear-material-heat-treatment": MaterialHeat,
};

export function generateStaticParams() {
  return GUIAS_EN.map((g) => ({ slug: g.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guiaEnPorSlug((await params).slug);
  if (!g) return {};
  const es = GUIAS_SLUG.find((x) => x.en === g.slug)!.es;
  return {
    title: { absolute: g.tituloSeo },
    description: g.descripcion,
    alternates: alternativas(`/guias/${es}/`, `/en/guides/${g.slug}/`, "en"),
    openGraph: { type: "article", title: g.tituloSeo, description: g.descripcion, images: [{ url: `/img/${g.foto}` }] },
  };
}

export default async function GuidePage({ params }: Props) {
  const g = guiaEnPorSlug((await params).slug);
  const Contenido = g && CONTENIDO[g.slug];
  if (!g || !Contenido) notFound();
  return (
    <ArticuloGuia guia={g} l="en">
      <Contenido />
    </ArticuloGuia>
  );
}
