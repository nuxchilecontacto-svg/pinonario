"use client";

import { useEffect, useMemo, useState } from "react";
import { calcularMaterial } from "@/lib/calculo";
import { descargar, dxfContorno } from "@/lib/dxf";
import {
  calcularEngranaje, calcularPareja, contornoEngranaje,
  DIAMETRAL_PITCH, MODULOS_SERIE1, MODULOS_SERIE2,
} from "@/lib/engranajes";
import { kg, largo, unidad, type Unidad } from "@/lib/formato";
import { aPuntos } from "@/lib/perfil";
import { Icono } from "./Iconos";

type Sistema = "modulo" | "dp";
const num = (t: string) => parseFloat(t.replace(",", "."));
const f = (n: number, d = 2) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export function CalcEngranajes() {
  const [sistema, setSistema] = useState<Sistema>("modulo");
  const [modulo, setModulo] = useState(2);
  const [dp, setDp] = useState(10);
  const [alfa, setAlfa] = useState(20);
  const [z, setZ] = useState(20);
  const [xTxt, setXTxt] = useState("0");
  const [z2Txt, setZ2Txt] = useState("");
  const [x2Txt, setX2Txt] = useState("0");
  const [bTxt, setBTxt] = useState("20");
  const [agujeroTxt, setAgujeroTxt] = useState("");
  const [sobremedida, setSobremedida] = useState(3);
  const [u, setU] = useState<Unidad>("mm");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("dp")) { setSistema("dp"); setDp(Number(q.get("dp")) || 10); }
    if (Number(q.get("m")) > 0) setModulo(Number(q.get("m")));
    const zq = Number(q.get("z")); if (zq >= 6 && zq <= 300) setZ(zq);
    if (q.get("a") === "14.5") setAlfa(14.5);
    if (q.get("x")) setXTxt(q.get("x")!);
    if (q.get("z2")) setZ2Txt(q.get("z2")!);
  }, []);

  const m = sistema === "modulo" ? modulo : 25.4 / dp;
  const zz = Math.min(Math.max(Math.round(z) || 6, 6), 300);
  const x = Math.max(-1, Math.min(1.5, num(xTxt) || 0));
  const z2 = Math.round(num(z2Txt)) || 0;
  const x2 = Math.max(-1, Math.min(1.5, num(x2Txt) || 0));
  const b = num(bTxt) || 0;

  useEffect(() => {
    const q = new URLSearchParams(sistema === "modulo" ? { m: String(modulo) } : { dp: String(dp) });
    q.set("z", String(zz));
    if (alfa !== 20) q.set("a", String(alfa));
    if (x) q.set("x", String(x));
    if (z2 >= 6) q.set("z2", String(z2));
    window.history.replaceState(null, "", `?${q}`);
  }, [sistema, modulo, dp, zz, alfa, x, z2]);

  const g = useMemo(() => calcularEngranaje({ m, z: zz, alfa, x }), [m, zz, alfa, x]);
  const g2 = useMemo(() => (z2 >= 6 && z2 <= 300 ? calcularEngranaje({ m, z: z2, alfa, x: x2 }) : null), [m, z2, alfa, x2]);
  const par = g2 ? calcularPareja(g, g2) : null;
  const vista = useMemo(() => contornoEngranaje(g, -Math.PI / 2 - Math.PI / zz, 36, 160), [g, zz]);

  const agujero = num(agujeroTxt) > 0 ? num(agujeroTxt) : Math.max(Math.round((g.df * 0.3) / 5) * 5, 0);
  const mat = calcularMaterial({ de: g.da, df: g.df, anchoDentado: b, conCubo: false, dCubo: 0, largoTotal: b, agujero, sobremedida });

  const L = (mm: number) => largo(mm, u);
  const U = unidad(u);
  const nombre = sistema === "modulo" ? `m ${String(m).replace(".", ",")}` : `DP ${String(dp).replace(".", ",")}`;

  const bajarDxf = () => {
    const pts = contornoEngranaje(g, 0, 160, 700);
    const txt = dxfContorno({ puntos: pts, agujero, referencias: [g.d / 2] });
    descargar(`engranaje-${sistema === "modulo" ? `m${m}` : `DP${dp}`}-Z${zz}${x ? `-x${x}` : ""}.dxf`.replace(/\./g, "_").replace(/_dxf$/, ".dxf"), txt);
  };

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label="Datos del engranaje">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="engranaje" size={22} /></span>
          <div><h2>Datos del engranaje</h2><p>Recto, de evolvente, perfil ISO 53.</p></div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> Sistema</span>
          <div className="seg" role="radiogroup" aria-label="Sistema">
            <button role="radio" aria-checked={sistema === "modulo"} className={sistema === "modulo" ? "on" : ""} onClick={() => setSistema("modulo")}>Módulo (métrico)</button>
            <button role="radio" aria-checked={sistema === "dp"} className={sistema === "dp" ? "on" : ""} onClick={() => setSistema("dp")}>Diametral pitch (pulg.)</button>
          </div>
          <div className="select">
            {sistema === "modulo" ? (
              <select aria-label="Módulo" value={modulo} onChange={(e) => setModulo(Number(e.target.value))}>
                <optgroup label="Serie 1 (preferente)">{MODULOS_SERIE1.map((v) => <option key={v} value={v}>Módulo {String(v).replace(".", ",")}</option>)}</optgroup>
                <optgroup label="Serie 2">{MODULOS_SERIE2.map((v) => <option key={v} value={v}>Módulo {String(v).replace(".", ",")}</option>)}</optgroup>
              </select>
            ) : (
              <select aria-label="Diametral pitch" value={dp} onChange={(e) => setDp(Number(e.target.value))}>
                {DIAMETRAL_PITCH.map((v) => <option key={v} value={v}>DP {String(v).replace(".", ",")} (equivale a m {f(25.4 / v, 3)})</option>)}
              </select>
            )}
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="fila2 iguales">
          <div className="campo">
            <label className="etq" htmlFor="ze"><b>2</b> Dientes (Z)</label>
            <input id="ze" type="number" min={6} max={300} value={z} onChange={(e) => setZ(Number(e.target.value))} onBlur={() => setZ(zz)} className="num-grande" />
          </div>
          <div className="campo">
            <span className="etq"><b>3</b> Ángulo de presión</span>
            <div className="seg chico">
              <button className={alfa === 20 ? "on" : ""} onClick={() => setAlfa(20)}>20°</button>
              <button className={alfa === 14.5 ? "on" : ""} onClick={() => setAlfa(14.5)}>14,5°</button>
            </div>
          </div>
        </div>

        <div className="fila2">
          <label className="mini">Desplazamiento de perfil x
            <input type="text" inputMode="decimal" value={xTxt} onChange={(e) => setXTxt(e.target.value)} />
          </label>
          <label className="mini">Ancho del diente b (mm)
            <input type="text" inputMode="decimal" value={bTxt} onChange={(e) => setBTxt(e.target.value)} />
          </label>
        </div>

        <div className="campo">
          <span className="etq etq-ico"><Icono n="engranaje" size={17} /> Engranaje compañero (opcional)</span>
          <div className="fila2 iguales">
            <label className="mini">Dientes Z2<input type="text" inputMode="numeric" placeholder="ej. 40" value={z2Txt} onChange={(e) => setZ2Txt(e.target.value)} /></label>
            <label className="mini">Desplazamiento x2<input type="text" inputMode="decimal" value={x2Txt} onChange={(e) => setX2Txt(e.target.value)} /></label>
          </div>
        </div>

        <div className="fila2">
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> Unidades</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => setU("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => setU("in")}>pulgadas</button>
            </div>
          </div>
          <label className="mini">Agujero (mm)
            <input type="text" inputMode="decimal" placeholder={`${agujero} (sugerido)`} value={agujeroTxt} onChange={(e) => setAgujeroTxt(e.target.value)} />
          </label>
        </div>

        <div className="vista vista-trans">
          <DibujoEngranaje pts={vista} g={g} agujero={agujero} />
        </div>
        <div className="corte no-print">
          <button className="btn-dxf" onClick={bajarDxf}><Icono n="descarga" size={18} /> Descargar DXF para corte</button>
          <p className="nota">Perfil generado simulando el tallado con la cremallera ISO 53 (evolvente, pie redondeado y rebaje reales), en mm. Capa REFERENCIA con el diámetro primitivo.</p>
        </div>
      </section>

      <section className="panel resultados" aria-label="Medidas del engranaje">
        <div className="resumen">
          <span className="resumen-ico"><Icono n="engranaje" size={34} /></span>
          <div className="resumen-txt">
            <h2>Engranaje {nombre} · Z{zz}{x ? ` · x = ${f(x, 2)}` : ""}</h2>
            <p>Recto, α = {String(alfa).replace(".", ",")}° · ISO 53{sistema === "dp" ? ` · m equivalente ${f(m, 3)} mm` : ""}</p>
          </div>
          <button className="btn-prim solo no-print" onClick={() => window.print()}><Icono n="impresora" size={18} /> Imprimir ficha</button>
        </div>

        <div className="tarjetas">
          <Tarjeta t="Diámetros" i="diametro" u={U}>
            <Dato n="Diámetro primitivo" s="d" v={L(g.d)} dest />
            <Dato n="Diámetro exterior" s="da" v={L(g.da)} dest />
            <Dato n="Diámetro de fondo" s="df" v={L(g.df)} dest />
            <Dato n="Diámetro base" s="db" v={L(g.db)} />
          </Tarjeta>

          <Tarjeta t="Control con pie de metro" i="calibre" u={U}>
            <Dato n={`Medida sobre ${g.k} dientes`} s={`W${g.k}`} v={L(g.wk)} dest />
            <Dato n="Espesor cordal del diente" s="sc" v={L(g.sCordal)} dest />
            <Dato n="Altura cordal (para el calibre)" s="hc" v={L(g.hCordal)} />
            <p className="nota">Wk: abarque {g.k} dientes con las caras planas del pie de metro. El espesor cordal se mide con calibre de dientes, ajustado a la altura hc desde la punta.</p>
          </Tarjeta>

          <Tarjeta t="Diente" i="diente" u={U}>
            <Dato n="Paso circular" s="p" v={L(g.p)} />
            <Dato n="Espesor en el primitivo (arco)" s="s" v={L(g.s)} />
            <Dato n="Altura total del diente" s="h" v={L(g.h)} dest />
            <Dato n="Altura de cabeza / de pie" s="ha/hf" v={`${L(g.ha)} / ${L(g.hf)}`} />
            <Dato n="Juego en el fondo" s="c" v={L(g.c)} />
          </Tarjeta>

          {par && g2 && (
            <Tarjeta t="Pareja de engranajes" i="ancho" u={U}>
              <Dato n="Distancia entre centros" s="a" v={L(par.a)} dest />
              <Dato n="Relación de transmisión" s="i" v={`${f(par.relacion, 3)} : 1`} dest />
              <Dato n={`Diámetro exterior Z${g2.z}`} s="da2" v={L(g2.da)} />
              {(x !== 0 || x2 !== 0) && <Dato n="Ángulo de presión de trabajo" s="αw" v={`${f(par.alfaW, 2)}°`} />}
              <Dato n="Razón de contacto" s="ε" v={f(par.razonContacto, 2)} />
              <p className="nota">{par.razonContacto < 1.2 ? "⚠ Razón de contacto baja (bajo 1,2): engrane brusco." : "Razón de contacto adecuada (sobre 1,2)."}</p>
            </Tarjeta>
          )}

          <Tarjeta t="Material de partida (acero)" i="peso" u="">
            <div className="entradas"><label>Sobremedida (mm)<input type="number" min={0} step={0.5} value={sobremedida} onChange={(e) => setSobremedida(Number(e.target.value) || 0)} /></label></div>
            <Dato n="Ø de corte" s="" v={`${L(mat.dCorte)} ${U}`} dest />
            <Dato n="Largo / espesor de corte" s="" v={`${L(mat.largoCorte)} ${U}`} />
            <Dato n="Peso bruto" s="" v={kg(mat.pesoBruto)} />
            <Dato n="Peso aprox. terminado" s="" v={kg(mat.pesoNeto)} />
          </Tarjeta>

          <article className="tarjeta tarjeta-avisos">
            <header><h3><Icono n="escudo" size={20} className="tarjeta-ico" />Revisión</h3></header>
            <ul className="avisos">
              {g.rebaje ? (
                <li className="aviso-ojo"><Icono n="info" size={17} /><span>Con {zz} dientes a {String(alfa).replace(".", ",")}° la herramienta rebaja el pie del diente (mínimo sin rebaje: {Math.ceil(g.zMinSinRebaje)} dientes). Para evitarlo use un desplazamiento x ≥ {f(g.xMinSinRebaje, 2)}.</span></li>
              ) : (
                <li className="aviso-ok"><Icono n="check" size={17} /><span>Sin rebaje en el pie del diente.</span></li>
              )}
              {g.puntaAguda && <li className="aviso-mal"><Icono n="info" size={17} /><span>Diente en punta: espesor en la cabeza de {L(g.sa)} {U} (menos de 0,2·m). Reduzca el desplazamiento.</span></li>}
            </ul>
          </article>
        </div>
        <p className="aviso">Fórmulas ISO 53 / DIN 867 para dentado recto exterior. Verifique tolerancias y juego entre dientes según la aplicación.</p>
      </section>
    </div>
  );
}

function DibujoEngranaje({ pts, g, agujero }: { pts: [number, number][]; g: ReturnType<typeof calcularEngranaje>; agujero: number }) {
  const m = g.da / 2;
  const fs = m * 0.13;
  const xD = -m * 1.22, xDa = m * 1.22, yDf = m * 1.28;
  return (
    <svg viewBox={`${-m * 1.62} ${-m * 1.12} ${m * 3.24} ${m * 2.6}`} className="dibujo-svg" role="img" aria-label={`Engranaje de ${g.z} dientes`}>
      <defs>
        <marker id="fe" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth={m * 0.09} markerHeight={m * 0.09} orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker>
      </defs>
      <polygon points={aPuntos(pts)} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <circle r={g.d / 2} className="d-primitivo" vectorEffect="non-scaling-stroke" />
      {agujero > 0 && <circle r={agujero / 2} className="d-agujero" vectorEffect="non-scaling-stroke" />}
      <g className="cota">
        <path d={`M0 ${-g.d / 2}H${xD - m * 0.05}M0 ${g.d / 2}H${xD - m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${xD} ${-g.d / 2}V${g.d / 2}`} markerStart="url(#fe)" markerEnd="url(#fe)" vectorEffect="non-scaling-stroke" />
        <text x={xD - fs * 0.6} y={0} fontSize={fs} textAnchor="end" dominantBaseline="middle">d</text>
      </g>
      <g className="cota">
        <path d={`M0 ${-m}H${xDa + m * 0.05}M0 ${m}H${xDa + m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${xDa} ${-m}V${m}`} markerStart="url(#fe)" markerEnd="url(#fe)" vectorEffect="non-scaling-stroke" />
        <text x={xDa + fs * 0.6} y={0} fontSize={fs} dominantBaseline="middle">da</text>
      </g>
      <g className="cota">
        <path d={`M${-g.df / 2} 0V${yDf + m * 0.05}M${g.df / 2} 0V${yDf + m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${-g.df / 2} ${yDf}H${g.df / 2}`} markerStart="url(#fe)" markerEnd="url(#fe)" vectorEffect="non-scaling-stroke" />
        <text x={0} y={yDf - fs * 0.45} fontSize={fs} textAnchor="middle">df</text>
      </g>
    </svg>
  );
}

function Tarjeta({ t, i, u, children }: { t: string; i: string; u: string; children: React.ReactNode }) {
  return (
    <article className="tarjeta">
      <header><h3><Icono n={i} size={20} className="tarjeta-ico" />{t}</h3>{u && <span className="u">{u}</span>}</header>
      <dl>{children}</dl>
    </article>
  );
}

function Dato({ n, s, v, dest }: { n: string; s: string; v: string; dest?: boolean }) {
  return (
    <div className={`dato ${dest ? "dest" : ""}`}>
      <dt>{n}{s && <span className="sim">{s}</span>}</dt>
      <dd>{v}</dd>
    </div>
  );
}
