"use client";

import { useEffect, useState } from "react";
import { chavetaAnsiPara, chavetaPara, LARGOS_CHAVETA, parChaveta, tolerancia, TIPOS_AJUSTE, type Clase, type TipoAjuste } from "@/lib/chavetas";
import { num } from "@/lib/formato";
import type { Idioma } from "@/lib/idioma";
import { Icono } from "./Iconos";

type Sistema = "din" | "ansi";

const TX = {
  es: {
    datos: "Datos del eje", datosSub: "Diámetro del eje y tipo de ajuste. La chaveta y el chavetero salen de la norma.",
    sistema: "Norma", din: "DIN 6885 (mm)", ansi: "ANSI B17.1 (pulgadas)",
    eje: "Diámetro del eje", ejeMm: "mm", ejeIn: "pulgadas (ej. 1 1/4 o 1.25)",
    ajuste: "Ajuste de la chaveta", normal: "Normal", apretado: "Apretado", deslizante: "Deslizante",
    ajusteAyuda: { normal: "Uso general: la chaveta entra ajustada en el eje y algo más libre en el cubo.", apretado: "Para cargas alternadas o golpes: ajuste con interferencia en eje y cubo.", deslizante: "El cubo debe deslizar a lo largo del eje (chaveta guía)." },
    largo: "Largo de la chaveta (mm)", forma: "Extremos", formaA: "Redondeados (A)", formaB: "Rectos (B)", presion: "Presión admisible en el cubo (MPa)",
    presionNota: "Referencia: cubo de acero con carga estable ≈ 100 MPa; fundición ≈ 50 MPa; con golpes, usar la mitad.",
    fuera: (a: string) => `Fuera del rango de la norma (${a}).`,
    chaveta: "Chaveta", ejeTit: "Chavetero en el eje", cuboTit: "Chavetero en el cubo",
    ancho: "Ancho", alto: "Alto", prof: "Profundidad", medida: "Medida para controlar", parTit: "Par que transmite",
    par: "Par transmisible", potencia: (rpm: number) => `Potencia a ${rpm} rpm`, largosNorm: "Largos normalizados cercanos",
    dMenosT1: "d − t1 (desde el lado opuesto del eje)", dMasT2: "d + t2 (desde el lado opuesto del agujero)",
    ansiNota: "Chaveta cuadrada: el chavetero lleva la mitad de la chaveta en el eje y la mitad en el cubo. Medidas nominales; ANSI B17.1 da las tolerancias.",
    aviso: "Medidas según DIN 6885 hoja 1 y tolerancias ISO 286. Verifique contra la norma o el catálogo antes de fabricar.",
    avisoAnsi: "Medidas nominales según ANSI B17.1. Verifique tolerancias contra la norma o el catálogo antes de fabricar.",
    corte: "Corte del eje con chaveta",
  },
  en: {
    datos: "Shaft data", datosSub: "Shaft diameter and fit type. The key and keyseat come from the standard.",
    sistema: "Standard", din: "DIN 6885 (mm)", ansi: "ANSI B17.1 (inch)",
    eje: "Shaft diameter", ejeMm: "mm", ejeIn: "inches (e.g. 1 1/4 or 1.25)",
    ajuste: "Key fit", normal: "Normal", apretado: "Tight", deslizante: "Sliding",
    ajusteAyuda: { normal: "General use: snug in the shaft and slightly freer in the hub.", apretado: "For reversing loads or shock: interference in both shaft and hub.", deslizante: "The hub must slide along the shaft (feather key)." },
    largo: "Key length (mm)", forma: "Ends", formaA: "Rounded (A)", formaB: "Square (B)", presion: "Allowable hub pressure (MPa)",
    presionNota: "Guide: steel hub, steady load ≈ 100 MPa; cast iron ≈ 50 MPa; with shock loads, use half.",
    fuera: (a: string) => `Outside the standard range (${a}).`,
    chaveta: "Key", ejeTit: "Shaft keyseat", cuboTit: "Hub keyway",
    ancho: "Width", alto: "Height", prof: "Depth", medida: "Check dimension", parTit: "Torque capacity",
    par: "Transmissible torque", potencia: (rpm: number) => `Power at ${rpm} rpm`, largosNorm: "Nearby standard lengths",
    dMenosT1: "d − t1 (from the opposite side of the shaft)", dMasT2: "d + t2 (from the opposite side of the bore)",
    ansiNota: "Square key: half of the key sits in the shaft and half in the hub. Nominal sizes; ANSI B17.1 gives the tolerances.",
    aviso: "Sizes per DIN 6885 sheet 1 and ISO 286 tolerances. Check against the standard or a catalog before machining.",
    avisoAnsi: "Nominal sizes per ANSI B17.1. Check tolerances against the standard or a catalog before machining.",
    corte: "Shaft and key cross-section",
  },
};

const leerIn = (s: string) => {
  const p = s.trim().replace(",", ".").split(/\s+/);
  let v = 0;
  for (const x of p) {
    const [a, b] = x.split("/").map(Number);
    if (!Number.isFinite(a)) return NaN;
    v += b ? a / b : a;
  }
  return v;
};

export function CalcChavetas({ l = "es" }: { l?: Idioma }) {
  const t = TX[l];
  const [sistema, setSistema] = useState<Sistema>(l === "en" ? "ansi" : "din");
  const [dTxt, setDTxt] = useState(l === "en" ? "1 1/4" : "30");
  const [ajuste, setAjuste] = useState<TipoAjuste>("normal");
  const [largo, setLargo] = useState(40);
  const [forma, setForma] = useState<"A" | "B">("A");
  const [p, setP] = useState(100);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const d = Number(q.get("d"));
    if (d > 0) { setSistema("din"); setDTxt(String(d)); }
  }, []);

  const N = (v: number, dec = 2) => num(v, dec, l);
  const T = (v: number) => (v >= 0 ? `+${N(v, 3)}` : N(v, 3));

  // Datos en mm para ambos sistemas
  const dIn = sistema === "ansi" ? leerIn(dTxt) : NaN;
  const d = sistema === "din" ? parseFloat(dTxt.replace(",", ".")) : dIn * 25.4;
  const din = sistema === "din" && d > 0 ? chavetaPara(d) : null;
  const ansi = sistema === "ansi" && dIn > 0 ? chavetaAnsiPara(dIn) : null;
  const k = din
    ? { b: din.b, h: din.h, t1: din.t1, t2: din.t2 }
    : ansi
      ? { b: ansi.w * 25.4, h: ansi.w * 25.4, t1: (ansi.w * 25.4) / 2, t2: (ansi.w * 25.4) / 2 }
      : null;
  const clases = TIPOS_AJUSTE[ajuste];
  const tolE = din ? tolerancia(clases.eje as Clase, din.b) : null;
  const tolC = din ? tolerancia(clases.cubo as Clase, din.b) : null;
  const par = k && d > 0 ? parChaveta({ d, h: k.h, t1: k.t1, b: k.b, l: largo, p, forma }) : 0;
  const cercanos = LARGOS_CHAVETA.filter((x) => x >= d * 0.8 && x <= d * 2.2).slice(0, 6);
  const L = (mm: number) => (sistema === "ansi" ? `${N(mm / 25.4, 3)}"` : `${N(mm)} mm`);

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label={t.datos}>
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="ajustes" size={22} /></span>
          <div><h2>{t.datos}</h2><p>{t.datosSub}</p></div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> {t.sistema}</span>
          <div className="seg">
            {((l === "en" ? ["ansi", "din"] : ["din", "ansi"]) as Sistema[]).map((s) => (
              <button key={s} className={sistema === s ? "on" : ""} onClick={() => { setSistema(s); setDTxt(s === "ansi" ? "1 1/4" : "30"); }}>{t[s]}</button>
            ))}
          </div>
        </div>

        <label className="campo">
          <span className="etq"><b>2</b> {t.eje} ({sistema === "din" ? t.ejeMm : t.ejeIn})</span>
          <input className="input-grande" type="text" inputMode="decimal" value={dTxt} onChange={(e) => setDTxt(e.target.value)} />
        </label>

        {sistema === "din" && (
          <div className="campo">
            <span className="etq"><b>3</b> {t.ajuste}</span>
            <div className="seg chico">
              {(["normal", "apretado", "deslizante"] as TipoAjuste[]).map((a) => (
                <button key={a} className={ajuste === a ? "on" : ""} onClick={() => setAjuste(a)}>{t[a]}</button>
              ))}
            </div>
            <p className="nota">{t.ajusteAyuda[ajuste]} ({TIPOS_AJUSTE[ajuste].eje} / {TIPOS_AJUSTE[ajuste].cubo})</p>
          </div>
        )}

        {k && d > 0 && (
          <div className="vista vista-trans">
            <DibujoChaveta d={d} {...k} etiqueta={t.corte} />
          </div>
        )}
      </section>

      <section className="panel resultados" aria-live="polite">
        {!k ? (
          <div className="vacio"><Icono n="info" size={28} /><p>{t.fuera(sistema === "din" ? "6 – 500 mm" : '5/16" – 6 1/2"')}</p></div>
        ) : (
          <>
            <div className="resumen">
              <span className="resumen-ico"><Icono n="cubo" size={34} /></span>
              <div className="resumen-txt">
                <h2>{t.chaveta} {din ? `${din.b} × ${din.h} mm` : `${ansi!.wTxt}" × ${ansi!.wTxt}"`}</h2>
                <p>{din ? `DIN 6885 · Ø${N(din.dMin, 0)}–${N(din.dMax, 0)} mm` : `ANSI B17.1 · Ø${ansi!.dMinTxt}"–${ansi!.dMaxTxt}"`}</p>
              </div>
            </div>
            <div className="tarjetas">
              <article className="tarjeta">
                <header><h3><Icono n="regla" size={20} className="tarjeta-ico" />{t.ejeTit}</h3></header>
                <dl>
                  <D n={`${t.ancho} b${tolE ? ` ${clases.eje}` : ""}`} v={L(k.b)} extra={tolE ? `${T(tolE.sup)} / ${T(tolE.inf)}` : undefined} dest />
                  <D n={`${t.prof} t1`} v={L(k.t1)} />
                  <D n={t.dMenosT1} v={L(d - k.t1)} dest />
                </dl>
              </article>
              <article className="tarjeta">
                <header><h3><Icono n="cubo" size={20} className="tarjeta-ico" />{t.cuboTit}</h3></header>
                <dl>
                  <D n={`${t.ancho} b${tolC ? ` ${clases.cubo}` : ""}`} v={L(k.b)} extra={tolC ? `${T(tolC.sup)} / ${T(tolC.inf)}` : undefined} dest />
                  <D n={`${t.prof} t2`} v={L(k.t2)} />
                  <D n={t.dMasT2} v={L(d + k.t2)} dest />
                </dl>
                {ansi && <p className="nota">{t.ansiNota}</p>}
              </article>
              <article className="tarjeta">
                <header><h3><Icono n="peso" size={20} className="tarjeta-ico" />{t.parTit}</h3></header>
                <div className="entradas">
                  <label>{t.largo}<input type="number" min={1} value={largo} onChange={(e) => setLargo(Math.max(Number(e.target.value) || 0, 0))} /></label>
                  <div className="seg chico">
                    <button className={forma === "A" ? "on" : ""} onClick={() => setForma("A")}>{t.formaA}</button>
                    <button className={forma === "B" ? "on" : ""} onClick={() => setForma("B")}>{t.formaB}</button>
                  </div>
                  <label>{t.presion}<input type="number" min={1} value={p} onChange={(e) => setP(Math.max(Number(e.target.value) || 0, 0))} /></label>
                </div>
                <dl>
                  <D n={t.par} v={`${N(par, 0)} N·m`} dest />
                  <D n={t.potencia(1450)} v={`${N((par * 1450 * 2 * Math.PI) / 60 / 1000, 1)} kW`} />
                  {sistema === "din" && cercanos.length > 0 && <D n={t.largosNorm} v={cercanos.join(" · ")} />}
                </dl>
                <p className="nota">{t.presionNota}</p>
              </article>
            </div>
            <p className="aviso">{sistema === "din" ? t.aviso : t.avisoAnsi}</p>
          </>
        )}
      </section>
    </div>
  );
}

function D({ n, v, extra, dest }: { n: string; v: string; extra?: string; dest?: boolean }) {
  return (
    <div className={`dato ${dest ? "dest" : ""}`}>
      <dt>{n}{extra && <span className="sim">{extra}</span>}</dt>
      <dd>{v}</dd>
    </div>
  );
}

/** Corte transversal: eje, cubo y chaveta a escala real. */
function DibujoChaveta({ d, b, h, t1, t2, etiqueta }: { d: number; b: number; h: number; t1: number; t2: number; etiqueta: string }) {
  const s = 90 / d; // eje de 90 px
  const r = (d / 2) * s, cx = 115, cy = 85;
  const R = r * 1.65; // cubo de referencia
  const bw = b * s, yEje = cy - (r - t1 * s), yCubo = cy - (r + t2 * s);
  // Agujero del cubo con chavetero (arriba), eje con chavetero (arriba)
  const a = Math.asin(Math.min(bw / 2 / r, 0.99));
  const xa = cx - r * Math.sin(a), xb = cx + r * Math.sin(a), yb = cy - r * Math.cos(a);
  const cubo = `M${cx - R} ${cy}A${R} ${R} 0 1 1 ${cx + R} ${cy}A${R} ${R} 0 1 1 ${cx - R} ${cy}Z M${xb} ${yb}A${r} ${r} 0 1 1 ${xa} ${yb}V${yCubo}H${xb}Z`;
  const eje = `M${xb} ${yb}A${r} ${r} 0 1 1 ${xa} ${yb}V${yEje}H${xb}Z`;
  return (
    <svg viewBox="0 0 260 175" className="dibujo-svg" role="img" aria-label={etiqueta}>
      <path d={cubo} className="d-cuerpo" fillRule="evenodd" />
      <path d={eje} className="d-cuerpo d-eje-chav" />
      <rect x={cx - bw / 2} y={yEje - h * s} width={bw} height={h * s} className="d-chaveta" />
      <path d={`M${cx - R - 8} ${cy}H${cx + R + 8}M${cx} ${cy - R - 8}V${cy + R + 8}`} className="d-eje-trans" />
      <g className="cota">
        <path d={`M${cx + R + 14} ${yCubo}V${cy + r}`} />
        <path d={`M${cx + R + 6} ${yCubo}H${cx + R + 20}M${cx + R + 6} ${cy + r}H${cx + R + 20}`} />
      </g>
      <text x={cx + R + 18} y={cy - 4} fontSize="10" className="d-txt">d+t2</text>
      <text x={cx} y={yCubo - 6} fontSize="10" textAnchor="middle" className="d-txt">b</text>
    </svg>
  );
}
