import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaRodamiento, metadataRodamiento } from "@/components/FichaRodamiento";
import { RODAMIENTOS, rodamientoPorCodigo } from "@/lib/rodamientos";

export function generateStaticParams() {
  return RODAMIENTOS.map((r) => ({ codigo: r.codigo }));
}

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = rodamientoPorCodigo((await params).codigo);
  return r ? metadataRodamiento(r, "en") : {};
}

export default async function Pagina({ params }: Props) {
  const r = rodamientoPorCodigo((await params).codigo);
  if (!r) notFound();
  return <FichaRodamiento r={r} l="en" />;
}
