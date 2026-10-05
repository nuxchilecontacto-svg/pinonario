"use client";

import { useEffect, useMemo, useState } from "react";
import { calcularCremallera, contornoCremallera } from "@/lib/cremallera";
import { descargar, dxfContorno } from "@/lib/dxf";
import { DIAMETRAL_PITCH, MODULOS_SERIE1, MODULOS_SERIE2 } from "@/lib/engranajes";
import { kg, largo, unidad, type Unidad } from "@/lib/formato";
import { Icono } from "./Iconos";

const num = (t: string) => parseFloat(t.replace(",", "."));

export function CalcCremallera() {
  const [sistema, setSistema] = useState<"modulo" | "dp">("modulo");
  const [modulo, setModulo] = useState(2);
  const [dp, setDp] = useState(10);
  const [alfa, setAlfa] = useState(20);
  const [largoTxt, setLargoTxt] = useState("500");
  const [altoTxt, setAltoTxt] = useState("20");
  const [anchoTxt, setAnchoTxt] = useState("20");
  const [zTxt, setZTxt] = useState("20");
  const [u, setU] = useState<Unidad>("mm");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("dp")) { setSistema("dp"); setDp(Number(q.get("dp")) || 10); }
    if (Number(q.get("m")) > 0) setModulo(Number(q.get("m")));
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

  const L = (mm: number) => largo(mm, u);
  const U = unidad(u);
  const nombre = sistema === "modulo" ? `m ${String(m).replace(".", ",")}` : `DP ${String(dp).replace(".", ",")}`;

  const bajarDxf = () => {
    descargar(
      `cremallera-${sistema === "modulo" ? `m${m}` : `DP${dp}`}-${n}dientes.dxf`.replace(/\.(?!dxf$)/g, "_"),
      dxfContorno({ puntos: contornoCremallera(c) }),
    );
  };

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label="Datos de la cremallera">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="regla" size={22} /></span>
          <div><h2>Datos de la cremallera</h2><p>Dientes rectos, perfil ISO 53.</p></div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> Sistema</span>
          <div className="seg">
            <button className={sistema === "modulo" ? "on" : ""} onClick={() => setSistema("modulo")}>Módulo (métrico)</button>
            <button className={sistema === "dp" ? "on" : ""} onClick={() => setSistema("dp")}>Diametral pitch</button>
          </div>
          <div className="select">
            {sistema === "modulo" ? (
              <select aria-label="Módulo" value={modulo} onChange={(e) => setModulo(Number(e.target.value))}>
                <optgroup label="Serie 1 (preferente)">{MODULOS_SERIE1.map((v) => <option key={v} value={v}>Módulo {String(v).replace(".", ",")}</option>)}</optgroup>
                <optgroup label="Serie 2">{MODULOS_SERIE2.map((v) => <option key={v} value={v}>Módulo {String(v).replace(".", ",")}</option>)}</optgroup>
              </select>
            ) : (
              <select aria-label="Diametral pitch" value={dp} onChange={(e) => setDp(Number(e.target.value))}>
                {DIAMETRAL_PITCH.map((v) => <option key={v} value={v}>DP {String(v).replace(".", ",")}</option>)}
              </select>
            )}
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="fila2 iguales">
          <label className="mini"><span className="etq"><b>2</b> Largo deseado (mm)</span><input type="text" inputMode="decimal" value={largoTxt} onChange={(e) => setLargoTxt(e.target.value)} /></label>
          <div className="campo">
            <span className="etq"><b>3</b> Ángulo</span>
            <div className="seg chico">
              <button className={alfa === 20 ? "on" : ""} onClick={() => setAlfa(20)}>20°</button>
              <button className={alfa === 14.5 ? "on" : ""} onClick={() => setAlfa(14.5)}>14,5°</button>
            </div>
          </div>
        </div>

        <div className="fila2 iguales">
          <label className="mini">Alto total de la barra (mm)<input type="text" inputMode="decimal" value={altoTxt} onChange={(e) => setAltoTxt(e.target.value)} /></label>
          <label className="mini">Ancho de la barra (mm)<input type="text" inputMode="decimal" value={anchoTxt} onChange={(e) => setAnchoTxt(e.target.value)} /></label>
        </div>
        <div className="fila2 iguales">
          <label className="mini">Dientes del piñón (opcional)<input type="text" inputMode="numeric" value={zTxt} onChange={(e) => setZTxt(e.target.value)} /></label>
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> Unidades</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => setU("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => setU("in")}>pulg.</button>
            </div>
          </div>
        </div>

        <div className="vista vista-trans"><DibujoCremallera pts={muestra} c={c} nMuestra={Math.min(n, 6)} /></div>
        <div className="corte no-print">
          <button className="btn-dxf" onClick={bajarDxf}><Icono n="descarga" size={18} /> Descargar DXF ({n} dientes)</button>
          <p className="nota">Barra completa de {L(c.largo)} {U}, con radio de pie 0,38·m. Empieza y termina en el centro de un hueco, para unir tramos.</p>
        </div>
      </section>

      <section className="panel resultados" aria-label="Medidas de la cremallera">
        <div className="resumen">
          <span className="resumen-ico"><Icono n="regla" size={34} /></span>
          <div className="resumen-txt">
            <h2>Cremallera {nombre} · {n} dientes</h2>
            <p>Largo dentado {L(c.largo)} {U} · α = {String(alfa).replace(".", ",")}°</p>
          </div>
          <button className="btn-prim solo no-print" onClick={() => window.print()}><Icono n="impresora" size={18} /> Imprimir ficha</button>
        </div>

        <div className="tarjetas">
          <article className="tarjeta">
            <header><h3><Icono n="ancho" size={20} className="tarjeta-ico" />Paso y largo</h3><span className="u">{U}</span></header>
            <dl>
              <D n="Paso (p = π·m)" v={L(c.p)} dest />
              <D n="Número de dientes" v={String(n)} dest />
              <D n="Largo dentado (n·p)" v={L(c.largo)} dest />
              <D n="Sobrante respecto de lo pedido" v={L(largoPedido - c.largo)} />
            </dl>
            <p className="nota">Para unir tramos, el largo debe ser múltiplo exacto del paso.</p>
          </article>

          <article className="tarjeta">
            <header><h3><Icono n="diente" size={20} className="tarjeta-ico" />Diente</h3><span className="u">{U}</span></header>
            <dl>
              <D n="Altura del diente (2,25·m)" v={L(c.h)} dest />
              <D n="Espesor en la línea primitiva" v={L(c.espesorRef)} />
              <D n="Ancho de la punta" v={L(c.anchoPunta)} />
              <D n="Altura al primitivo (desde la base)" v={L(c.altoPrimitivo)} dest />
            </dl>
          </article>

          {c.dPinon && (
            <article className="tarjeta">
              <header><h3><Icono n="engranaje" size={20} className="tarjeta-ico" />Con piñón de {zP} dientes</h3><span className="u">{U}</span></header>
              <dl>
                <D n="Avance por vuelta del piñón" v={L(c.avancePorVuelta!)} dest />
                <D n="Diámetro primitivo del piñón" v={L(c.dPinon)} />
                <D n="Centro del piñón sobre la base de la barra" v={L(c.centroPinon!)} dest />
              </dl>
              <p className="nota"><a href={`/engranajes/?${sistema === "modulo" ? `m=${modulo}` : `dp=${dp}`}&z=${zP}`}>Medidas y DXF del piñón Z{zP} →</a></p>
            </article>
          )}

          <article className="tarjeta">
            <header><h3><Icono n="peso" size={20} className="tarjeta-ico" />Material (acero)</h3></header>
            <dl>
              <D n="Barra" v={`${L(c.largo)} × ${L(ancho)} × ${L(alto)} ${U}`} />
              <D n="Peso de la barra" v={kg(c.pesoBarra)} dest />
            </dl>
          </article>

          {altoBajo && (
            <article className="tarjeta tarjeta-avisos">
              <ul className="avisos"><li className="aviso-mal"><Icono n="info" size={17} /><span>La barra es muy baja: bajo el fondo de los dientes quedan menos de 2·m. Aumente el alto total.</span></li></ul>
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

function DibujoCremallera({ pts, c, nMuestra }: { pts: [number, number][]; c: ReturnType<typeof calcularCremallera>; nMuestra: number }) {
  const w = nMuestra * c.p;
  const H = c.alto;
  const fs = Math.max(w, H) * 0.045;
  const t = (y: number) => H - y; // eje y hacia abajo en SVG
  const xP = w + fs * 1.2;
  return (
    <svg viewBox={`${-fs} ${-fs * 2} ${w + fs * 7} ${H + fs * 3}`} className="dibujo-svg" role="img" aria-label="Tramo de la cremallera">
      <defs><marker id="fc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth={fs * 0.7} markerHeight={fs * 0.7} orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
      <polygon points={pts.map(([x, y]) => `${x.toFixed(3)},${t(y).toFixed(3)}`).join(" ")} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <path d={`M0 ${t(c.altoPrimitivo)}H${w}`} className="d-primitivo" vectorEffect="non-scaling-stroke" />
      <g className="cota">
        <path d={`M${c.p / 2} ${-fs}H${c.p * 1.5}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={c.p} y={-fs * 1.3} fontSize={fs} textAnchor="middle">p</text>
        <path d={`M${xP} ${t(c.altoPrimitivo + c.ha)}V${t(c.altoPrimitivo - c.hf)}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={xP + fs * 0.5} y={t(c.altoPrimitivo)} fontSize={fs} dominantBaseline="middle">h</text>
        <path d={`M${xP + fs * 2.2} ${t(0)}V${t(c.altoPrimitivo)}`} markerStart="url(#fc)" markerEnd="url(#fc)" vectorEffect="non-scaling-stroke" />
        <text x={xP + fs * 2.7} y={t(c.altoPrimitivo / 2)} fontSize={fs} dominantBaseline="middle">Hp</text>
      </g>
    </svg>
  );
}
