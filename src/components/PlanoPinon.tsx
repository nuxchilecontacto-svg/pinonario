"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Cadena } from "@/lib/cadenas";
import type { Hileras, Resultado } from "@/lib/calculo";
import { AJUSTES_CHAVETERO, chavetaPara, PRISIONEROS, prisioneroPara, type AjusteChavetero } from "@/lib/chavetas";
import { descargar, dxfPlano } from "@/lib/dxf";
import type { Unidad } from "@/lib/formato";
import { codigo, LOCALE, type Idioma } from "@/lib/idioma";
import { cotaTxt, generarPlano, svgPlano } from "@/lib/plano";
import { Icono } from "./Iconos";

type Cubo = "uno" | "ambos" | "no";

const TX = {
  es: {
    titulo: "Plano de fabricación", sub: "Todas las cotas salen del mismo cálculo que el DXF de corte. Revise y ajuste los datos del cuerpo.",
    cerrar: "Cerrar", cubo: "Cubo", uno: "A un lado", ambos: "Ambos lados", no: "Sin cubo",
    dCubo: "Ø cubo (mm)", largo: "Largo total (mm)", agujero: "Agujero Ø (mm)", tol: "Tolerancia", ranura: "Ø fondo ranuras entre hileras (mm)",
    chavetero: "Chavetero DIN 6885", ajuste: "Ajuste", prisionero: "Prisionero", sobreChav: "sobre el chavetero",
    cantidad: "Cantidad", material: "Material", tratamiento: "Tratamiento térmico", referencia: "Referencia / cliente (opcional)",
    pdf: "Imprimir o guardar PDF", dxf: "Descargar DXF del plano", archivo: "plano-pinon",
    sinChav: "El agujero está fuera del rango de DIN 6885 (6 a 500 mm).",
    av: {
      cubo: (m: string) => `El cubo supera el máximo (${m} mm): la cadena rozará con el cubo.`,
      largo: (w: string) => `El largo total debe ser mayor que el ancho del dentado (${w} mm), o elija "Sin cubo".`,
      ranura: (m: string) => `El fondo de las ranuras supera el máximo (${m} mm): las placas de la cadena rozarán.`,
      agujero: "El agujero es igual o mayor que el cubo.",
      pared: (e: string) => `Pared delgada: quedan ${e} mm entre el chavetero y el diámetro exterior del cubo.`,
    },
    bloqueado: "No se pudo abrir la ventana de impresión. Permita las ventanas emergentes para este sitio.",
    materiales: ["Acero SAE 1045", "Acero SAE 4140", "Acero SAE 1020", "Acero SAE 8620", "Acero inoxidable AISI 304", "Acero inoxidable AISI 316", "Fundición gris", "Nylon / poliamida"],
    tratamientos: ["Sin tratamiento", "Dientes templados por inducción", "Bonificado", "Cementado y templado", "Templado y revenido"],
  },
  en: {
    titulo: "Manufacturing drawing", sub: "Every dimension comes from the same calculation as the cutting DXF. Check and adjust the body data.",
    cerrar: "Close", cubo: "Hub", uno: "One side", ambos: "Both sides", no: "No hub",
    dCubo: "Hub Ø (mm)", largo: "Overall length (mm)", agujero: "Bore Ø (mm)", tol: "Tolerance", ranura: "Groove bottom Ø between strands (mm)",
    chavetero: "DIN 6885 keyway", ajuste: "Fit", prisionero: "Set screw", sobreChav: "over the keyway",
    cantidad: "Quantity", material: "Material", tratamiento: "Heat treatment", referencia: "Reference / customer (optional)",
    pdf: "Print or save PDF", dxf: "Download drawing DXF", archivo: "sprocket-drawing",
    sinChav: "The bore is outside the DIN 6885 range (6 to 500 mm).",
    av: {
      cubo: (m: string) => `The hub exceeds the maximum (${m} mm): the chain will rub on it.`,
      largo: (w: string) => `Overall length must be greater than the tooth width (${w} mm), or choose "No hub".`,
      ranura: (m: string) => `The groove bottom exceeds the maximum (${m} mm): the chain plates will rub.`,
      agujero: "The bore is equal to or larger than the hub.",
      pared: (e: string) => `Thin wall: only ${e} mm between the keyway and the hub outside diameter.`,
    },
    bloqueado: "Could not open the print window. Please allow pop-ups for this site.",
    materiales: ["1045 steel", "4140 steel", "1020 steel", "8620 steel", "304 stainless steel", "316 stainless steel", "Gray cast iron", "Nylon"],
    tratamientos: ["None", "Induction-hardened teeth", "Through hardened (quenched and tempered)", "Carburized and hardened"],
  },
};

export function PlanoPinon({
  l, u, cadena, z, hileras, r, cuboInicial, onCerrar,
}: {
  l: Idioma;
  u: Unidad;
  cadena: Cadena;
  z: number;
  hileras: Hileras;
  r: Resultado;
  cuboInicial: { con: boolean; dCubo: number; largo: number; agujero: number };
  onCerrar: () => void;
}) {
  const t = TX[l];
  const ref = useRef<HTMLDialogElement>(null);
  const [cubo, setCubo] = useState<Cubo>(cuboInicial.con ? "uno" : "no");
  const [dCubo, setDCubo] = useState(cuboInicial.dCubo);
  const [largo, setLargo] = useState(cuboInicial.largo);
  const [agujero, setAgujero] = useState(cuboInicial.agujero);
  const [tol, setTol] = useState("H7");
  const [dRanura, setDRanura] = useState(Math.floor(r.dCuboMax));
  const [conChav, setConChav] = useState(false);
  const [ajuste, setAjuste] = useState<AjusteChavetero>("JS9");
  const [conPris, setConPris] = useState(false);
  const [mPris, setMPris] = useState<number | "">("");
  const [cantidad, setCantidad] = useState(1);
  const [material, setMaterial] = useState(t.materiales[0]);
  const [tratamiento, setTratamiento] = useState(t.tratamientos[0]);
  const [referencia, setReferencia] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const chav = chavetaPara(agujero);
  const chaveta = conChav && chav ? { ...chav, ajuste } : null;
  const hayCubo = cubo !== "no";
  const m = mPris === "" ? prisioneroPara(agujero) : mPris;
  const cod = codigo(cadena, l);
  const W = (hileras - 1) * cadena.pt + r.bf1;
  const N = (mm: number) => cotaTxt(mm, "mm", l);

  const plano = useMemo(
    () =>
      generarPlano({
        l, u, codigo: cod, normaTxt: cadena.norma === "ISO" ? "ISO 606" : "ANSI B29.1", medida: cadena.medida,
        p: cadena.p, d1: cadena.d1, pt: cadena.pt, z, hileras,
        dp: r.dp, de: r.deRec, deMin: r.deMin, deMax: r.deMax, df: r.df, dCalibre: r.dCalibre, bf1: r.bf1, ba: r.ba, rx: r.rx,
        cubo, dCubo, largoTotal: largo, agujero, tolAgujero: tol.trim(), dRanura, chaveta,
        prisionero: hayCubo && conPris ? m : null,
        cantidad, material, tratamiento, referencia: referencia.trim(),
        fecha: new Date().toLocaleDateString(LOCALE[l]),
      }),
    [l, u, cod, cadena, z, hileras, r, cubo, dCubo, largo, agujero, tol, dRanura, chaveta?.b, ajuste, hayCubo, conPris, m, cantidad, material, tratamiento, referencia], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const svg = useMemo(() => svgPlano(plano), [plano]);

  const avisos: string[] = [];
  if (hayCubo && dCubo > r.dCuboMax) avisos.push(t.av.cubo(N(r.dCuboMax)));
  if (hayCubo && largo <= W) avisos.push(t.av.largo(N(W)));
  if (hileras > 1 && dRanura > r.dCuboMax) avisos.push(t.av.ranura(N(r.dCuboMax)));
  if (hayCubo && agujero >= dCubo) avisos.push(t.av.agujero);
  const exterior = hayCubo ? dCubo : hileras > 1 ? dRanura : r.df;
  const pared = exterior / 2 - (agujero / 2 + (chaveta?.t2 ?? 0));
  if (agujero < exterior && pared < Math.max(3, 0.15 * agujero)) avisos.push(t.av.pared(N(pared)));

  const nombre = `${t.archivo}-${cod.replace(/\s+/g, "")}-${l === "en" ? "N" : "Z"}${z}${hileras > 1 ? `-x${hileras}` : ""}`;
  const imprimir = () => {
    const w = window.open("", "_blank");
    if (!w) return alert(t.bloqueado);
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${nombre}</title><style>@page{size:A4 landscape;margin:0}html,body{margin:0;background:#fff}svg{display:block;width:297mm;height:210mm}</style></head><body>${svg}<script>window.onload=function(){window.print()}<\/script></body></html>`,
    );
    w.document.close();
  };

  const num = (v: string) => Math.max(Number(v) || 0, 0);

  return (
    <dialog ref={ref} className="plano-dlg" onClose={onCerrar} aria-labelledby="plano-tit">
      <header className="plano-cab">
        <div>
          <h2 id="plano-tit">{t.titulo}</h2>
          <p>{t.sub}</p>
        </div>
        <button className="plano-x" onClick={() => ref.current?.close()} aria-label={t.cerrar}>×</button>
      </header>

      <div className="plano-cuerpo">
        <form className="plano-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>{t.cubo}</legend>
            <div className="seg chico">
              {(["uno", "ambos", "no"] as Cubo[]).map((c) => (
                <button type="button" key={c} className={cubo === c ? "on" : ""} onClick={() => setCubo(c)}>{t[c]}</button>
              ))}
            </div>
            {hayCubo && (
              <div className="plano-par">
                <label>{t.dCubo}<input type="number" min={0} value={dCubo} onChange={(e) => setDCubo(num(e.target.value))} /></label>
                <label>{t.largo}<input type="number" min={0} value={largo} onChange={(e) => setLargo(num(e.target.value))} /></label>
              </div>
            )}
            <div className="plano-par">
              <label>{t.agujero}<input type="number" min={0} value={agujero} onChange={(e) => setAgujero(num(e.target.value))} /></label>
              <label>{t.tol}<input type="text" value={tol} maxLength={8} onChange={(e) => setTol(e.target.value)} /></label>
            </div>
            {hileras > 1 && (
              <label>{t.ranura}<input type="number" min={0} value={dRanura} onChange={(e) => setDRanura(num(e.target.value))} /></label>
            )}
          </fieldset>

          <fieldset>
            <label className="check-mini">
              <input type="checkbox" checked={conChav && !!chav} disabled={!chav} onChange={(e) => setConChav(e.target.checked)} />
              {t.chavetero}{chav ? ` · ${chav.b} × ${chav.h}, t2 = ${N(chav.t2)}` : ""}
            </label>
            {!chav && <p className="nota">{t.sinChav}</p>}
            {conChav && chav && (
              <div className="seg chico">
                {AJUSTES_CHAVETERO.map((a) => (
                  <button type="button" key={a} className={ajuste === a ? "on" : ""} onClick={() => setAjuste(a)}>{a}</button>
                ))}
              </div>
            )}
            {hayCubo && (
              <label className="check-mini">
                <input type="checkbox" checked={conPris} onChange={(e) => setConPris(e.target.checked)} />
                {t.prisionero}{conChav && chav ? ` ${t.sobreChav}` : ""}
              </label>
            )}
            {hayCubo && conPris && (
              <div className="select">
                <select value={m} onChange={(e) => setMPris(Number(e.target.value))} aria-label={t.prisionero}>
                  {PRISIONEROS.map((p) => <option key={p} value={p}>M{p}</option>)}
                </select>
                <Icono n="chevron" size={18} />
              </div>
            )}
          </fieldset>

          <fieldset>
            <div className="plano-par">
              <label>{t.cantidad}<input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Math.max(Math.round(Number(e.target.value)) || 1, 1))} /></label>
            </div>
            <label>{t.material}<input type="text" list="pl-materiales" value={material} onChange={(e) => setMaterial(e.target.value)} /></label>
            <label>{t.tratamiento}<input type="text" list="pl-tratamientos" value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} /></label>
            <label>{t.referencia}<input type="text" value={referencia} maxLength={60} onChange={(e) => setReferencia(e.target.value)} /></label>
            <datalist id="pl-materiales">{t.materiales.map((x) => <option key={x} value={x} />)}</datalist>
            <datalist id="pl-tratamientos">{t.tratamientos.map((x) => <option key={x} value={x} />)}</datalist>
          </fieldset>

          {avisos.length > 0 && (
            <ul className="plano-avisos">
              {avisos.map((a) => <li key={a}>{a}</li>)}
            </ul>
          )}
        </form>

        <div className="plano-der">
          <div className="plano-vista" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="plano-btns">
            <button className="btn-prim" onClick={imprimir}><Icono n="impresora" size={18} /> {t.pdf}</button>
            <button className="btn-dxf" onClick={() => descargar(`${nombre}.dxf`, dxfPlano(plano))}><Icono n="descarga" size={18} /> {t.dxf}</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
