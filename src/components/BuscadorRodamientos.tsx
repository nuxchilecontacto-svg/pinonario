"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Idioma } from "@/lib/idioma";
import { num } from "@/lib/formato";
import { buscarPorMedidas, leerCodigo } from "@/lib/rodamientos";
import { esMiniatura, explicarSufijos, filasEquivalencias, pulgadas, TXR } from "@/lib/rodamientosTexto";
import { Icono } from "./Iconos";

type Modo = "codigo" | "medidas";

const TX = {
  es: {
    buscar: "Buscar rodamiento", buscarSub: "Escribe el código que trae grabado o mide el rodamiento con pie de metro.",
    porCodigo: "Por código", porMedidas: "Por medidas",
    codigo: "Código del rodamiento", ejCodigo: "Ej: 6205-2RS C3", ejemplos: "Prueba:",
    medidas: "Medidas con pie de metro (mm)", notaMedidas: "Basta con dos medidas; con las tres el resultado es exacto.",
    sinCodigo: "Escribe un código como 6205, 6204-2RS, 608ZZ o 6305 C3.",
    noEsta: (b: string) => `No encontramos el ${b} en la tabla. Por ahora incluye rodamientos rígidos de bolas de una hilera (series 618, 619, 60, 62, 63 y miniatura). Si el código empieza con 1, 2, 3, NU, NJ, 7 o UC, es otro tipo de rodamiento.`,
    sinMedidas: "Ingresa al menos una medida.", sinCalce: "Ningún rodamiento de la tabla calza con esas medidas (tolerancia ±0,4 mm).",
    medidasTit: "Medidas", significa: "Qué significa el código", equivalencias: "Equivalencias por marca",
    ficha: (c: string) => `Ficha completa del ${c} →`, resultados: (n: number) => `${n} rodamiento${n === 1 ? "" : "s"} con esas medidas`,
    base: "/rodamientos/",
  },
  en: {
    buscar: "Find a bearing", buscarSub: "Type the number stamped on it or measure the bearing with a caliper.",
    porCodigo: "By number", porMedidas: "By size",
    codigo: "Bearing number", ejCodigo: "e.g. 6205-2RS C3", ejemplos: "Try:",
    medidas: "Caliper measurements (mm)", notaMedidas: "Two measurements are enough; with all three the result is exact.",
    sinCodigo: "Type a number such as 6205, 6204-2RS, 608ZZ or 6305 C3.",
    noEsta: (b: string) => `${b} is not in the table. For now it covers single row deep groove ball bearings (618, 619, 60, 62, 63 and miniature series). Numbers starting with 1, 2, 3, NU, NJ, 7 or UC are other bearing types.`,
    sinMedidas: "Enter at least one measurement.", sinCalce: "No bearing in the table matches those measurements (±0.4 mm tolerance).",
    medidasTit: "Dimensions", significa: "What the number means", equivalencias: "Brand equivalents",
    ficha: (c: string) => `Full ${c} data sheet →`, resultados: (n: number) => `${n} bearing${n === 1 ? "" : "s"} with those measurements`,
    base: "/en/bearings/",
  },
};

const val = (s: string) => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) && v > 0 ? v : undefined;
};

export function BuscadorRodamientos({ l = "es" }: { l?: Idioma }) {
  const t = TX[l], r = TXR[l];
  const [modo, setModo] = useState<Modo>("codigo");
  const [codigo, setCodigo] = useState("6205-2RS C3");
  const [md, setMd] = useState(""), [mD, setMD] = useState(""), [mB, setMB] = useState("");

  // ?c=6205 abre directo con ese código
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c) setCodigo(c.slice(0, 30));
  }, []);

  const lectura = useMemo(() => leerCodigo(codigo), [codigo]);
  const medidas = { d: val(md), D: val(mD), B: val(mB) };
  const encontrados = useMemo(() => buscarPorMedidas(medidas), [md, mD, mB]); // eslint-disable-line react-hooks/exhaustive-deps
  const N = (v: number) => num(v, v % 1 ? 1 : 0, l);
  const rod = lectura.rod;

  return (
    <div className="calc">
      <section className="panel seleccion" aria-label={t.buscar}>
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="diametro" size={22} /></span>
          <div><h2>{t.buscar}</h2><p>{t.buscarSub}</p></div>
        </header>

        <div className="seg" role="tablist">
          {(["codigo", "medidas"] as Modo[]).map((m) => (
            <button key={m} role="tab" aria-selected={modo === m} className={modo === m ? "on" : ""} onClick={() => setModo(m)}>
              {m === "codigo" ? t.porCodigo : t.porMedidas}
            </button>
          ))}
        </div>

        {modo === "codigo" ? (
          <div className="campo">
            <label className="etq" htmlFor="cod-rod">{t.codigo}</label>
            <input id="cod-rod" className="input-grande" type="text" autoComplete="off" spellCheck={false} placeholder={t.ejCodigo}
              value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <p className="nota">{t.ejemplos}{" "}
              {["6204-2RS", "608ZZ", "6305 C3", "6003 DDU", "6206-2Z/C3"].map((e) => (
                <button key={e} className="chip-txt" onClick={() => setCodigo(e)}>{e}</button>
              ))}
            </p>
          </div>
        ) : (
          <div className="campo">
            <span className="etq">{t.medidas}</span>
            <div className="fila3">
              <label className="mini">{r.d}<input type="text" inputMode="decimal" placeholder="25" value={md} onChange={(e) => setMd(e.target.value)} /></label>
              <label className="mini">{r.D}<input type="text" inputMode="decimal" placeholder="52" value={mD} onChange={(e) => setMD(e.target.value)} /></label>
              <label className="mini">{r.B}<input type="text" inputMode="decimal" placeholder="15" value={mB} onChange={(e) => setMB(e.target.value)} /></label>
            </div>
            <p className="nota">{t.notaMedidas}</p>
          </div>
        )}
        <div className="vista vista-trans"><DibujoRodamiento d={rod && modo === "codigo" ? rod.d : 25} D={rod && modo === "codigo" ? rod.D : 52} B={rod && modo === "codigo" ? rod.B : 15} /></div>
      </section>

      <section className="panel resultados" aria-live="polite">
        {modo === "codigo" ? (
          !codigo.trim() ? (
            <p className="vacio">{t.sinCodigo}</p>
          ) : !rod ? (
            <div className="vacio"><Icono n="info" size={28} /><p>{t.noEsta(lectura.base || codigo)}</p></div>
          ) : (
            <>
              <div className="resumen">
                <span className="resumen-ico"><Icono n="diametro" size={34} /></span>
                <div className="resumen-txt">
                  <h2>{codigo.toUpperCase().trim()}</h2>
                  <p>{r.tipo} · {r.serie(rod.serie, esMiniatura(rod))}</p>
                </div>
              </div>
              <div className="tarjetas">
                <article className="tarjeta">
                  <header><h3><Icono n="regla" size={20} className="tarjeta-ico" />{t.medidasTit}</h3><span className="u">mm</span></header>
                  <dl>
                    <Dato n={r.d} v={N(rod.d)} extra={`${pulgadas(rod.d)}"`} />
                    <Dato n={r.D} v={N(rod.D)} extra={`${pulgadas(rod.D)}"`} />
                    <Dato n={r.B} v={N(rod.B)} extra={`${pulgadas(rod.B)}"`} />
                  </dl>
                  <p className="nota"><Link href={`${t.base}${rod.codigo}/`} data-umami-event="rodamiento-ficha" data-umami-event-codigo={rod.codigo}>{t.ficha(rod.codigo)}</Link></p>
                </article>
                <article className="tarjeta">
                  <header><h3><Icono n="info" size={20} className="tarjeta-ico" />{t.significa}</h3></header>
                  <ul className="lista-sufijos">
                    {explicarSufijos(lectura.sufijos, l).map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </article>
                <article className="tarjeta tarjeta-ancha">
                  <header><h3><Icono n="copiar" size={20} className="tarjeta-ico" />{t.equivalencias}</h3></header>
                  <TablaEquivalencias codigo={rod.codigo} l={l} />
                </article>
              </div>
            </>
          )
        ) : medidas.d === undefined && medidas.D === undefined && medidas.B === undefined ? (
          <p className="vacio">{t.sinMedidas}</p>
        ) : encontrados.length === 0 ? (
          <div className="vacio"><Icono n="info" size={28} /><p>{t.sinCalce}</p></div>
        ) : (
          <>
            <h2 className="res-tit">{t.resultados(encontrados.length)}</h2>
            <ul className="lista-rod">
              {encontrados.slice(0, 12).map((o) => (
                <li key={o.codigo}>
                  <Link href={`${t.base}${o.codigo}/`} data-umami-event="rodamiento-medidas" data-umami-event-codigo={o.codigo}>
                    <b>{o.codigo}</b>
                    <span>{N(o.d)} × {N(o.D)} × {N(o.B)} mm</span>
                    <small>{r.serie(o.serie, esMiniatura(o))}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

export function TablaEquivalencias({ codigo, l }: { codigo: string; l: Idioma }) {
  const r = TXR[l];
  return (
    <>
      <div className="tabla-wrap">
        <table className="tabla tabla-equiv">
          <thead><tr><th>{r.marca}</th><th>{r.conTapas}</th><th>{r.conSellos}</th></tr></thead>
          <tbody>
            {filasEquivalencias().map((f) => (
              <tr key={f.marca}><td>{f.marca}</td><td>{codigo}-{f.tapas}</td><td>{codigo}-{f.sellos.replace(" (antes 2RS1)", "").replace(" (formerly 2RS1)", "")}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="nota">{r.equivNota}</p>
    </>
  );
}

function Dato({ n, v, extra }: { n: string; v: string; extra: string }) {
  return <div className="dato dest"><dt>{n}<span className="sim">{extra}</span></dt><dd>{v}</dd></div>;
}

/** Corte esquemático de un rodamiento rígido de bolas (proporciones reales d, D, B). */
export function DibujoRodamiento({ d, D, B }: { d: number; D: number; B: number }) {
  const s = 120 / D;
  const R = (D / 2) * s, r = (d / 2) * s, w = B * s;
  const aro = (R - r) * 0.28; // espesor de cada aro
  const bola = Math.min((R - r - 2 * aro) * 0.95, w * 0.85);
  const cx = 70, cy = 75, x0 = cx - w / 2, x1 = cx + w / 2;
  const media = (sg: 1 | -1) => {
    const yExt = cy - sg * R, yInt = cy - sg * r;
    return (
      <g key={sg}>
        <rect x={x0} y={sg > 0 ? yExt : yExt - aro} width={w} height={aro} className="d-cuerpo" />
        <rect x={x0} y={sg > 0 ? yInt - aro : yInt} width={w} height={aro} className="d-cuerpo" />
        <circle cx={cx} cy={cy - sg * ((R + r) / 2)} r={bola / 2} className="d-bola" />
      </g>
    );
  };
  const n = (v: number) => String(v);
  return (
    <svg viewBox="0 0 230 150" className="dibujo-svg" role="img" aria-label={`${d} × ${D} × ${B} mm`}>
      {media(1)}
      {media(-1)}
      <path d={`M${x0 - 8} ${cy}H${x1 + 8}`} className="d-eje-trans" />
      <g className="cota">
        <path d={`M${x1 + 14} ${cy - r}V${cy + r}`} />
        <path d={`M${x1 + 34} ${cy - R}V${cy + R}`} />
        <path d={`M${x0} ${cy - R - 7}H${x1}`} />
      </g>
      <text x={x1 + 18} y={cy + 4} fontSize="11" className="d-txt">d {n(d)}</text>
      <text x={x1 + 38} y={cy - R / 2} fontSize="11" className="d-txt">D {n(D)}</text>
      <text x={cx} y={cy - R - 11} fontSize="11" textAnchor="middle" className="d-txt">B {n(B)}</text>
    </svg>
  );
}
