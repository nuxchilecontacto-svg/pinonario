"use client";

import { useEffect, useState } from "react";
import { calcularPinon } from "@/lib/calculo";
import { aPuntos, contornoPinon } from "@/lib/perfil";
import { estadoDesgaste, identificarCadena, identificarPinon } from "@/lib/identificar";
import { Icono } from "./Iconos";

type Modo = "cadena" | "pinon";
const num = (t: string) => parseFloat(t.replace(",", ".")) || 0;
const f = (n: number, d = 2) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export function Identificador() {
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
      <div className="seg modo" role="tablist" aria-label="Qué quieres identificar">
        <button role="tab" aria-selected={modo === "cadena"} className={modo === "cadena" ? "on" : ""} onClick={() => cambiar("cadena")}>
          <Icono n="cadena" size={18} /> Tengo la cadena
        </button>
        <button role="tab" aria-selected={modo === "pinon"} className={modo === "pinon" ? "on" : ""} onClick={() => cambiar("pinon")}>
          <Icono n="engranaje" size={18} /> Tengo el piñón
        </button>
      </div>
      {modo === "cadena" ? <ModoCadena /> : <ModoPinon />}
    </>
  );
}

/* ───────── Cadena ───────── */
function ModoCadena() {
  const [largo, setLargo] = useState("");
  const [pasos, setPasos] = useState("10");
  const [rodillo, setRodillo] = useState("");
  const [ancho, setAncho] = useState("");
  const L = num(largo), N = Math.round(num(pasos)), R = num(rodillo), A = num(ancho);
  const lista = L > 0 && N > 0 ? identificarCadena({ largo: L, pasos: N, rodillo: R || undefined, ancho: A || undefined }) : [];
  const top = lista[0];

  return (
    <div className="calc">
      <section className="panel seleccion">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="calibre" size={22} /></span>
          <div><h2>Mide la cadena</h2><p>Solo necesitas un pie de metro.</p></div>
        </header>
        <EsquemaCadena />
        <div className="campo">
          <span className="etq"><b>1</b> Paso: mide sobre varios eslabones</span>
          <div className="fila2 iguales">
            <label className="mini">Largo medido (mm)<input type="text" inputMode="decimal" placeholder="ej. 127,0" value={largo} onChange={(e) => setLargo(e.target.value)} /></label>
            <label className="mini">N° de pasos medidos<input type="text" inputMode="numeric" value={pasos} onChange={(e) => setPasos(e.target.value)} /></label>
          </div>
          <p className="nota">Del borde izquierdo de un rodillo al borde izquierdo de otro rodillo, {N || "N"} rodillos más allá. Medir 10 pasos es 10 veces más preciso que medir uno.</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="rod"><b>2</b> Diámetro del rodillo (mm)</label>
          <input id="rod" type="text" inputMode="decimal" placeholder="ej. 8,5" value={rodillo} onChange={(e) => setRodillo(e.target.value)} />
        </div>
        <div className="campo">
          <label className="etq" htmlFor="anc"><b>3</b> Ancho interior entre placas (mm, opcional)</label>
          <input id="anc" type="text" inputMode="decimal" placeholder="ej. 7,75" value={ancho} onChange={(e) => setAncho(e.target.value)} />
        </div>
      </section>

      <section className="panel resultados">
        {!top ? (
          <Vacio texto={L > 0 ? "No encontramos una cadena estándar con ese paso. Revise la medida y el número de pasos." : "Ingrese el largo medido y el número de pasos para identificar la cadena."} />
        ) : (
          <>
            <div className="resumen">
              <span className="resumen-ico"><Icono n="cadena" size={34} /></span>
              <div className="resumen-txt">
                <h2>{top.confianza === "baja" ? "Sin coincidencia clara" : `Cadena ${top.cadena.codigo}${top.cadena.equivalente ? ` (${top.cadena.equivalente})` : ""}`}</h2>
                <p>{top.cadena.medida} · paso {f(top.cadena.p)} mm · paso medido {f(L / N, 3)} mm</p>
              </div>
              <Confianza c={top.confianza} />
            </div>
            <div className="tarjetas">
              {lista.map((c, i) => (
                <article key={c.cadena.id} className={`tarjeta candidato ${i === 0 ? "primero" : ""}`}>
                  <header><h3>{i + 1}. {c.cadena.codigo}{c.cadena.equivalente ? ` / ${c.cadena.equivalente}` : ""}</h3><Confianza c={c.confianza} chica /></header>
                  <dl>
                    <Fila n="Norma" v={c.cadena.norma === "ISO" ? "Europea ISO / DIN" : "Americana ASA / ANSI"} />
                    <Fila n="Paso nominal" v={`${f(c.cadena.p)} mm`} />
                    <Fila n="Rodillo nominal" v={`${f(c.cadena.d1)} mm${R ? ` (dif. ${c.difRodillo >= 0 ? "+" : ""}${f(c.difRodillo)})` : ""}`} />
                    <Fila n="Ancho interior" v={`${f(c.cadena.b1)} mm${c.difAncho !== undefined ? ` (dif. ${c.difAncho >= 0 ? "+" : ""}${f(c.difAncho)})` : ""}`} />
                  </dl>
                  <p className="nota"><a href={`/tablas/${c.cadena.id}/`}>Tabla de piñones {c.cadena.codigo}</a> · <a href={`/?c=${c.cadena.id}&z=20`}>Calcular un piñón</a></p>
                </article>
              ))}
              {top.confianza !== "baja" && (() => {
                const d = estadoDesgaste(top.estiramiento);
                return (
                  <article className="tarjeta tarjeta-avisos">
                    <header><h3><Icono n="escudo" size={20} className="tarjeta-ico" />Desgaste de la cadena</h3></header>
                    <div className="dato dest"><dt>Estiramiento</dt><dd>{f(Math.max(0, top.estiramiento), 1)} %</dd></div>
                    <ul className="avisos"><li className={`aviso-${d.nivel}`}><Icono n={d.nivel === "ok" ? "check" : "info"} size={17} /><span>{d.texto}</span></li></ul>
                  </article>
                );
              })()}
              {lista.length > 1 && lista[0].confianza === "media" && lista[1].confianza === "media" && (
                <Desempate texto={!R ? "Mida el diámetro del rodillo: es lo que separa la cadena europea de la americana." : `Mida el ancho interior entre placas: ${lista[0].cadena.codigo} = ${f(lista[0].cadena.b1)} mm y ${lista[1].cadena.codigo} = ${f(lista[1].cadena.b1)} mm.`} />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ───────── Piñón ───────── */
function ModoPinon() {
  const [z, setZ] = useState("");
  const [puntas, setPuntas] = useState("");
  const [fondo, setFondo] = useState("");
  const Z = Math.round(num(z)), P = num(puntas), F = num(fondo);
  const valido = Z >= 6 && Z <= 150 && (P > 0 || F > 0);
  const lista = valido ? identificarPinon({ z: Z, puntas: P || undefined, fondo: F || undefined }) : [];
  const top = lista[0];
  const impar = Z % 2 === 1;

  return (
    <div className="calc">
      <section className="panel seleccion">
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="calibre" size={22} /></span>
          <div><h2>Mide el piñón</h2><p>Cuenta los dientes y mide con pie de metro.</p></div>
        </header>
        <EsquemaPinon impar={impar} />
        <div className="campo">
          <label className="etq" htmlFor="zz"><b>1</b> Número de dientes (Z)</label>
          <input id="zz" type="text" inputMode="numeric" placeholder="ej. 20" value={z} onChange={(e) => setZ(e.target.value)} className="num-grande" />
          <p className="nota">Marca un diente con tiza para no contarlo dos veces.</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="pu"><b>2</b> Medida sobre las puntas (mm)</label>
          <input id="pu" type="text" inputMode="decimal" placeholder="ej. 85,8" value={puntas} onChange={(e) => setPuntas(e.target.value)} />
          <p className="nota">{impar ? "Z impar: de una punta al diente más opuesto (no queda justo enfrente; la calculadora lo corrige)." : "Z par: de punta a punta de dos dientes opuestos."}</p>
        </div>
        <div className="campo">
          <label className="etq" htmlFor="fo"><b>3</b> Medida de fondo a fondo (mm)</label>
          <input id="fo" type="text" inputMode="decimal" placeholder="ej. 72,7" value={fondo} onChange={(e) => setFondo(e.target.value)} />
          <p className="nota">Con las puntas exteriores del pie de metro apoyadas en el fondo de dos huecos opuestos. Es la medida más confiable: el fondo casi no se gasta.</p>
        </div>
      </section>

      <section className="panel resultados">
        {!top ? (
          <Vacio texto={valido ? "No encontramos una cadena estándar que calce. Revise las medidas y el número de dientes." : "Ingrese el número de dientes y al menos una medida para identificar el piñón."} />
        ) : (
          <>
            <div className="resumen">
              <span className="resumen-ico"><Icono n="engranaje" size={34} /></span>
              <div className="resumen-txt">
                <h2>{top.confianza === "baja" ? "Sin coincidencia clara" : `Piñón ${top.cadena.medida} · Z${Z}`}</h2>
                <p>Para cadena {top.cadena.codigo}{top.cadena.equivalente ? ` (${top.cadena.equivalente})` : ""} · {top.cadena.norma === "ISO" ? "europea ISO / DIN" : "americana ASA / ANSI"}</p>
              </div>
              <Confianza c={top.confianza} />
            </div>
            <div className="tarjetas">
              {lista.map((c, i) => (
                <article key={c.cadena.id} className={`tarjeta candidato ${i === 0 ? "primero" : ""}`}>
                  <header><h3>{i + 1}. {c.cadena.codigo} · {c.cadena.medida}</h3><Confianza c={c.confianza} chica /></header>
                  <dl>
                    <Fila n="Puntas esperadas" v={`${f(c.esperadoPuntas[0], 1)} – ${f(c.esperadoPuntas[1], 1)} mm`} marca={P ? (c.difPuntas === 0 ? "ok" : Math.abs(c.difPuntas ?? 0) < 0.03 * c.esperadoPuntas[0] ? "ojo" : "mal") : undefined} />
                    <Fila n="Fondo esperado" v={`${f(c.esperadoFondo)} mm${F ? ` (dif. ${(c.difFondo ?? 0) >= 0 ? "+" : ""}${f(c.difFondo ?? 0)})` : ""}`} marca={F ? (Math.abs(c.difFondo ?? 9) < 0.35 ? "ok" : "mal") : undefined} />
                    <Fila n="Diámetro primitivo" v={`${f(calcularPinon(c.cadena, Z).dp)} mm`} />
                  </dl>
                  <p className="nota"><a href={`/?c=${c.cadena.id}&z=${Z}`}>Ver todas las medidas y descargar DXF →</a></p>
                </article>
              ))}
              {lista.length > 1 && lista[0].confianza === "media" && lista[1].confianza === "media" && (
                <Desempate texto={!F
                  ? `Mida de fondo a fondo: ${lista[0].cadena.codigo} da ${f(lista[0].esperadoFondo)} mm y ${lista[1].cadena.codigo} da ${f(lista[1].esperadoFondo)} mm.`
                  : `Las dos son casi iguales en este Z. Compare el ancho del diente: ${lista[0].cadena.codigo} ≈ ${f(calcularPinon(lista[0].cadena, Z).bf1)} mm y ${lista[1].cadena.codigo} ≈ ${f(calcularPinon(lista[1].cadena, Z).bf1)} mm, o mida la cadena.`} />
              )}
              {P > 0 && top.difPuntas !== undefined && top.difPuntas < 0 && top.confianza !== "baja" && (
                <article className="tarjeta tarjeta-avisos">
                  <ul className="avisos"><li className="aviso-ojo"><Icono n="info" size={17} /><span>Las puntas miden menos de lo normal: los dientes pueden estar gastados (forma de gancho). Si es así, cambie el piñón junto con la cadena.</span></li></ul>
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

function Confianza({ c, chica }: { c: "alta" | "media" | "baja"; chica?: boolean }) {
  const txt = c === "alta" ? "Coincidencia alta" : c === "media" ? "Posible" : "No calza";
  return <span className={`conf conf-${c} ${chica ? "chica" : ""}`}>{chica ? (c === "alta" ? "Alta" : c === "media" ? "Posible" : "No calza") : txt}</span>;
}

function Desempate({ texto }: { texto: string }) {
  return (
    <article className="tarjeta tarjeta-avisos">
      <header><h3><Icono n="calibre" size={20} className="tarjeta-ico" />Para estar seguro</h3></header>
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
function EsquemaCadena() {
  const xs = [20, 60, 100, 140, 180, 220];
  return (
    <svg viewBox="0 0 240 92" className="esquema" role="img" aria-label="Cómo medir el paso de una cadena sobre varios eslabones">
      {xs.slice(0, -1).map((x, i) => (
        <rect key={i} x={x - 9} y={30} width={58} height={26} rx={13} className={i % 2 ? "es-placa2" : "es-placa"} />
      ))}
      {xs.map((x) => <circle key={x} cx={x} cy={43} r={9} className="es-rodillo" />)}
      <path d="M11 22V12M171 22V12" className="es-ext" />
      <path d="M11 16H171" className="es-cota" markerStart="url(#f3)" markerEnd="url(#f3)" />
      <text x={91} y={11} className="es-txt" textAnchor="middle">largo medido (aquí 4 pasos)</text>
      <path d="M100 56V70M100 70" className="es-ext" />
      <path d="M91 78H109" className="es-cota" markerStart="url(#f3)" markerEnd="url(#f3)" />
      <text x={115} y={82} className="es-txt" textAnchor="start">Ø rodillo</text>
      <defs><marker id="f3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
    </svg>
  );
}

function EsquemaPinon({ impar }: { impar: boolean }) {
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
    <svg viewBox="0 0 240 100" className="esquema" role="img" aria-label="Cómo medir un piñón con pie de metro">
      <polygon points={aPuntos(pts, k, cx, cy)} className="es-placa" />
      <circle cx={cx} cy={cy} r={5} className="es-rodillo" />
      <path d={`M${P(de / 2, diente(0))}L${P(de / 2, diente(impar ? op + 1 : op))}`} className="es-cota acento" markerStart="url(#f4)" markerEnd="url(#f4)" />
      <path d={`M${P(dp / 2 - d1 / 2, hueco(0))}L${P(dp / 2 - d1 / 2, hueco(op))}`} className="es-cota" markerStart="url(#f4)" markerEnd="url(#f4)" />
      <path d="M112 30h10" className="es-cota acento" />
      <text x={127} y={33} className="es-txt" textAnchor="start">puntas{impar ? " (corrido)" : ""}</text>
      <path d="M112 50h10" className="es-cota" />
      <text x={127} y={53} className="es-txt" textAnchor="start">fondo a fondo</text>
      <text x={112} y={76} className="es-txt es-nota" textAnchor="start">{impar ? "Z impar: no hay dientes" : "Z par: dientes y huecos"}</text>
      <text x={112} y={87} className="es-txt es-nota" textAnchor="start">{impar ? "justo enfrente" : "quedan enfrentados"}</text>
      <defs><marker id="f4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L10 5 0 9z" className="cota-flecha" /></marker></defs>
    </svg>
  );
}
