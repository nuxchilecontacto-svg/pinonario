import type { Metadata } from "next";
import Link from "next/link";
import { CADENAS, type Cadena } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";
import { largo, type Unidad } from "@/lib/formato";
import { alternativas, codigo, type Idioma } from "@/lib/idioma";

const Z_TABLA = Array.from({ length: 113 }, (_, i) => i + 8); // Z 8 a 120

const TX = {
  es: {
    titulo: (c: Cadena) => `Tabla Piñón ${c.codigo} ${c.medida}: Z8 a Z120 Listo para Tornear`,
    desc: (c: Cadena, dp: string, de: string) => `¿Piñón ${c.codigo} de 20 dientes? Dp ${dp} mm y De ${de} mm. Z8 a Z120 con diámetros, medida de control y cubo máximo, sin hojear catálogos.`,
    tablas: "Tablas", h1: "Tabla de piñones", cadena: "Cadena", iso: "europea ISO 606 / DIN 8187", asa: "americana ANSI B29.1 (ASA)",
    paso: "paso", rodillo: "rodillo Ø", ancho: "ancho interior", diente: "ancho de diente simple",
    nota: "Medidas en mm. Toca una fila para abrirla en la calculadora (doble, triple, pulgadas, material).",
    z: "Z", thDp: "Diámetro primitivo", thDe: "Diámetro exterior torneado", thDf: "Diámetro de fondo", thMc: "Medida con pie de metro", thCubo: "Diámetro máximo de cubo", cubo: "Cubo máx",
    formula: (iso: boolean) => `Dp = p / sen(180°/Z) · De = ${iso ? "práctica europea dentro del rango ISO 606" : "p·(0,6 + cot(180°/Z))"} · Df = Dp − Ø rodillo · Mc = Df (Z par) o Dp·cos(90°/Z) − Ø rodillo (Z impar).`,
    ver: "Ver también:", base: "/tablas/", calc: "/", u: "mm" as Unidad,
  },
  en: {
    titulo: (c: Cadena) => `${codigo(c, "en")} Sprocket Chart (${c.medida}): 8 to 120 Teeth, Ready to Machine`,
    desc: (c: Cadena, dp: string, de: string) => `Need a 20-tooth ${codigo(c, "en")} sprocket? Pitch dia. ${dp}", OD ${de}". Chart from 8 to 120 teeth: pitch, outside, bottom and caliper diameters plus max hub.`,
    tablas: "Tables", h1: "Sprocket chart", cadena: "Chain", iso: "European ISO 606 / DIN 8187", asa: "American ANSI B29.1",
    paso: "pitch", rodillo: "roller Ø", ancho: "inner width", diente: "simplex tooth width",
    nota: "Dimensions in inches. Tap a row to open it in the calculator (duplex, triplex, mm, material).",
    z: "N", thDp: "Pitch diameter", thDe: "Outside diameter (turned)", thDf: "Bottom diameter", thMc: "Caliper diameter", thCubo: "Max hub diameter", cubo: "Max hub",
    formula: (iso: boolean) => `PD = p / sin(180°/N) · OD = ${iso ? "European practice within the ISO 606 range" : "p·(0.6 + cot(180°/N))"} · BD = PD − roller Ø · CD = BD (even N) or PD·cos(90°/N) − roller Ø (odd N).`,
    ver: "See also:", base: "/en/tables/", calc: "/en/", u: "in" as Unidad,
  },
};

export function metadataTabla(c: Cadena, l: Idioma): Metadata {
  const t = TX[l];
  const z20 = calcularPinon(c, 20);
  const L = (n: number) => largo(n, t.u, l);
  return {
    title: { absolute: t.titulo(c) },
    description: t.desc(c, L(z20.dp), L(z20.deRec)),
    alternates: alternativas(`/tablas/${c.id}/`, `/en/tables/${c.id}/`, l),
  };
}

export function TablaCadena({ c, l }: { c: Cadena; l: Idioma }) {
  const t = TX[l];
  const filas = Z_TABLA.map((z) => calcularPinon(c, z, 1));
  const L = (n: number) => largo(n, t.u, l);
  const Lmm = (n: number) => largo(n, "mm", l);
  const unidadTxt = t.u === "in" ? '"' : " mm";
  const cod = codigo(c, l);

  return (
    <div className="pagina">
      <p className="miga no-print"><Link href={t.base}>{t.tablas}</Link> / {cod}</p>
      <h1>{t.h1} {c.medida} — {cod}{c.equivalente ? ` (${c.equivalente})` : ""}</h1>
      <p className="sub">
        {t.cadena} {c.norma === "ISO" ? t.iso : t.asa} · {t.paso} {L(c.p)}{unidadTxt} ({Lmm(c.p)} mm) · {t.rodillo} {L(c.d1)}{unidadTxt} ·{" "}
        {t.ancho} {L(c.b1)}{unidadTxt} · {t.diente} {L(calcularPinon(c, 20).bf1)}{unidadTxt}. {t.nota}
      </p>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>{t.z}</th>
              <th title={t.thDp}>{l === "en" ? "PD" : "Dp"}</th>
              <th title={t.thDe}>{l === "en" ? "OD" : "De"}</th>
              <th title={t.thDf}>{l === "en" ? "BD" : "Df"}</th>
              <th title={t.thMc}>{l === "en" ? "CD" : "Mc"}</th>
              <th title={t.thCubo}>{t.cubo}</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.z}>
                <td><Link href={`${t.calc}?c=${c.id}&z=${r.z}`}>{r.z}</Link></td>
                <td>{L(r.dp)}</td>
                <td>{L(r.deRec)}</td>
                <td>{L(r.df)}</td>
                <td>{L(r.dCalibre)}</td>
                <td>{r.dCuboMax > 0 ? L(r.dCuboMax) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aviso">{t.formula(c.norma === "ISO")}</p>
      <p className="aviso">{t.ver} {CADENAS.filter((o) => o.p === c.p && o.id !== c.id).map((o) => (
        <Link key={o.id} href={`${t.base}${o.id}/`}>{codigo(o, l)} — {o.medida}</Link>
      ))}</p>
    </div>
  );
}
