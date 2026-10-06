"use client";

import { useEffect, useState } from "react";
import { calcularPinon } from "@/lib/calculo";
import { num as fmtNum } from "@/lib/formato";
import { estadoDesgaste, identificarCadena, identificarPinon } from "@/lib/identificar";
import { codigo, type Idioma } from "@/lib/idioma";
import { aPuntos, contornoPinon } from "@/lib/perfil";
import { Icono } from "./Iconos";

type Modo = "cadena" | "pinon";
const num = (t: string) => parseFloat(t.replace(",", ".")) || 0;

const TX = {
  es: {
    queIdentificar: "Qué quieres identificar", tengoCadena: "Tengo la cadena", tengoPinon: "Tengo el piñón",
    // cadena
    mideCadena: "Mide la cadena", soloPie: "Solo necesitas un pie de metro.",
    pasoTit: "Paso: mide sobre varios eslabones", largoMedido: "Largo medido (mm)", nPasos: "N° de pasos medidos", ejLargo: "ej. 127,0",
    pasoNota: (n: string) => `Del borde izquierdo de un rodillo al borde izquierdo de otro rodillo, ${n} rodillos más allá. Medir 10 pasos es 10 veces más preciso que medir uno.`,
    rodillo: "Diámetro del rodillo (mm)", ejRod: "ej. 8,5", ancho: "Ancho interior entre placas (mm, opcional)", ejAncho: "ej. 7,75",
    sinPaso: "No encontramos una cadena estándar con ese paso. Revise la medida y el número de pasos.",
    ingreseCadena: "Ingrese el largo medido y el número de pasos para identificar la cadena.",
    sinClara: "Sin coincidencia clara", cadenaX: "Cadena", pasoMedido: "paso medido",
    norma: "Norma", europea: "Europea ISO / DIN", americana: "Americana ASA / ANSI",
    pasoNom: "Paso nominal", rodNom: "Rodillo nominal", anchoInt: "Ancho interior", dif: "dif.",
    tablaDe: "Tabla de piñones", calcular: "Calcular un piñón",
    desgaste: "Desgaste de la cadena", estiramiento: "Estiramiento",
    medirRodillo: "Mida el diámetro del rodillo: es lo que separa la cadena europea de la americana.",
    medirAncho: (a: string, b: string, c: string, d: string) => `Mida el ancho interior entre placas: ${a} = ${b} mm y ${c} = ${d} mm.`,
    // piñón
    midePinon: "Mide el piñón", cuentaYMide: "Cuenta los dientes y mide con pie de metro.",
    dientes: "Número de dientes (Z)", ejZ: "ej. 20", tiza: "Marca un diente con tiza para no contarlo dos veces.",
    puntas: "Medida sobre las puntas (mm)", ejPuntas: "ej. 85,8",
    puntasImpar: "Z impar: de una punta al diente más opuesto (no queda justo enfrente; la calculadora lo corrige).", puntasPar: "Z par: de punta a punta de dos dientes opuestos.",
    fondo: "Medida de fondo a fondo (mm)", ejFondo: "ej. 72,7",
    fondoNota: "Con las puntas exteriores del pie de metro apoyadas en el fondo de dos huecos opuestos. Es la medida más confiable: el fondo casi no se gasta.",
    sinCalce: "No encontramos una cadena estándar que calce. Revise las medidas y el número de dientes.",
    ingresePinon: "Ingrese el número de dientes y al menos una medida para identificar el piñón.",
    pinonX: "Piñón", paraCadena: "Para cadena", europeaMin: "europea ISO / DIN", americanaMin: "americana ASA / ANSI",
    puntasEsp: "Puntas esperadas", fondoEsp: "Fondo esperado", dp: "Diámetro primitivo", verTodo: "Ver todas las medidas y descargar DXF →",
    medirFondo: (a: string, b: string, c: string, d: string) => `Mida de fondo a fondo: ${a} da ${b} mm y ${c} da ${d} mm.`,
    casiIguales: (a: string, b: string, c: string, d: string) => `Las dos son casi iguales en este Z. Compare el ancho del diente: ${a} ≈ ${b} mm y ${c} ≈ ${d} mm, o mida la cadena.`,
    gastado: "Las puntas miden menos de lo normal: los dientes pueden estar gastados (forma de gancho). Si es así, cambie el piñón junto con la cadena.",
    paraEstar: "Para estar seguro",
    alta: "Coincidencia alta", posible: "Posible", noCalza: "No calza", altaCorta: "Alta",
    // esquemas
    escCadena: "Cómo medir el paso de una cadena sobre varios eslabones", escLargo: "largo medido (aquí 4 pasos)", escRodillo: "Ø rodillo",
    escPinon: "Cómo medir un piñón con pie de metro", escPuntas: "puntas", escCorrido: " (corrido)", escFondo: "fondo a fondo",
    escImpar1: "Z impar: no hay dientes", escImpar2: "justo enfrente", escPar1: "Z par: dientes y huecos", escPar2: "quedan enfrentados",
    calc: "/", tablas: "/tablas/", z: "Z",
  },
  en: {
    queIdentificar: "What do you want to identify", tengoCadena: "I have the chain", tengoPinon: "I have the sprocket",
    mideCadena: "Measure the chain", soloPie: "All you need is a caliper.",
    pasoTit: "Pitch: measure over several links", largoMedido: "Measured length (mm)", nPasos: "Number of pitches measured", ejLargo: "e.g. 127.0",
    pasoNota: (n: string) => `From the left edge of one roller to the left edge of another roller ${n} rollers away. Measuring 10 pitches is 10 times more accurate than measuring one.`,
    rodillo: "Roller diameter (mm)", ejRod: "e.g. 7.9", ancho: "Inner width between plates (mm, optional)", ejAncho: "e.g. 7.85",
    sinPaso: "No standard chain matches that pitch. Check the measurement and the number of pitches.",
    ingreseCadena: "Enter the measured length and the number of pitches to identify the chain.",
    sinClara: "No clear match", cadenaX: "Chain", pasoMedido: "measured pitch",
    norma: "Standard", europea: "European ISO / DIN", americana: "American ANSI",
    pasoNom: "Nominal pitch", rodNom: "Nominal roller", anchoInt: "Inner width", dif: "diff.",
    tablaDe: "Sprocket table", calcular: "Calculate a sprocket",
    desgaste: "Chain wear", estiramiento: "Elongation",
    medirRodillo: "Measure the roller diameter: it is what tells the European chain from the American one.",
    medirAncho: (a: string, b: string, c: string, d: string) => `Measure the inner width between plates: ${a} = ${b} mm and ${c} = ${d} mm.`,
    midePinon: "Measure the sprocket", cuentaYMide: "Count the teeth and measure with a caliper.",
    dientes: "Number of teeth (N)", ejZ: "e.g. 20", tiza: "Mark one tooth with chalk so you don't count it twice.",
    puntas: "Measurement over the tips (mm)", ejPuntas: "e.g. 86.4",
    puntasImpar: "Odd N: from one tip to the most opposite tooth (it is not exactly opposite; the calculator corrects it).", puntasPar: "Even N: tip to tip of two opposite teeth.",
    fondo: "Root-to-root measurement (mm)", ejFondo: "e.g. 73.3",
    fondoNota: "With the outside jaws of the caliper resting on the bottom of two opposite tooth gaps. It is the most reliable measurement: the root barely wears.",
    sinCalce: "No standard chain fits. Check the measurements and the number of teeth.",
    ingresePinon: "Enter the number of teeth and at least one measurement to identify the sprocket.",
    pinonX: "Sprocket", paraCadena: "For chain", europeaMin: "European ISO / DIN", americanaMin: "American ANSI",
    puntasEsp: "Expected over tips", fondoEsp: "Expected root", dp: "Pitch diameter", verTodo: "See all dimensions and download DXF →",
    medirFondo: (a: string, b: string, c: string, d: string) => `Measure root to root: ${a} gives ${b} mm and ${c} gives ${d} mm.`,
    casiIguales: (a: string, b: string, c: string, d: string) => `Both are almost identical for this tooth count. Compare tooth width: ${a} ≈ ${b} mm and ${c} ≈ ${d} mm, or measure the chain.`,
    gastado: "The tips measure less than normal: the teeth may be worn (hooked). If so, replace the sprocket together with the chain.",
    paraEstar: "To be sure",
    alta: "Strong match", posible: "Possible", noCalza: "No match", altaCorta: "Strong",
    escCadena: "How to measure chain pitch over several links", escLargo: "measured length (here 4 pitches)", escRodillo: "roller Ø",
    escPinon: "How to measure a sprocket with a caliper", escPuntas: "over tips", escCorrido: " (offset)", escFondo: "root to root",
    escImpar1: "Odd N: no tooth sits", escImpar2: "exactly opposite", escPar1: "Even N: teeth and gaps", escPar2: "face each other",
    calc: "/en/", tablas: "/en/tables/", z: "N",
  },
};
type Textos = (typeof TX)["es"];

export function Identificador({ l = "es" }: { l?: Idioma }) {
  const t = TX[l];
  const [modo, setModo] = useState<Modo>("cadena");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("m") === "pinon") setModo("pinon");
  }, []);
  const cambiar = (m: Modo) => {
    setModo(m);
    window.history.replaceState(null, "", m === "pinon" ? "?m=pinon" : "?");
  };

  return (
    <>
      <div className="seg modo" role="tablist" aria-label={t.queIdentificar}>
        <button role="tab" aria-selected={modo === "cadena"} className={modo === "cadena" ? "on" : ""} onClick={() => cambiar("cadena")}>
          <Icono n="cadena" size={18} /> {t.tengoCadena}
        </button>
        <button role="tab" aria-selected={modo === "pinon"} className={modo === "pinon" ? "on" : ""} onClick={() => cambiar("pinon")}>
          <Icono n="engranaje" size={18} /> {t.tengoPinon}
        </button>
      </div>
      {modo === "cadena" ? <ModoCadena t={t} l={l} /> : <ModoPinon t={t} l={l} />}
    </>
  );
}

/* ───────── Cadena ───────── */
function ModoCadena({ t, l }: { t: Textos; l: Idioma }) {
  const [largo, setLargo] = useState("");
  const [pasos, setPasos] = useState("10");
  const [rodillo, setRodillo] = useState("");
  const [ancho, setAncho] = useState("");
  const L = num(largo), N = Math.round(num(pasos)), R = num(rodillo), A = num(ancho);
  const lista = L > 0 && N > 0 ? identificarCadena({ largo: L, pasos: N, rodillo: R || undefined, ancho: A || undefined }) : [];
  const top = lista[0];
  const f = (n: number, d = 2) => fmtNum(n, d, l);

  return (
    <div className="calc">
      <section className="panel seleccion">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="calibre" size={22} /></span>
          <div><h2>{t.mideCadena}</h2><p>{t.soloPie}</p></div>
        </header>
        <EsquemaCadena t={t} />
        <div className="campo">
          <span className="etq"><b>1</b> {t.pasoTit}</span>
          <div className="fila2 iguales">
            <label className="mini">{t.largoMedido}<input type="text" inputMode="decimal" placeholder={t.ejLargo} value={largo} onChange={(e) => setLargo(e.target.value)} /></label>
            <label className="mini">{t.nPasos}<input type="text" inputMode="numeric" value={pasos} onChange={(e) => setPasos(e.target.value)} /></label>
          </div>
          <p className="nota">{t.pasoNota(N ? String(N) : "N")}</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="rod"><b>2</b> {t.rodillo}</label>
          <input id="rod" type="text" inputMode="decimal" placeholder={t.ejRod} value={rodillo} onChange={(e) => setRodillo(e.target.value)} />
        </div>
        <div className="campo">
          <label className="etq" htmlFor="anc"><b>3</b> {t.ancho}</label>
          <input id="anc" type="text" inputMode="decimal" placeholder={t.ejAncho} value={ancho} onChange={(e) => setAncho(e.target.value)} />
        </div>
      </section>

      <section className="panel resultados">
        {!top ? (
          <Vacio texto={L > 0 ? t.sinPaso : t.ingreseCadena} />
        ) : (
          <>
            <div className="resumen">
              <span className="resumen-ico"><Icono n="cadena" size={34} /></span>
              <div className="resumen-txt">
                <h2>{top.confianza === "baja" ? t.sinClara : `${t.cadenaX} ${codigo(top.cadena, l)}${top.cadena.equivalente ? ` (${top.cadena.equivalente})` : ""}`}</h2>
                <p>{top.cadena.medida} · p {f(top.cadena.p)} mm · {t.pasoMedido} {f(L / N, 3)} mm</p>
              </div>
              <Confianza c={top.confianza} t={t} />
            </div>
            <div className="tarjetas">
              {lista.map((c, i) => (
                <article key={c.cadena.id} className={`tarjeta candidato ${i === 0 ? "primero" : ""}`}>
                  <header><h3>{i + 1}. {codigo(c.cadena, l)}{c.cadena.equivalente ? ` / ${c.cadena.equivalente}` : ""}</h3><Confianza c={c.confianza} t={t} chica /></header>
                  <dl>
                    <Fila n={t.norma} v={c.cadena.norma === "ISO" ? t.europea : t.americana} />
                    <Fila n={t.pasoNom} v={`${f(c.cadena.p)} mm`} />
                    <Fila n={t.rodNom} v={`${f(c.cadena.d1)} mm${R ? ` (${t.dif} ${c.difRodillo >= 0 ? "+" : ""}${f(c.difRodillo)})` : ""}`} />
                    <Fila n={t.anchoInt} v={`${f(c.cadena.b1)} mm${c.difAncho !== undefined ? ` (${t.dif} ${c.difAncho >= 0 ? "+" : ""}${f(c.difAncho)})` : ""}`} />
                  </dl>
                  <p className="nota"><a href={`${t.tablas}${c.cadena.id}/`}>{t.tablaDe} {codigo(c.cadena, l)}</a> · <a href={`${t.calc}?c=${c.cadena.id}&z=20`}>{t.calcular}</a></p>
                </article>
              ))}
              {top.confianza !== "baja" && (() => {
                const d = estadoDesgaste(top.estiramiento, l);
                return (
                  <article className="tarjeta tarjeta-avisos">
                    <header><h3><Icono n="escudo" size={20} className="tarjeta-ico" />{t.desgaste}</h3></header>
                    <div className="dato dest"><dt>{t.estiramiento}</dt><dd>{f(Math.max(0, top.estiramiento), 1)} %</dd></div>
                    <ul className="avisos"><li className={`aviso-${d.nivel}`}><Icono n={d.nivel === "ok" ? "check" : "info"} size={17} /><span>{d.texto}</span></li></ul>
                  </article>
                );
              })()}
              {lista.length > 1 && lista[0].confianza === "media" && lista[1].confianza === "media" && (
                <Desempate t={t} texto={!R ? t.medirRodillo : t.medirAncho(codigo(lista[0].cadena, l), f(lista[0].cadena.b1), codigo(lista[1].cadena, l), f(lista[1].cadena.b1))} />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ───────── Piñón ───────── */
function ModoPinon({ t, l }: { t: Textos; l: Idioma }) {
  const [z, setZ] = useState("");
  const [puntas, setPuntas] = useState("");
  const [fondo, setFondo] = useState("");
  const Z = Math.round(num(z)), P = num(puntas), F = num(fondo);
  const valido = Z >= 6 && Z <= 150 && (P > 0 || F > 0);
  const lista = valido ? identificarPinon({ z: Z, puntas: P || undefined, fondo: F || undefined }) : [];
  const top = lista[0];
  const impar = Z % 2 === 1;
  const f = (n: number, d = 2) => fmtNum(n, d, l);

  return (
    <div className="calc">
      <section className="panel seleccion">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="calibre" size={22} /></span>
          <div><h2>{t.midePinon}</h2><p>{t.cuentaYMide}</p></div>
        </header>
        <EsquemaPinon impar={impar} t={t} />
        <div className="campo">
          <label className="etq" htmlFor="zz"><b>1</b> {t.dientes}</label>
          <input id="zz" type="text" inputMode="numeric" placeholder={t.ejZ} value={z} onChange={(e) => setZ(e.target.value)} className="num-grande" />
          <p className="nota">{t.tiza}</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="pu"><b>2</b> {t.puntas}</label>
          <input id="pu" type="text" inputMode="decimal" placeholder={t.ejPuntas} value={puntas} onChange={(e) => setPuntas(e.target.value)} />
          <p className="nota">{impar ? t.puntasImpar : t.puntasPar}</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="fo"><b>3</b> {t.fondo}</label>
          <input id="fo" type="text" inputMode="decimal" placeholder={t.ejFondo} value={fondo} onChange={(e) => setFondo(e.target.value)} />
          <p className="nota">{t.fondoNota}</p>
        </div>
      </section>

      <section className="panel resultados">
        {!top ? (
          <Vacio texto={valido ? t.sinCalce : t.ingresePinon} />
        ) : (
          <>
            <div className="resumen">
              <span className="resumen-ico"><Icono n="engranaje" size={34} /></span>
              <div className="resumen-txt">
                <h2>{top.confianza === "baja" ? t.sinClara : `${t.pinonX} ${top.cadena.medida} · ${t.z}${Z}`}</h2>
                <p>{t.paraCadena} {codigo(top.cadena, l)}{top.cadena.equivalente ? ` (${top.cadena.equivalente})` : ""} · {top.cadena.norma === "ISO" ? t.europeaMin : t.americanaMin}</p>
              </div>
              <Confianza c={top.confianza} t={t} />
            </div>
            <div className="tarjetas">
              {lista.map((c, i) => (
                <article key={c.cadena.id} className={`tarjeta candidato ${i === 0 ? "primero" : ""}`}>
                  <header><h3>{i + 1}. {codigo(c.cadena, l)} · {c.cadena.medida}</h3><Confianza c={c.confianza} t={t} chica /></header>
                  <dl>
                    <Fila n={t.puntasEsp} v={`${f(c.esperadoPuntas[0], 1)} – ${f(c.esperadoPuntas[1], 1)} mm`} marca={P ? (c.difPuntas === 0 ? "ok" : Math.abs(c.difPuntas ?? 0) < 0.03 * c.esperadoPuntas[0] ? "ojo" : "mal") : undefined} />
                    <Fila n={t.fondoEsp} v={`${f(c.esperadoFondo)} mm${F ? ` (${t.dif} ${(c.difFondo ?? 0) >= 0 ? "+" : ""}${f(c.difFondo ?? 0)})` : ""}`} marca={F ? (Math.abs(c.difFondo ?? 9) < 0.35 ? "ok" : "mal") : undefined} />
                    <Fila n={t.dp} v={`${f(calcularPinon(c.cadena, Z).dp)} mm`} />
                  </dl>
                  <p className="nota"><a href={`${t.calc}?c=${c.cadena.id}&z=${Z}`}>{t.verTodo}</a></p>
                </article>
              ))}
              {lista.length > 1 && lista[0].confianza === "media" && lista[1].confianza === "media" && (
                <Desempate t={t} texto={!F
                  ? t.medirFondo(codigo(lista[0].cadena, l), f(lista[0].esperadoFondo), codigo(lista[1].cadena, l), f(lista[1].esperadoFondo))
                  : t.casiIguales(codigo(lista[0].cadena, l), f(calcularPinon(lista[0].cadena, Z).bf1), codigo(lista[1].cadena, l), f(calcularPinon(lista[1].cadena, Z).bf1))} />
              )}
              {P > 0 && top.difPuntas !== undefined && top.difPuntas < 0 && top.confianza !== "baja" && (
                <article className="tarjeta tarjeta-avisos">
                  <ul className="avisos"><li className="aviso-ojo"><Icono n="info" size={17} /><span>{t.gastado}</span></li></ul>
                </article>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ───────── Piezas comunes ───────── */
function Fila({ n, v, marca }: { n: string; v: string; marca?: "ok" | "ojo" | "mal" }) {
  return (
    <div className={`dato ${marca ? `marca-${marca}` : ""}`}>
      <dt>{n}</dt>
      <dd>{marca && <Icono n={marca === "ok" ? "check" : "info"} size={15} className="marca-ico" />} {v}</dd>
    </div>
  );
}

function Confianza({ c, chica, t }: { c: "alta" | "media" | "baja"; chica?: boolean; t: Textos }) {
  const txt = c === "alta" ? (chica ? t.altaCorta : t.alta) : c === "media" ? t.posible : t.noCalza;
  return <span className={`conf conf-${c} ${chica ? "chica" : ""}`}>{txt}</span>;
}

function Desempate({ texto, t }: { texto: string; t: Textos }) {
  return (
    <article className="tarjeta tarjeta-avisos">
      <header><h3><Icono n="calibre" size={20} className="tarjeta-ico" />{t.paraEstar}</h3></header>
      <ul className="avisos"><li className="aviso-ojo"><Icono n="info" size={17} /><span>{texto}</span></li></ul>
    </article>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <div className="vacio">
      <Icono n="calibre" size={44} />
      <p>{texto}</p>
    </div>
  );
}

/* Esquemas de medición */
function EsquemaCadena({ t }: { t: Textos }) {
  const xs = [20, 60, 100, 140, 180, 220];
  return (
    <svg viewBox="0 0 240 92" className="esquema" role="img" aria-label={t.escCadena}>
      {xs.slice(0, -1).map((x, i) => (
        <rect key={i} x={x - 9} y={30} width={58} height={26} rx={13} className={i % 2 ? "es-placa2" : "es-placa"} />
      ))}
      {xs.map((x) => <circle key={x} cx={x} cy={43} r={9} className="es-rodillo" />)}
      <path d="M11 22V12M171 22V12" className="es-ext" />
      <path d="M11 16H171" className="es-cota" markerStart="url(#f3)" markerEnd="url(#f3)" />
      <text x={91} y={11} className="es-txt" textAnchor="middle">{t.escLargo}</text>
      <path d="M100 56V70M100 70" className="es-ext" />
      <path d="M91 78H109" className="es-cota" markerStart="url(#f3)" markerEnd="url(#f3)" />
      <text x={115} y={82} className="es-txt" textAnchor="start">{t.escRodillo}</text>
      <defs><marker id="f3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
    </svg>
  );
}

function EsquemaPinon({ impar, t }: { impar: boolean; t: Textos }) {
  // Piñón real (perfil ISO) de paso 1/2", escalado a radio 40 y con un diente arriba
  const z = impar ? 13 : 12;
  const p = 12.7, d1 = 8.51;
  const dp = p / Math.sin(Math.PI / z);
  const deMin = dp + p * (1 - 1.6 / z) - d1;
  const de = deMin + 0.35 * (dp + 1.25 * p - d1 - deMin); // mismo De que la calculadora
  const k = 40 / (de / 2);
  const cx = 56, cy = 50;
  const giro = -Math.PI / 2 - Math.PI / z;
  const pts = contornoPinon(z, dp, de, d1, giro);
  const P = (r: number, a: number) => `${(cx + r * k * Math.cos(a)).toFixed(1)} ${(cy + r * k * Math.sin(a)).toFixed(1)}`;
  const diente = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / z;
  const hueco = (i: number) => diente(i) + Math.PI / z;
  const op = Math.floor(z / 2);
  return (
    <svg viewBox="0 0 240 100" className="esquema" role="img" aria-label={t.escPinon}>
      <polygon points={aPuntos(pts, k, cx, cy)} className="es-placa" />
      <circle cx={cx} cy={cy} r={5} className="es-rodillo" />
      <path d={`M${P(de / 2, diente(0))}L${P(de / 2, diente(impar ? op + 1 : op))}`} className="es-cota acento" markerStart="url(#f4)" markerEnd="url(#f4)" />
      <path d={`M${P(dp / 2 - d1 / 2, hueco(0))}L${P(dp / 2 - d1 / 2, hueco(op))}`} className="es-cota" markerStart="url(#f4)" markerEnd="url(#f4)" />
      <path d="M112 30h10" className="es-cota acento" />
      <text x={127} y={33} className="es-txt" textAnchor="start">{t.escPuntas}{impar ? t.escCorrido : ""}</text>
      <path d="M112 50h10" className="es-cota" />
      <text x={127} y={53} className="es-txt" textAnchor="start">{t.escFondo}</text>
      <text x={112} y={76} className="es-txt es-nota" textAnchor="start">{impar ? t.escImpar1 : t.escPar1}</text>
      <text x={112} y={87} className="es-txt es-nota" textAnchor="start">{impar ? t.escImpar2 : t.escPar2}</text>
      <defs><marker id="f4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
    </svg>
  );
}
