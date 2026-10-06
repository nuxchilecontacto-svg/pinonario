import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataTabla, TablaCadena } from "@/components/TablaCadena";
import { CADENAS, cadenaPorId } from "@/lib/cadenas";

export function generateStaticParams() {
  return CADENAS.map((c) => ({ cadena: c.id }));
}

type Props = { params: Promise<{ cadena: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = cadenaPorId((await params).cadena);
  return c ? metadataTabla(c, "en") : {};
}

export default async function Pagina({ params }: Props) {
  const c = cadenaPorId((await params).cadena);
  if (!c) notFound();
  return <TablaCadena c={c} l="en" />;
}
