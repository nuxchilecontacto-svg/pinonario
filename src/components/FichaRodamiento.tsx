import type { Metadata } from "next";
import Link from "next/link";
import { chavetaPara } from "@/lib/chavetas";
import { num } from "@/lib/formato";
import { alternativas, type Idioma } from "@/lib/idioma";
import { desgloseCodigo, relacionados, RODAMIENTOS, SERIES, type Rodamiento } from "@/lib/rodamientos";
import { esMiniatura, pulgadas, TXR } from "@/lib/rodamientosTexto";
import { DibujoRodamiento, TablaEquivalencias } from "./BuscadorRodamientos";

const TX = {
  es: {
    base: "/rodamientos/", rodamientos: "Rodamientos",
    titulo: (r: Rodamiento) => `Rodamiento ${r.codigo}: Medidas ${r.d}×${r.D}×${r.B} mm y Equivalencias`,
    desc: (r: Rodamiento) => `Medidas del rodamiento ${r.codigo}: ${r.d} × ${r.D} × ${r.B} mm. Qué significan 2RS, ZZ y C3, equivalencias SKF, NSK, NTN, FAG y Koyo. Gratis.`,
    h1: (r: Rodamiento) => `Rodamiento ${r.codigo}`,
    sub: (r: Rodamiento, serie: string) => `Medidas ${r.d} × ${r.D} × ${r.B} mm · ${serie}. Las medidas son iguales en todas las marcas (ISO 15).`,
    medidas: "Medidas", mm: "mm", pulg: "pulgadas", leer: "Cómo se lee el código",
    versiones: "Versiones más comunes", version: "Versión", codigoTxt: "Código",
    v: [["Abierto", ""], ["Tapas metálicas", "-2Z / ZZ"], ["Sellos de goma", "-2RS / 2RSH / DDU / LLU"], ["Ranura para anillo", "-N / NR"], ["Juego C3 (motores)", " C3"]],
    equiv: "Equivalencias por marca", ajustes: "Ajuste en eje y alojamiento",
    ajustesTxt: (d: number, D: number) =>
      `Caso más común, con el aro interior girando junto al eje y carga normal: eje Ø${d} ${d <= 18 ? "j6" : d <= 100 ? "k5" : "m5"} y alojamiento Ø${D} H7. Si gira el aro exterior (ruedas, poleas locas), se invierte: eje g6 o h6 y alojamiento M7 o N7. Confirme con el catálogo del fabricante para cargas altas o temperaturas elevadas.`,
    relacionados: "Rodamientos relacionados", mismoAgujero: (d: number) => `Mismo agujero (${d} mm), otra serie:`, anterior: "Anterior en la serie", siguiente: "Siguiente en la serie",
    chaveta: (d: number, b: number, h: number) => `¿El eje de ${d} mm lleva chaveta? Según DIN 6885 corresponde ${b} × ${h} mm →`,
    buscar: "Buscar otro rodamiento por código o por medidas →",
  },
  en: {
    base: "/en/bearings/", rodamientos: "Bearings",
    titulo: (r: Rodamiento) => `${r.codigo} Bearing Size: ${r.d}×${r.D}×${r.B} mm, Seals & Equivalents`,
    desc: (r: Rodamiento) => `${r.codigo} bearing dimensions: ${r.d} × ${r.D} × ${r.B} mm (${pulgadas(r.d)}" × ${pulgadas(r.D)}" × ${pulgadas(r.B)}"). What 2RS, ZZ and C3 mean, and SKF, NSK, NTN, FAG and Koyo equivalents.`,
    h1: (r: Rodamiento) => `${r.codigo} bearing`,
    sub: (r: Rodamiento, serie: string) => `Size ${r.d} × ${r.D} × ${r.B} mm · ${serie}. Dimensions are the same in every brand (ISO 15).`,
    medidas: "Dimensions", mm: "mm", pulg: "inches", leer: "How to read the number",
    versiones: "Most common versions", version: "Version", codigoTxt: "Number",
    v: [["Open", ""], ["Metal shields", "-2Z / ZZ"], ["Rubber seals", "-2RS / 2RSH / DDU / LLU"], ["Snap ring groove", "-N / NR"], ["C3 clearance (motors)", " C3"]],
    equiv: "Brand equivalents", ajustes: "Shaft and housing fit",
    ajustesTxt: (d: number, D: number) =>
      `Most common case, inner ring rotating with the shaft under normal load: shaft Ø${d} ${d <= 18 ? "j6" : d <= 100 ? "k5" : "m5"} and housing Ø${D} H7. If the outer ring rotates (wheels, idler pulleys) it is reversed: shaft g6 or h6 and housing M7 or N7. Check the manufacturer's catalog for heavy loads or high temperatures.`,
    relacionados: "Related bearings", mismoAgujero: (d: number) => `Same bore (${d} mm), other series:`, anterior: "Previous in the series", siguiente: "Next in the series",
    chaveta: (d: number, b: number, h: number) => `Keyed ${d} mm shaft? DIN 6885 calls for a ${b} × ${h} mm key →`,
    buscar: "Look up another bearing by number or size →",
  },
};

export function metadataRodamiento(r: Rodamiento, l: Idioma): Metadata {
  const t = TX[l];
  return {
    title: { absolute: t.titulo(r) },
    description: t.desc(r),
    alternates: alternativas(`/rodamientos/${r.codigo}/`, `/en/bearings/${r.codigo}/`, l),
  };
}

export function FichaRodamiento({ r, l }: { r: Rodamiento; l: Idioma }) {
  const t = TX[l], x = TXR[l];
  const serieTxt = x.serie(r.serie, esMiniatura(r));
  const { serie, agujeroCod, regla } = desgloseCodigo(r);
  const rel = relacionados(r);
  const ch = chavetaPara(r.d);
  const N = (v: number) => num(v, v % 1 ? 1 : 0, l);
  const chavetas = l === "en" ? "/en/keyways/" : "/chavetas/";
  return (
    <div className="pagina">
      <p className="miga no-print"><Link href={t.base}>{t.rodamientos}</Link> / {r.codigo}</p>
      <h1>{t.h1(r)} — {r.d} × {r.D} × {r.B} mm</h1>
      <p className="sub">{t.sub(r, `${x.tipo.toLowerCase()}, ${serieTxt}`)}</p>

      <div className="ficha-rod">
        <div className="vista vista-trans"><DibujoRodamiento d={r.d} D={r.D} B={r.B} /></div>
        <div className="tabla-wrap">
          <table className="tabla">
            <thead><tr><th>{t.medidas}</th><th>{t.mm}</th><th>{t.pulg}</th></tr></thead>
            <tbody>
              <tr><td>{x.d}</td><td><b>{N(r.d)}</b></td><td>{pulgadas(r.d)}</td></tr>
              <tr><td>{x.D}</td><td><b>{N(r.D)}</b></td><td>{pulgadas(r.D)}</td></tr>
              <tr><td>{x.B}</td><td><b>{N(r.B)}</b></td><td>{pulgadas(r.B)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <section className="texto">
        <h2>{t.leer}</h2>
        <p>{x.leer(r, serie, agujeroCod, regla)}</p>

        <h2>{t.versiones}</h2>
        <div className="tabla-wrap">
          <table className="tabla">
            <thead><tr><th>{t.version}</th><th>{t.codigoTxt}</th></tr></thead>
            <tbody>{t.v.map(([v, suf]) => <tr key={v}><td>{v}</td><td>{r.codigo}{suf}</td></tr>)}</tbody>
          </table>
        </div>
        <ul>
          <li>{x.prot.tapas2}</li>
          <li>{x.prot.sellos2}</li>
          <li>{x.juego("C3")}</li>
        </ul>

        <h2>{t.equiv}</h2>
        <TablaEquivalencias codigo={r.codigo} l={l} />

        <h2>{t.ajustes}</h2>
        <p>{t.ajustesTxt(r.d, r.D)}</p>
        {ch && <p><Link href={`${chavetas}?d=${r.d}`}>{t.chaveta(r.d, ch.b, ch.h)}</Link></p>}

        <h2>{t.relacionados}</h2>
        {rel.mismoAgujero.length > 0 && (
          <p>{t.mismoAgujero(r.d)}{" "}
            {rel.mismoAgujero.map((o, i) => (
              <span key={o.codigo}>{i > 0 && " · "}<Link href={`${t.base}${o.codigo}/`}>{o.codigo}</Link> ({o.d}×{o.D}×{o.B})</span>
            ))}
          </p>
        )}
        <p>
          {rel.anterior && <><Link href={`${t.base}${rel.anterior.codigo}/`}>← {rel.anterior.codigo}</Link> ({t.anterior}) </>}
          {rel.siguiente && <> · <Link href={`${t.base}${rel.siguiente.codigo}/`}>{rel.siguiente.codigo} →</Link> ({t.siguiente})</>}
        </p>
        <p><Link href={`${t.base}?c=${r.codigo}`}>{t.buscar}</Link></p>
      </section>
    </div>
  );
}

/** Tabla completa de rodamientos por serie, con enlace a cada ficha. */
export function TablaRodamientos({ l }: { l: Idioma }) {
  const t = TX[l], x = TXR[l];
  const N = (v: number) => num(v, v % 1 ? 1 : 0, l);
  const grupos = [
    ...SERIES.map((s) => ({ tit: x.serie(s, false), filas: RODAMIENTOS.filter((r) => r.serie === s && !esMiniatura(r)) })),
    { tit: x.serie("60 / 62 / 63", true), filas: RODAMIENTOS.filter(esMiniatura) },
  ];
  return (
    <div className="grupos-rod">
      {grupos.map((g) => (
        <div key={g.tit} className="tabla-wrap">
          <table className="tabla">
            <caption>{g.tit}</caption>
            <thead><tr><th>{l === "en" ? "Number" : "Código"}</th><th>d</th><th>D</th><th>B</th></tr></thead>
            <tbody>
              {g.filas.map((r) => (
                <tr key={r.codigo}><td><Link href={`${t.base}${r.codigo}/`}>{r.codigo}</Link></td><td>{N(r.d)}</td><td>{N(r.D)}</td><td>{N(r.B)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
