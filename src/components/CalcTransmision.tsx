"use client";

import { useEffect, useMemo, useState } from "react";
import { CADENAS, cadenaPorId, type Norma } from "@/lib/cadenas";
import { largo, num, unidad, type Unidad } from "@/lib/formato";
import { codigo, type Idioma } from "@/lib/idioma";
import { avisos, calcularTransmision } from "@/lib/transmision";
import { Icono } from "./Iconos";

const TX = {
  es: {
    datos: "Datos de la transmisión", datosSub: "Cadena, dientes de cada piñón y distancia entre ejes.",
    cadena: "Cadena", iso: "ISO / DIN (europea)", asa: "ASA / ANSI (americana)", paso: "Paso de la cadena",
    z1: "Piñón motriz (Z1)", z2: "Conducido (Z2)", dist: "Distancia entre centros", rpm: "RPM motriz (opcional)", ej: "ej. 1450",
    unidades: "Unidades", pulgadas: "pulgadas", esquema: "Esquema de la transmisión",
    eslabones: "eslabones", ingrese: "Ingrese la distancia entre centros", resultado: "Resultado",
    eslabonesPasos: "Eslabones (pasos)", largoCadena: "Largo de cadena", teorico: "Largo teórico exacto", pasos: "pasos",
    notaPar: "Se redondea al número par siguiente para usar un eslabón de unión normal.",
    distTit: "Distancia entre centros", distExacta: (n: number) => `Distancia exacta con ${n} eslabones`, ajuste: "Ajuste respecto de lo ingresado", enPasos: "En pasos",
    tensado: (a: string, b: string) => `Deje un recorrido de tensado de al menos 1 a 2 pasos (${a} – ${b}) para el estiramiento de la cadena.`,
    pinones: "Piñones", relacion: "Relación de transmisión", dpMotriz: "Dp motriz", dpConducido: "Dp conducido", contacto: "Ángulo de contacto (piñón chico)",
    medidasDel: "Medidas del", velocidades: "Velocidades", rpm2: "RPM del conducido", vel: "Velocidad de la cadena",
    revision: "Revisión del diseño", calc: "/",
    aviso: "Largo = 2C/p + (Z1+Z2)/2 + p·((Z2−Z1)/2π)²/C. Recomendaciones habituales de diseño de transmisiones por cadena; para cargas altas verifique la potencia con el catálogo del fabricante de la cadena.",
  },
  en: {
    datos: "Drive data", datosSub: "Chain, teeth on each sprocket and center distance.",
    cadena: "Chain", iso: "ISO / DIN (European)", asa: "ANSI (American)", paso: "Chain pitch",
    z1: "Driver sprocket (N1)", z2: "Driven (N2)", dist: "Center distance", rpm: "Driver RPM (optional)", ej: "e.g. 1750",
    unidades: "Units", pulgadas: "inches", esquema: "Drive sketch",
    eslabones: "links", ingrese: "Enter the center distance", resultado: "Result",
    eslabonesPasos: "Links (pitches)", largoCadena: "Chain length", teorico: "Exact theoretical length", pasos: "pitches",
    notaPar: "Rounded up to the next even number so a standard connecting link can be used.",
    distTit: "Center distance", distExacta: (n: number) => `Exact distance with ${n} links`, ajuste: "Adjustment vs. your input", enPasos: "In pitches",
    tensado: (a: string, b: string) => `Allow at least 1 to 2 pitches of take-up (${a} – ${b}) for chain elongation.`,
    pinones: "Sprockets", relacion: "Speed ratio", dpMotriz: "Driver pitch dia.", dpConducido: "Driven pitch dia.", contacto: "Wrap angle (small sprocket)",
    medidasDel: "Dimensions of", velocidades: "Speeds", rpm2: "Driven RPM", vel: "Chain speed",
    revision: "Design check", calc: "/en/",
    aviso: "Length = 2C/p + (N1+N2)/2 + p·((N2−N1)/2π)²/C. Common chain-drive design guidelines; for heavy loads check the power rating in the chain manufacturer's catalog.",
  },
};

export function CalcTransmision({ l = "es" }: { l?: Idioma }) {
  const t = TX[l];
  const en = l === "en";
  const [norma, setNorma] = useState<Norma>(en ? "ASA" : "ISO");
  const [cadenaId, setCadenaId] = useState(en ? "asa40" : "08b");
  const [z1, setZ1] = useState(17);
  const [z2, setZ2] = useState(34);
  const [cTxt, setCTxt] = useState(en ? "20" : "500");
  const [rpmTxt, setRpmTxt] = useState("");
  const [u, setU] = useState<Unidad>(en ? "in" : "mm");

  // Parámetros compartidos (?c=08b&z1=17&z2=34&d=500&n=1450) — d siempre en mm
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = cadenaPorId(q.get("c") ?? "");
    if (c) { setCadenaId(c.id); setNorma(c.norma); }
    const a = Number(q.get("z1")), b = Number(q.get("z2"));
    if (a >= 6 && a <= 150) setZ1(a);
    if (b >= 6 && b <= 150) setZ2(b);
    const d = Number(q.get("d"));
    const uq = q.get("u") === "in" ? "in" : q.get("u") === "mm" ? "mm" : null;
    if (uq) setU(uq);
    if (d > 0) setCTxt((uq ?? (en ? "in" : "mm")) === "in" ? (d / 25.4).toFixed(2) : String(d));
    if (Number(q.get("n")) > 0) setRpmTxt(q.get("n")!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cadenas = CADENAS.filter((c) => c.norma === norma);
  const cadena = cadenaPorId(cadenaId) ?? cadenas[0];
  const zz1 = Math.min(Math.max(Math.round(z1) || 6, 6), 150);
  const zz2 = Math.min(Math.max(Math.round(z2) || 6, 6), 150);
  const factor = u === "mm" ? 1 : 25.4;
  const cMm = (parseFloat(cTxt.replace(",", ".")) || 0) * factor;
  const rpm = parseFloat(rpmTxt.replace(",", ".")) || 0;

  useEffect(() => {
    const q = new URLSearchParams({ c: cadena.id, z1: String(zz1), z2: String(zz2), d: String(Math.round(cMm)), u });
    if (rpm > 0) q.set("n", String(rpm));
    window.history.replaceState(null, "", `?${q}`);
  }, [cadena.id, zz1, zz2, cMm, rpm, u]);

  const valido = cMm > 0;
  const tr = useMemo(
    () => (valido ? calcularTransmision({ p: cadena.p, z1: zz1, z2: zz2, c: cMm, rpm1: rpm || undefined }) : null),
    [cadena.p, zz1, zz2, cMm, rpm, valido],
  );
  const lista = tr ? avisos(tr, zz1, zz2, l) : [];
  const L = (mm: number) => largo(mm, u, l);
  const U = unidad(u);
  const f = (n: number, d = 0) => num(n, d, l);
  const N = en ? "N" : "Z";

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
      <section className="panel seleccion" aria-label={t.datos}>
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="cadena" size={22} /></span>
          <div>
            <h2>{t.datos}</h2>
            <p>{t.datosSub}</p>
          </div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> {t.cadena}</span>
          <div className="seg" role="radiogroup" aria-label={t.cadena}>
            {((en ? ["ASA", "ISO"] : ["ISO", "ASA"]) as Norma[]).map((n) => (
              <button key={n} role="radio" aria-checked={norma === n} className={norma === n ? "on" : ""} onClick={() => cambiarNorma(n)}>
                {n === "ISO" ? t.iso : t.asa}
              </button>
            ))}
          </div>
          <div className="select">
            <select aria-label={t.paso} value={cadena.id} onChange={(e) => setCadenaId(e.target.value)}>
              {cadenas.map((c) => (
                <option key={c.id} value={c.id}>{c.medida} — {codigo(c, l)}{c.equivalente ? ` / ${c.equivalente}` : ""} (p = {c.p} mm)</option>
              ))}
            </select>
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="fila2 iguales">
          <div className="campo">
            <label className="etq" htmlFor="z1"><b>2</b> {t.z1}</label>
            <input id="z1" type="number" min={6} max={150} value={z1} onChange={(e) => setZ1(Number(e.target.value))} onBlur={() => setZ1(zz1)} className="num-grande" />
          </div>
          <div className="campo">
            <label className="etq" htmlFor="z2"><b>3</b> {t.z2}</label>
            <input id="z2" type="number" min={6} max={150} value={z2} onChange={(e) => setZ2(Number(e.target.value))} onBlur={() => setZ2(zz2)} className="num-grande" />
          </div>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="dist"><b>4</b> {t.dist} ({U})</label>
          <input id="dist" type="text" inputMode="decimal" value={cTxt} onChange={(e) => setCTxt(e.target.value)} className="num-grande" />
        </div>

        <div className="fila2">
          <div className="campo">
            <label className="etq etq-ico" htmlFor="rpm"><Icono n="engranaje" size={17} /> {t.rpm}</label>
            <input id="rpm" type="text" inputMode="decimal" placeholder={t.ej} value={rpmTxt} onChange={(e) => setRpmTxt(e.target.value)} />
          </div>
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> {t.unidades}</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => cambiarUnidad("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => cambiarUnidad("in")}>{t.pulgadas}</button>
            </div>
          </div>
        </div>

        {tr && (
          <div className="vista vista-trans">
            <DibujoTransmision dp1={tr.dp1} dp2={tr.dp2} c={tr.cReal} etiqueta={t.esquema} />
          </div>
        )}
      </section>

      <section className="panel resultados" aria-label={t.resultado}>
        <div className="resumen">
          <span className="resumen-ico"><Icono n="cadena" size={34} /></span>
          <div className="resumen-txt">
            <h2>{tr ? `${tr.eslabones} ${t.eslabones} · ${codigo(cadena, l)}` : t.ingrese}</h2>
            <p>{N}{zz1} → {N}{zz2} · {cadena.medida}</p>
          </div>
        </div>

        {tr && (
          <div className="tarjetas">
            <article className="tarjeta">
              <header><h3><Icono n="cadena" size={20} className="tarjeta-ico" />{t.cadena}</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>{t.eslabonesPasos}</dt><dd>{tr.eslabones}</dd></div>
                <div className="dato dest"><dt>{t.largoCadena}</dt><dd>{L(tr.largoMm)}</dd></div>
                <div className="dato"><dt>{t.teorico}</dt><dd>{f(tr.eslabonesExactos, 2)} {t.pasos}</dd></div>
              </dl>
              <p className="nota">{t.notaPar}</p>
            </article>

            <article className="tarjeta">
              <header><h3><Icono n="ancho" size={20} className="tarjeta-ico" />{t.distTit}</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>{t.distExacta(tr.eslabones)}</dt><dd>{L(tr.cReal)}</dd></div>
                <div className="dato"><dt>{t.ajuste}</dt><dd>{tr.ajusteC >= 0 ? "+" : ""}{L(tr.ajusteC)}</dd></div>
                <div className="dato"><dt>{t.enPasos}</dt><dd>{f(tr.cEnPasos, 1)}</dd></div>
              </dl>
              <p className="nota">{t.tensado(L(cadena.p), L(2 * cadena.p))}</p>
            </article>

            <article className="tarjeta">
              <header><h3><Icono n="diametro" size={20} className="tarjeta-ico" />{t.pinones}</h3><span className="u">{U}</span></header>
              <dl>
                <div className="dato dest"><dt>{t.relacion}</dt><dd>{f(tr.relacion, 2)} : 1</dd></div>
                <div className="dato"><dt>{t.dpMotriz} {N}{zz1}</dt><dd>{L(tr.dp1)}</dd></div>
                <div className="dato"><dt>{t.dpConducido} {N}{zz2}</dt><dd>{L(tr.dp2)}</dd></div>
                <div className="dato"><dt>{t.contacto}</dt><dd>{f(tr.abrazamiento, 1)}°</dd></div>
              </dl>
              <p className="nota">
                <a href={`${t.calc}?c=${cadena.id}&z=${zz1}`}>{t.medidasDel} {N}{zz1}</a> · <a href={`${t.calc}?c=${cadena.id}&z=${zz2}`}>{t.medidasDel} {N}{zz2}</a>
              </p>
            </article>

            {tr.rpm2 !== undefined && tr.velocidad !== undefined && (
              <article className="tarjeta">
                <header><h3><Icono n="engranaje" size={20} className="tarjeta-ico" />{t.velocidades}</h3></header>
                <dl>
                  <div className="dato dest"><dt>{t.rpm2}</dt><dd>{f(tr.rpm2, 0)} rpm</dd></div>
                  <div className="dato"><dt>{t.vel}</dt><dd>{f(tr.velocidad, 2)} m/s{en ? ` (${f(tr.velocidad * 196.85, 0)} ft/min)` : ""}</dd></div>
                </dl>
              </article>
            )}

            <article className="tarjeta tarjeta-avisos">
              <header><h3><Icono n="escudo" size={20} className="tarjeta-ico" />{t.revision}</h3></header>
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

        <p className="aviso">{t.aviso}</p>
      </section>
    </div>
  );
}

/** Esquema a escala: dos círculos primitivos y la cadena por sus tangentes exteriores. */
function DibujoTransmision({ dp1, dp2, c, etiqueta }: { dp1: number; dp2: number; c: number; etiqueta: string }) {
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
    <svg viewBox={`${-r1 - m * 0.3} ${-m} ${c + r1 + r2 + m * 0.6} ${2 * m}`} className="dibujo-svg" role="img" aria-label={etiqueta}>
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
