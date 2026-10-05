"use client";

import { useEffect, useMemo, useState } from "react";
import { CADENAS, cadenaPorId, type Norma } from "@/lib/cadenas";
import { largo, unidad, type Unidad } from "@/lib/formato";
import { avisos, calcularTransmision } from "@/lib/transmision";
import { Icono } from "./Iconos";

const fmt = (n: number, d = 0) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export function CalcTransmision() {
  const [norma, setNorma] = useState<Norma>("ISO");
  const [cadenaId, setCadenaId] = useState("08b");
  const [z1, setZ1] = useState(17);
  const [z2, setZ2] = useState(34);
  const [cTxt, setCTxt] = useState("500");
  const [rpmTxt, setRpmTxt] = useState("");
  const [u, setU] = useState<Unidad>("mm");

  // Parámetros compartidos (?c=08b&z1=17&z2=34&d=500&n=1450)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = cadenaPorId(q.get("c") ?? "");
    if (c) { setCadenaId(c.id); setNorma(c.norma); }
    const a = Number(q.get("z1")), b = Number(q.get("z2"));
    if (a >= 6 && a <= 150) setZ1(a);
    if (b >= 6 && b <= 150) setZ2(b);
    if (Number(q.get("d")) > 0) setCTxt(q.get("d")!);
    if (Number(q.get("n")) > 0) setRpmTxt(q.get("n")!);
  }, []);

  const cadenas = CADENAS.filter((c) => c.norma === norma);
  const cadena = cadenaPorId(cadenaId) ?? cadenas[0];
  const zz1 = Math.min(Math.max(Math.round(z1) || 6, 6), 150);
  const zz2 = Math.min(Math.max(Math.round(z2) || 6, 6), 150);
  const factor = u === "mm" ? 1 : 25.4;
  const cMm = (parseFloat(cTxt.replace(",", ".")) || 0) * factor;
  const rpm = parseFloat(rpmTxt.replace(",", ".")) || 0;

  useEffect(() => {
    const q = new URLSearchParams({ c: cadena.id, z1: String(zz1), z2: String(zz2), d: String(Math.round(cMm)) });
    if (rpm > 0) q.set("n", String(rpm));
    window.history.replaceState(null, "", `?${q}`);
  }, [cadena.id, zz1, zz2, cMm, rpm]);

  const valido = cMm > 0;
  const t = useMemo(
    () => (valido ? calcularTransmision({ p: cadena.p, z1: zz1, z2: zz2, c: cMm, rpm1: rpm || undefined }) : null),
    [cadena.p, zz1, zz2, cMm, rpm, valido],
  );
  const lista = t ? avisos(t, zz1, zz2) : [];
  const L = (mm: number) => largo(mm, u);
  const U = unidad(u);

  const cambiarNorma = (n: Norma) => {
    setNorma(n);
    const mismo = CADENAS.find((c) => c.norma === n && c.p === cadena.p);
    setCadenaId((mismo ?? CADENAS.find((c) => c.norma === n)!).id);
  };
  const cambiarUnidad = (n: Unidad) => {
    if (n === u) return;
    const v = parseFloat(cTxt.replace(",", "."));
    if (v > 0) setCTxt(n === "in" ? (v / 25.4).toFixed(2) : String(Math.round(v * 25.4)));
    setU(n);
  };

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label="Datos de la transmisión">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="cadena" size={22} /></span>
          <div>
            <h2>Datos de la transmisión</h2>
            <p>Cadena, dientes de cada piñón y distancia entre ejes.</p>
          </div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> Cadena</span>
          <div className="seg" role="radiogroup" aria-label="Norma">
            {(["ISO", "ASA"] as Norma[]).map((n) => (
              <button key={n} role="radio" aria-checked={norma === n} className={norma === n ? "on" : ""} onClick={() => cambiarNorma(n)}>
                {n === "ISO" ? "ISO / DIN (europea)" : "ASA / ANSI (americana)"}
              </button>
            ))}
          </div>
          <div className="select">
            <select aria-label="Paso de la cadena" value={cadena.id} onChange={(e) => setCadenaId(e.target.value)}>
              {cadenas.map((c) => (
                <option key={c.id} value={c.id}>{c.medida} — {c.codigo}{c.equivalente ? ` / ${c.equivalente}` : ""} (p = {c.p} mm)</option>
              ))}
            </select>
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="fila2 iguales">
          <div className="campo">
            <label className="etq" htmlFor="z1"><b>2</b> Piñón motriz (Z1)</label>
            <input id="z1" type="number" min={6} max={150} value={z1} onChange={(e) => setZ1(Number(e.target.value))} onBlur={() => setZ1(zz1)} className="num-grande" />
          </div>
          <div className="campo">
            <label className="etq" htmlFor="z2"><b>3</b> Conducido (Z2)</label>
            <input id="z2" type="number" min={6} max={150} value={z2} onChange={(e) => setZ2(Number(e.target.value))} onBlur={() => setZ2(zz2)} className="num-grande" />
          </div>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="dist"><b>4</b> Distancia entre centros ({U})</label>
          <input id="dist" type="text" inputMode="decimal" value={cTxt} onChange={(e) => setCTxt(e.target.value)} className="num-grande" />
        </div>

        <div className="fila2">
          <div className="campo">
            <label className="etq etq-ico" htmlFor="rpm"><Icono n="engranaje" size={17} /> RPM motriz (opcional)</label>
            <input id="rpm" type="text" inputMode="decimal" placeholder="ej. 1450" value={rpmTxt} onChange={(e) => setRpmTxt(e.target.value)} />
          </div>
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> Unidades</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => cambiarUnidad("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => cambiarUnidad("in")}>pulgadas</button>
            </div>
          </div>
        </div>

        {t && (
          <div className="vista vista-trans">
            <DibujoTransmision dp1={t.dp1} dp2={t.dp2} c={t.cReal} />
          </div>
        )}
      </section>

      <section className="panel resultados" aria-label="Resultado">
        <div className="resumen">
          <span className="resumen-ico"><Icono n="cadena" size={34} /></span>
          <div className="resumen-txt">
            <h2>{t ? `${t.eslabones} eslabones · ${cadena.codigo}` : "Ingrese la distancia entre centros"}</h2>
            <p>Z{zz1} → Z{zz2} · {cadena.medida}</p>
          </div>
        </div>

        {t && (
          <div className="tarjetas">
            <article className="tarjeta">
              <header><h3><Icono n="cadena" size={20} className="tarjeta-ico" />Cadena</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>Eslabones (pasos)</dt><dd>{t.eslabones}</dd></div>
                <div className="dato dest"><dt>Largo de cadena</dt><dd>{L(t.largoMm)}</dd></div>
                <div className="dato"><dt>Largo teórico exacto</dt><dd>{fmt(t.eslabonesExactos, 2)} pasos</dd></div>
              </dl>
              <p className="nota">Se redondea al número par siguiente para usar un eslabón de unión normal.</p>
            </article>

            <article className="tarjeta">
              <header><h3><Icono n="ancho" size={20} className="tarjeta-ico" />Distancia entre centros</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>Distancia exacta con {t.eslabones} eslabones</dt><dd>{L(t.cReal)}</dd></div>
                <div className="dato"><dt>Ajuste respecto de lo ingresado</dt><dd>{t.ajusteC >= 0 ? "+" : ""}{L(t.ajusteC)}</dd></div>
                <div className="dato"><dt>En pasos</dt><dd>{fmt(t.cEnPasos, 1)}</dd></div>
              </dl>
              <p className="nota">Deje un recorrido de tensado de al menos 1 a 2 pasos ({L(cadena.p)} – {L(2 * cadena.p)}) para el estiramiento de la cadena.</p>
            </article>

            <article className="tarjeta">
              <header><h3><Icono n="diametro" size={20} className="tarjeta-ico" />Piñones</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>Relación de transmisión</dt><dd>{fmt(t.relacion, 2)} : 1</dd></div>
                <div className="dato"><dt>Dp motriz Z{zz1}</dt><dd>{L(t.dp1)}</dd></div>
                <div className="dato"><dt>Dp conducido Z{zz2}</dt><dd>{L(t.dp2)}</dd></div>
                <div className="dato"><dt>Ángulo de contacto (piñón chico)</dt><dd>{fmt(t.abrazamiento, 1)}°</dd></div>
              </dl>
              <p className="nota">
                <a href={`/?c=${cadena.id}&z=${zz1}`}>Medidas del Z{zz1}</a> · <a href={`/?c=${cadena.id}&z=${zz2}`}>Medidas del Z{zz2}</a>
              </p>
            </article>

            {t.rpm2 !== undefined && t.velocidad !== undefined && (
              <article className="tarjeta">
                <header><h3><Icono n="engranaje" size={20} className="tarjeta-ico" />Velocidades</h3></header>
                <dl>
                  <div className="dato dest"><dt>RPM del conducido</dt><dd>{fmt(t.rpm2, 0)} rpm</dd></div>
                  <div className="dato"><dt>Velocidad de la cadena</dt><dd>{fmt(t.velocidad, 2)} m/s</dd></div>
                </dl>
              </article>
            )}

            <article className="tarjeta tarjeta-avisos">
              <header><h3><Icono n="escudo" size={20} className="tarjeta-ico" />Revisión del diseño</h3></header>
              <ul className="avisos">
                {lista.map((a, i) => (
                  <li key={i} className={`aviso-${a.nivel}`}>
                    <Icono n={a.nivel === "ok" ? "check" : "info"} size={17} />
                    <span>{a.texto}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        )}

        <p className="aviso">
          Largo = 2C/p + (Z1+Z2)/2 + p·((Z2−Z1)/2π)²/C. Recomendaciones habituales de diseño de transmisiones por cadena;
          para cargas altas verifique la potencia con el catálogo del fabricante de la cadena.
        </p>
      </section>
    </div>
  );
}

/** Esquema a escala: dos círculos primitivos y la cadena por sus tangentes exteriores. */
function DibujoTransmision({ dp1, dp2, c }: { dp1: number; dp2: number; c: number }) {
  const r1 = dp1 / 2, r2 = dp2 / 2;
  const nx = (r1 - r2) / c; // normal de la tangente exterior (eje x hacia el conducido)
  const ny = Math.sqrt(Math.max(0, 1 - nx * nx));
  const sup1 = [r1 * nx, -r1 * ny], sup2 = [c + r2 * nx, -r2 * ny];
  const inf1 = [r1 * nx, r1 * ny], inf2 = [c + r2 * nx, r2 * ny];
  const grande1 = nx > 0 ? 1 : 0; // la cadena abraza más de 180° del piñón mayor
  const d = `M${sup1[0]} ${sup1[1]} L${sup2[0]} ${sup2[1]} A${r2} ${r2} 0 ${1 - grande1} 1 ${inf2[0]} ${inf2[1]} L${inf1[0]} ${inf1[1]} A${r1} ${r1} 0 ${grande1} 1 ${sup1[0]} ${sup1[1]}Z`;
  const m = Math.max(r1, r2) * 1.25;
  const fs = Math.max(r1, r2) * 0.32;
  return (
    <svg viewBox={`${-r1 - m * 0.3} ${-m} ${c + r1 + r2 + m * 0.6} ${2 * m}`} className="dibujo-svg" role="img" aria-label="Esquema de la transmisión">
      <circle cx={0} cy={0} r={r1} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <circle cx={c} cy={0} r={r2} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <path d={d} className="d-cadena" vectorEffect="non-scaling-stroke" />
      <circle r={Math.max(r1 * 0.12, 1)} className="d-centro" />
      <circle cx={c} r={Math.max(r2 * 0.12, 1)} className="d-centro" />
      <path d={`M0 0H${c}`} className="d-eje-trans" vectorEffect="non-scaling-stroke" />
      <text x={c / 2} y={-fs * 0.3} fontSize={fs} textAnchor="middle" className="d-txt">C</text>
    </svg>
  );
}
