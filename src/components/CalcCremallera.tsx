"use client";

import { useEffect, useMemo, useState } from "react";
import { calcularCremallera, contornoCremallera } from "@/lib/cremallera";
import { descargar, dxfContorno } from "@/lib/dxf";
import { DIAMETRAL_PITCH, MODULOS_SERIE1, MODULOS_SERIE2 } from "@/lib/engranajes";
import { kg, largo, unidad, type Unidad } from "@/lib/formato";
import type { Idioma } from "@/lib/idioma";
import { Icono } from "./Iconos";

const num = (t: string) => parseFloat(t.replace(",", "."));

const TX = {
  es: {
    datos: "Datos de la cremallera", datosSub: "Dientes rectos, perfil ISO 53.", sistema: "Sistema", modulo: "Módulo (métrico)", dp: "Diametral pitch",
    serie1: "Serie 1 (preferente)", serie2: "Serie 2", moduloX: "Módulo",
    largo: "Largo deseado (mm)", angulo: "Ángulo", alto: "Alto total de la barra (mm)", ancho: "Ancho de la barra (mm)", zP: "Dientes del piñón (opcional)",
    unidades: "Unidades", pulg: "pulg.", dxf: (n: number) => `Descargar DXF (${n} dientes)`, dxfArchivo: (n: number) => `cremallera`, dientesArch: "dientes",
    dxfNota: (l: string) => `Barra completa de ${l}, con radio de pie 0,38·m. Empieza y termina en el centro de un hueco, para unir tramos.`,
    medidas: "Medidas de la cremallera", cremallera: "Cremallera", dientes: "dientes", largoDentado: "Largo dentado", imprimir: "Imprimir ficha",
    pasoLargo: "Paso y largo", paso: "Paso (p = π·m)", nDientes: "Número de dientes", largoNP: "Largo dentado (n·p)", sobrante: "Sobrante respecto de lo pedido",
    notaTramos: "Para unir tramos, el largo debe ser múltiplo exacto del paso.",
    diente: "Diente", h: "Altura del diente (2,25·m)", esp: "Espesor en la línea primitiva", punta: "Ancho de la punta", hp: "Altura al primitivo (desde la base)",
    conPinon: (z: number) => `Con piñón de ${z} dientes`, avance: "Avance por vuelta del piñón", dPinon: "Diámetro primitivo del piñón", centro: "Centro del piñón sobre la base de la barra",
    verPinon: (z: number) => `Medidas y DXF del piñón Z${z} →`, engranajes: "/engranajes/",
    material: "Material (acero)", barra: "Barra", pesoBarra: "Peso de la barra",
    bajo: "La barra es muy baja: bajo el fondo de los dientes quedan menos de 2·m. Aumente el alto total.",
    tramo: "Tramo de la cremallera",
  },
  en: {
    datos: "Rack data", datosSub: "Straight teeth, ISO 53 profile.", sistema: "System", modulo: "Module (metric)", dp: "Diametral pitch",
    serie1: "Series 1 (preferred)", serie2: "Series 2", moduloX: "Module",
    largo: "Required length (mm)", angulo: "Angle", alto: "Overall bar height (mm)", ancho: "Bar width (mm)", zP: "Pinion teeth (optional)",
    unidades: "Units", pulg: "inch", dxf: (n: number) => `Download DXF (${n} teeth)`, dxfArchivo: (n: number) => `gear-rack`, dientesArch: "teeth",
    dxfNota: (l: string) => `Full bar, ${l} long, with 0.38·m root radius. Starts and ends at the middle of a tooth space so sections can be joined.`,
    medidas: "Rack dimensions", cremallera: "Gear rack", dientes: "teeth", largoDentado: "Toothed length", imprimir: "Print sheet",
    pasoLargo: "Pitch and length", paso: "Pitch (p = π·m)", nDientes: "Number of teeth", largoNP: "Toothed length (n·p)", sobrante: "Left over vs. requested",
    notaTramos: "To join sections, the length must be an exact multiple of the pitch.",
    diente: "Tooth", h: "Whole depth (2.25·m)", esp: "Tooth thickness at pitch line", punta: "Top land width", hp: "Pitch line height (from base)",
    conPinon: (z: number) => `With a ${z}-tooth pinion`, avance: "Travel per pinion revolution", dPinon: "Pinion pitch diameter", centro: "Pinion center above the bar base",
    verPinon: (z: number) => `Dimensions and DXF of the N${z} pinion →`, engranajes: "/en/gears/",
    material: "Material (steel)", barra: "Bar", pesoBarra: "Bar weight",
    bajo: "The bar is too low: less than 2·m remains below the tooth roots. Increase the overall height.",
    tramo: "Rack section",
  },
};

export function CalcCremallera({ l = "es" }: { l?: Idioma }) {
  const t = TX[l];
  const en = l === "en";
  const [sistema, setSistema] = useState<"modulo" | "dp">(en ? "dp" : "modulo");
  const [modulo, setModulo] = useState(2);
  const [dp, setDp] = useState(10);
  const [alfa, setAlfa] = useState(20);
  const [largoTxt, setLargoTxt] = useState("500");
  const [altoTxt, setAltoTxt] = useState("20");
  const [anchoTxt, setAnchoTxt] = useState("20");
  const [zTxt, setZTxt] = useState("20");
  const [u, setU] = useState<Unidad>(en ? "in" : "mm");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("dp")) { setSistema("dp"); setDp(Number(q.get("dp")) || 10); }
    if (Number(q.get("m")) > 0) { setSistema("modulo"); setModulo(Number(q.get("m"))); }
    if (Number(q.get("l")) > 0) setLargoTxt(q.get("l")!);
  }, []);

  const m = sistema === "modulo" ? modulo : 25.4 / dp;
  const p = Math.PI * m;
  const largoPedido = num(largoTxt) || 0;
  const n = Math.max(1, Math.floor(largoPedido / p));
  const alto = num(altoTxt) || 10 * m;
  const ancho = num(anchoTxt) || 0;
  const zP = Math.round(num(zTxt)) || 0;

  useEffect(() => {
    const q = new URLSearchParams(sistema === "modulo" ? { m: String(modulo) } : { dp: String(dp) });
    q.set("l", String(largoPedido));
    window.history.replaceState(null, "", `?${q}`);
  }, [sistema, modulo, dp, largoPedido]);

  const c = useMemo(() => calcularCremallera({ m, alfa, n, alto, ancho, zPinon: zP >= 6 ? zP : undefined }), [m, alfa, n, alto, ancho, zP]);
  const muestra = useMemo(() => contornoCremallera({ ...c, n: Math.min(n, 6), largo: Math.min(n, 6) * p }), [c, n, p]);
  const altoBajo = c.altoPrimitivo - c.hf < 2 * m;

  const L = (mm: number) => largo(mm, u, l);
  const U = unidad(u);
  const dec = (v: number) => (en ? String(v) : String(v).replace(".", ","));
  const nombre = sistema === "modulo" ? `m ${dec(m)}` : `DP ${dec(dp)}`;

  const bajarDxf = () => {
    descargar(
      `${t.dxfArchivo(n)}-${sistema === "modulo" ? `m${m}` : `DP${dp}`}-${n}${t.dientesArch}.dxf`.replace(/\.(?!dxf$)/g, "_"),
      dxfContorno({ puntos: contornoCremallera(c) }),
    );
  };

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label={t.datos}>
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="regla" size={22} /></span>
          <div><h2>{t.datos}</h2><p>{t.datosSub}</p></div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> {t.sistema}</span>
          <div className="seg">
            {((en ? ["dp", "modulo"] : ["modulo", "dp"]) as ("modulo" | "dp")[]).map((s) => (
              <button key={s} className={sistema === s ? "on" : ""} onClick={() => setSistema(s)}>{s === "modulo" ? t.modulo : t.dp}</button>
            ))}
          </div>
          <div className="select">
            {sistema === "modulo" ? (
              <select aria-label={t.moduloX} value={modulo} onChange={(e) => setModulo(Number(e.target.value))}>
                <optgroup label={t.serie1}>{MODULOS_SERIE1.map((v) => <option key={v} value={v}>{t.moduloX} {dec(v)}</option>)}</optgroup>
                <optgroup label={t.serie2}>{MODULOS_SERIE2.map((v) => <option key={v} value={v}>{t.moduloX} {dec(v)}</option>)}</optgroup>
              </select>
            ) : (
              <select aria-label="Diametral pitch" value={dp} onChange={(e) => setDp(Number(e.target.value))}>
                {DIAMETRAL_PITCH.map((v) => <option key={v} value={v}>DP {dec(v)}</option>)}
              </select>
            )}
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="fila2 iguales">
          <label className="mini"><span className="etq"><b>2</b> {t.largo}</span><input type="text" inputMode="decimal" value={largoTxt} onChange={(e) => setLargoTxt(e.target.value)} /></label>
          <div className="campo">
            <span className="etq"><b>3</b> {t.angulo}</span>
            <div className="seg chico">
              <button className={alfa === 20 ? "on" : ""} onClick={() => setAlfa(20)}>20°</button>
              <button className={alfa === 14.5 ? "on" : ""} onClick={() => setAlfa(14.5)}>{dec(14.5)}°</button>
            </div>
          </div>
        </div>

        <div className="fila2 iguales">
          <label className="mini">{t.alto}<input type="text" inputMode="decimal" value={altoTxt} onChange={(e) => setAltoTxt(e.target.value)} /></label>
          <label className="mini">{t.ancho}<input type="text" inputMode="decimal" value={anchoTxt} onChange={(e) => setAnchoTxt(e.target.value)} /></label>
        </div>
        <div className="fila2 iguales">
          <label className="mini">{t.zP}<input type="text" inputMode="numeric" value={zTxt} onChange={(e) => setZTxt(e.target.value)} /></label>
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> {t.unidades}</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => setU("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => setU("in")}>{t.pulg}</button>
            </div>
          </div>
        </div>

        <div className="vista vista-trans"><DibujoCremallera pts={muestra} c={c} nMuestra={Math.min(n, 6)} etiqueta={t.tramo} /></div>
        <div className="corte no-print">
          <button className="btn-dxf" onClick={bajarDxf}><Icono n="descarga" size={18} /> {t.dxf(n)}</button>
          <p className="nota">{t.dxfNota(`${L(c.largo)} ${U}`)}</p>
        </div>
      </section>

      <section className="panel resultados" aria-label={t.medidas}>
        <div className="resumen">
          <span className="resumen-ico"><Icono n="regla" size={34} /></span>
          <div className="resumen-txt">
            <h2>{t.cremallera} {nombre} · {n} {t.dientes}</h2>
            <p>{t.largoDentado} {L(c.largo)} {U} · α = {dec(alfa)}°</p>
          </div>
          <button className="btn-prim solo no-print" onClick={() => window.print()}><Icono n="impresora" size={18} /> {t.imprimir}</button>
        </div>

        <div className="tarjetas">
          <article className="tarjeta">
            <header><h3><Icono n="ancho" size={20} className="tarjeta-ico" />{t.pasoLargo}</h3><span className="u">{U}</span></header>
            <dl>
              <D n={t.paso} v={L(c.p)} dest />
              <D n={t.nDientes} v={String(n)} dest />
              <D n={t.largoNP} v={L(c.largo)} dest />
              <D n={t.sobrante} v={L(largoPedido - c.largo)} />
            </dl>
            <p className="nota">{t.notaTramos}</p>
          </article>

          <article className="tarjeta">
            <header><h3><Icono n="diente" size={20} className="tarjeta-ico" />{t.diente}</h3><span className="u">{U}</span></header>
            <dl>
              <D n={t.h} v={L(c.h)} dest />
              <D n={t.esp} v={L(c.espesorRef)} />
              <D n={t.punta} v={L(c.anchoPunta)} />
              <D n={t.hp} v={L(c.altoPrimitivo)} dest />
            </dl>
          </article>

          {c.dPinon && (
            <article className="tarjeta">
              <header><h3><Icono n="engranaje" size={20} className="tarjeta-ico" />{t.conPinon(zP)}</h3><span className="u">{U}</span></header>
              <dl>
                <D n={t.avance} v={L(c.avancePorVuelta!)} dest />
                <D n={t.dPinon} v={L(c.dPinon)} />
                <D n={t.centro} v={L(c.centroPinon!)} dest />
              </dl>
              <p className="nota"><a href={`${t.engranajes}?${sistema === "modulo" ? `m=${modulo}` : `dp=${dp}`}&z=${zP}`}>{t.verPinon(zP)}</a></p>
            </article>
          )}

          <article className="tarjeta">
            <header><h3><Icono n="peso" size={20} className="tarjeta-ico" />{t.material}</h3></header>
            <dl>
              <D n={t.barra} v={`${L(c.largo)} × ${L(ancho)} × ${L(alto)} ${U}`} />
              <D n={t.pesoBarra} v={kg(c.pesoBarra, l)} dest />
            </dl>
          </article>

          {altoBajo && (
            <article className="tarjeta tarjeta-avisos">
              <ul className="avisos"><li className="aviso-mal"><Icono n="info" size={17} /><span>{t.bajo}</span></li></ul>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}

function D({ n, v, dest }: { n: string; v: string; dest?: boolean }) {
  return <div className={`dato ${dest ? "dest" : ""}`}><dt>{n}</dt><dd>{v}</dd></div>;
}

function DibujoCremallera({ pts, c, nMuestra, etiqueta }: { pts: [number, number][]; c: ReturnType<typeof calcularCremallera>; nMuestra: number; etiqueta: string }) {
  const w = nMuestra * c.p;
  const H = c.alto;
  const fs = Math.max(w, H) * 0.045;
  const ty = (y: number) => H - y; // eje y hacia abajo en SVG
  const xP = w + fs * 1.2;
  return (
    <svg viewBox={`${-fs} ${-fs * 2} ${w + fs * 7} ${H + fs * 3}`} className="dibujo-svg" role="img" aria-label={etiqueta}>
      <defs><marker id="fc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth={fs * 0.7} markerHeight={fs * 0.7} orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
      <polygon points={pts.map(([x, y]) => `${x.toFixed(3)},${ty(y).toFixed(3)}`).join(" ")} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <path d={`M0 ${ty(c.altoPrimitivo)}H${w}`} className="d-primitivo" vectorEffect="non-scaling-stroke" />
      <g className="cota">
        <path d={`M${c.p / 2} ${-fs}H${c.p * 1.5}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={c.p} y={-fs * 1.3} fontSize={fs} textAnchor="middle">p</text>
        <path d={`M${xP} ${ty(c.altoPrimitivo + c.ha)}V${ty(c.altoPrimitivo - c.hf)}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={xP + fs * 0.5} y={ty(c.altoPrimitivo)} fontSize={fs} dominantBaseline="middle">h</text>
        <path d={`M${xP + fs * 2.2} ${ty(0)}V${ty(c.altoPrimitivo)}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={xP + fs * 2.7} y={ty(c.altoPrimitivo / 2)} fontSize={fs} dominantBaseline="middle">Hp</text>
      </g>
    </svg>
  );
}
