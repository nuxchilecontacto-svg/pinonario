"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CADENAS, cadenaPorId, type Norma } from "@/lib/cadenas";
import { calcularMaterial, calcularPinon, Z_MAX, Z_MIN, type Hileras } from "@/lib/calculo";
import { descargar, dxfPinon } from "@/lib/dxf";
import { grados, kg, largo, unidad, type Unidad } from "@/lib/formato";
import { codigo, type Idioma } from "@/lib/idioma";
import { DibujoMedicion, DibujoPinon } from "./DibujoPinon";
import { Icono } from "./Iconos";

type Grupo = "diametros" | "control" | "dentado" | "perfil" | "cubo" | "material";

const GRUPOS: { id: Grupo; icono: string }[] = [
  { id: "diametros", icono: "diametro" },
  { id: "control", icono: "calibre" },
  { id: "dentado", icono: "ancho" },
  { id: "perfil", icono: "diente" },
  { id: "cubo", icono: "cubo" },
  { id: "material", icono: "peso" },
];

const TX = {
  es: {
    grupos: { diametros: "Diámetros", control: "Control y medición", dentado: "Ancho del dentado", perfil: "Perfil del diente", cubo: "Cubo", material: "Material y peso" } as Record<Grupo, string>,
    parametros: "Parámetros de la cadena", parametrosSub: "Elige la cadena y el número de dientes para calcular el piñón.",
    norma: "Norma de la cadena", normaAyuda: "ISO/DIN serie B es la cadena europea. ASA/ANSI serie A es la americana. Para el mismo paso cambian el rodillo y el ancho.",
    iso: "ISO / DIN (europea, B)", asa: "ASA / ANSI (americana, A)",
    paso: "Paso de la cadena", pasoAyuda: "Paso × ancho interior, como se pide en el taller. Entre paréntesis, el paso en mm.",
    z: "Z", dientes: "Número de dientes (Z)", restar: "Restar un diente", sumar: "Sumar un diente",
    hileras: "Hileras", simple: "Simple", doble: "Doble", triple: "Triple", unidades: "Unidades", pulgadas: "pulgadas",
    vista: "Vista previa del piñón", cadena: "Cadena", pasoCorto: "Paso", rodillo: "Rodillo Ø", anchoInt: "Ancho int.", pasoTransv: "Paso transv.",
    dxf: "Descargar DXF para corte", dxfArchivo: "pinon", dxfRefs: "Incluir círculos de referencia (Dp y Df, capa aparte)",
    dxfNota: (a: number) => `Perfil ISO 606 con arcos exactos, en mm, listo para plasma, láser, agua o CAD. Incluye el agujero de ${a} mm.`,
    medidas: "Medidas calculadas", elegir: "Elegir qué datos mostrar",
    pinon: "Piñón", dobleMin: "doble", tripleMin: "triple",
    dp: "Diámetro primitivo", de: "Diámetro exterior (torneado)", deRango: "De mínimo / máximo norma", df: "Diámetro de fondo", pasoAng: "Paso angular",
    mcPar: "Medida con pie de metro (Z par = Df)", mcImpar: "Medida con pie de metro (Z impar)", mr: (d: string) => `Medida sobre rodillos Ø ${d}`,
    notaPar: "Z par: se mide de fondo a fondo de dientes opuestos.", notaImpar: "Z impar: no hay dientes opuestos; se mide de un fondo al fondo más cercano al otro lado.",
    bf1: "Ancho de diente (por hilera)", bfn: (h: number) => `Ancho total ${h} hileras`, pt: "Paso transversal", ba: "Chaflán lateral del diente", rx: "Radio lateral del diente",
    perfilTit: "Perfil del diente (ISO 606)", ri: "Radio de asiento del rodillo", re: "Radio de flanco", alfa: "Ángulo de asiento",
    cuboMax: "Diámetro máximo de cubo", conCubo: "Piñón con cubo (si no, es corona/disco)", cuboD: "Ø cubo (mm)", cuboH: "Largo total H (mm)", agujero: "Agujero d (mm)",
    cuboExcede: "El cubo supera el máximo: la cadena rozará con el cubo.",
    materialTit: "Material de partida (acero)", sobremedida: "Sobremedida de mecanizado (mm)", corteD: "Ø de corte (barra o disco)", corteL: "Largo / espesor de corte",
    pesoBruto: "Peso bruto del material", pesoNeto: "Peso aprox. pieza terminada", notaPeso: "Densidad 7,85 kg/dm³. El peso terminado es aproximado (útil para cotizar flete o tratamiento).",
    aviso: "Medidas calculadas según las fórmulas de ISO 606 y ANSI B29.1. Verifique contra la cadena real antes de fabricar; los fabricantes pueden usar tolerancias propias.",
    sugerido: "sugerido", imprimir: "Imprimir ficha", mas: "Más opciones", copiarEnlace: "Copiar enlace", copiarMedidas: "Copiar medidas (texto)",
    enlaceCopiado: "Enlace copiado", medidasCopiadas: "Medidas copiadas", noCopia: "No se pudo copiar",
    txtNorma: "norma", txtMc: "Medida pie de metro", txtMr: "Medida sobre rodillos", txtBf: "Ancho diente", txtTotal: "total", txtCubo: "Cubo máx",
  },
  en: {
    grupos: { diametros: "Diameters", control: "Inspection", dentado: "Tooth width", perfil: "Tooth form", cubo: "Hub", material: "Material & weight" } as Record<Grupo, string>,
    parametros: "Chain parameters", parametrosSub: "Pick the chain and the number of teeth to calculate the sprocket.",
    norma: "Chain standard", normaAyuda: "ANSI (A series) is the American chain. ISO/DIN B series is the European chain. Same pitch, different roller and width.",
    iso: "ISO / DIN (European, B)", asa: "ANSI (American, A)",
    paso: "Chain pitch", pasoAyuda: "Pitch × inner width. In brackets, the pitch in mm.",
    z: "N", dientes: "Number of teeth (N)", restar: "One tooth less", sumar: "One tooth more",
    hileras: "Strands", simple: "Simplex", doble: "Duplex", triple: "Triplex", unidades: "Units", pulgadas: "inches",
    vista: "Sprocket preview", cadena: "Chain", pasoCorto: "Pitch", rodillo: "Roller Ø", anchoInt: "Inner width", pasoTransv: "Transv. pitch",
    dxf: "Download DXF for cutting", dxfArchivo: "sprocket", dxfRefs: "Include reference circles (pitch and bottom, separate layer)",
    dxfNota: (a: number) => `ISO 606 tooth form with true arcs, in mm, ready for plasma, laser, waterjet or CAD. Includes a ${a} mm bore.`,
    medidas: "Calculated dimensions", elegir: "Choose which data to show",
    pinon: "Sprocket", dobleMin: "duplex", tripleMin: "triplex",
    dp: "Pitch diameter", de: "Outside diameter (turned)", deRango: "Standard OD min / max", df: "Bottom diameter", pasoAng: "Tooth angle",
    mcPar: "Caliper diameter (even N = bottom dia.)", mcImpar: "Caliper diameter (odd N)", mr: (d: string) => `Measurement over pins Ø ${d}`,
    notaPar: "Even N: measure root to root across opposite teeth.", notaImpar: "Odd N: there are no opposite teeth; measure from one root to the nearest root on the other side.",
    bf1: "Tooth width (per strand)", bfn: (h: number) => `Total width, ${h} strands`, pt: "Transverse pitch", ba: "Tooth side chamfer", rx: "Tooth side radius",
    perfilTit: "Tooth form (ISO 606)", ri: "Roller seating radius", re: "Tooth flank radius", alfa: "Roller seating angle",
    cuboMax: "Max hub diameter", conCubo: "Sprocket with hub (otherwise a plate wheel)", cuboD: "Hub Ø (mm)", cuboH: "Overall length H (mm)", agujero: "Bore d (mm)",
    cuboExcede: "The hub exceeds the maximum: the chain will rub on it.",
    materialTit: "Stock material (steel)", sobremedida: "Machining allowance (mm)", corteD: "Cut Ø (bar or plate)", corteL: "Cut length / thickness",
    pesoBruto: "Stock weight", pesoNeto: "Approx. finished weight", notaPeso: "Density 7.85 kg/dm³. Finished weight is approximate (useful for freight or heat-treat quotes).",
    aviso: "Dimensions calculated with the ISO 606 and ANSI B29.1 formulas. Check against the actual chain before manufacturing; manufacturers may use their own tolerances.",
    sugerido: "suggested", imprimir: "Print sheet", mas: "More options", copiarEnlace: "Copy link", copiarMedidas: "Copy dimensions (text)",
    enlaceCopiado: "Link copied", medidasCopiadas: "Dimensions copied", noCopia: "Could not copy",
    txtNorma: "standard", txtMc: "Caliper diameter", txtMr: "Over pins", txtBf: "Tooth width", txtTotal: "total", txtCubo: "Max hub",
  },
};
type Textos = (typeof TX)["es"];

export function Calculadora({
  cadenaInicial = "08b", zInicial = 20, l = "es", unidadInicial = "mm",
}: { cadenaInicial?: string; zInicial?: number; l?: Idioma; unidadInicial?: Unidad }) {
  const t = TX[l];
  const [norma, setNorma] = useState<Norma>(cadenaPorId(cadenaInicial)?.norma ?? "ISO");
  const [cadenaId, setCadenaId] = useState(cadenaInicial);
  const [z, setZ] = useState(zInicial);
  const [hileras, setHileras] = useState<Hileras>(1);
  const [u, setU] = useState<Unidad>(unidadInicial);
  const [visibles, setVisibles] = useState<Set<Grupo>>(new Set(GRUPOS.map((g) => g.id)));

  // Cubo y material (en mm)
  const [conCubo, setConCubo] = useState(true);
  const [dCubo, setDCubo] = useState<number | "">("");
  const [largoTotal, setLargoTotal] = useState<number | "">("");
  const [agujero, setAgujero] = useState<number | "">("");
  const [sobremedida, setSobremedida] = useState(3);

  // Leer parámetros compartidos (?c=08b&z=20&h=1&u=in)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = cadenaPorId(q.get("c") ?? "");
    if (c) {
      setCadenaId(c.id);
      setNorma(c.norma);
    }
    const zq = Number(q.get("z"));
    if (zq >= Z_MIN && zq <= Z_MAX) setZ(zq);
    const h = Number(q.get("h"));
    if (h === 1 || h === 2 || h === 3) setHileras(h);
    const uq = q.get("u");
    if (uq === "in" || uq === "mm") setU(uq);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams({ c: cadenaId, z: String(z), h: String(hileras), u });
    window.history.replaceState(null, "", `?${q}`);
  }, [cadenaId, z, hileras, u]);

  const cadenas = CADENAS.filter((c) => c.norma === norma);
  const cadena = cadenaPorId(cadenaId) ?? cadenas[0];
  const zValido = Math.min(Math.max(Math.round(z) || Z_MIN, Z_MIN), Z_MAX);
  const r = useMemo(() => calcularPinon(cadena, zValido, hileras), [cadena, zValido, hileras]);

  // Sugerencias de cubo según práctica de catálogo: Ø ≈ 95 % del máximo, largo ≈ ancho dentado + 1,6·p
  const dCuboSug = Math.max(Math.floor(r.dCuboMax * 0.95), 0);
  const largoSug = Math.round((r.bfTotal + 1.6 * cadena.p) / 5) * 5;
  const agujeroSug = Math.max(Math.round((dCuboSug * 0.25) / 5) * 5, 8);
  const dCuboEf = dCubo === "" ? dCuboSug : dCubo;
  const largoEf = largoTotal === "" ? largoSug : largoTotal;
  const agujeroEf = agujero === "" ? agujeroSug : agujero;
  const cuboExcede = conCubo && dCuboEf > r.dCuboMax;

  const mat = calcularMaterial({
    de: r.deRec,
    df: r.df,
    anchoDentado: r.bfTotal,
    conCubo,
    dCubo: dCuboEf,
    largoTotal: largoEf,
    agujero: agujeroEf,
    sobremedida,
  });

  const cambiarNorma = (n: Norma) => {
    setNorma(n);
    // Mantener el mismo paso si existe en la otra norma
    const mismoPaso = CADENAS.find((c) => c.norma === n && c.p === cadena.p);
    setCadenaId((mismoPaso ?? CADENAS.find((c) => c.norma === n)!).id);
  };

  const toggle = (g: Grupo) =>
    setVisibles((s) => {
      const n = new Set(s);
      n.has(g) ? n.delete(g) : n.add(g);
      return n;
    });

  const cod = codigo(cadena, l);
  const [dxfRefs, setDxfRefs] = useState(false);
  const bajarDxf = () => {
    const contenido = dxfPinon({ z: zValido, dp: r.dp, de: r.deRec, df: r.df, d1: cadena.d1, agujero: agujeroEf, referencias: dxfRefs });
    descargar(`${t.dxfArchivo}-${cod.replace(/\s+/g, "")}-${t.z}${zValido}.dxf`, contenido);
  };

  const L = (mm: number) => largo(mm, u, l);
  const U = unidad(u);
  const titulo = `${t.pinon} ${cadena.medida} · ${t.z}${zValido}${hileras > 1 ? ` · ${hileras === 2 ? t.dobleMin : t.tripleMin}` : ""}`;
  const normaTxt = `${cadena.norma === "ISO" ? "ISO 606 / DIN 8187" : "ANSI B29.1"} · ${cod}${cadena.equivalente ? ` (${cadena.equivalente})` : ""}`;

  const textoMedidas = () =>
    [
      titulo,
      normaTxt,
      `Dp: ${L(r.dp)} ${U}`,
      `De: ${L(r.deRec)} ${U} (${t.txtNorma} ${L(r.deMin)}–${L(r.deMax)})`,
      `Df: ${L(r.df)} ${U}`,
      `${t.txtMc}: ${L(r.dCalibre)} ${U}`,
      `${t.txtMr}: ${L(r.mRodillos)} ${U}`,
      `${t.txtBf}: ${L(r.bf1)} ${U}${hileras > 1 ? ` · ${t.txtTotal} ${L(r.bfTotal)} ${U}` : ""}`,
      `${t.txtCubo}: ${L(r.dCuboMax)} ${U}`,
      window.location.href,
    ].join("\n");

  return (
    <div className="calc">
      {/* ── Parámetros ── */}
      <section className="panel seleccion" aria-label={t.parametros}>
        <header className="panel-cab">
          <span className="panel-ico"><Icono n="ajustes" size={22} /></span>
          <div>
            <h2>{t.parametros}</h2>
            <p>{t.parametrosSub}</p>
          </div>
        </header>

        <div className="campo">
          <span className="etq"><b>1</b> {t.norma}
            <Ayuda texto={t.normaAyuda} />
          </span>
          <div className="seg" role="radiogroup" aria-label={t.norma}>
            {((l === "en" ? ["ASA", "ISO"] : ["ISO", "ASA"]) as Norma[]).map((n) => (
              <button key={n} role="radio" aria-checked={norma === n} className={norma === n ? "on" : ""} onClick={() => cambiarNorma(n)}>
                {n === "ISO" ? t.iso : t.asa}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="cadena"><b>2</b> {t.paso}
            <Ayuda texto={t.pasoAyuda} />
          </label>
          <div className="select">
            <select id="cadena" value={cadena.id} onChange={(e) => setCadenaId(e.target.value)}>
              {cadenas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.medida} — {codigo(c, l)}{c.equivalente ? ` / ${c.equivalente}` : ""} (p = {c.p} mm)
                </option>
              ))}
            </select>
            <Icono n="chevron" size={18} />
          </div>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="z"><b>3</b> {t.dientes}</label>
          <div className="zfila">
            <button className="paso" onClick={() => setZ(Math.max(zValido - 1, Z_MIN))} aria-label={t.restar}>−</button>
            <input id="z" type="number" inputMode="numeric" min={Z_MIN} max={Z_MAX} value={z}
              onChange={(e) => setZ(Number(e.target.value))} onBlur={() => setZ(zValido)} />
            <button className="paso" onClick={() => setZ(Math.min(zValido + 1, Z_MAX))} aria-label={t.sumar}>+</button>
          </div>
        </div>

        <div className="fila2">
          <div className="campo">
            <span className="etq etq-ico"><Icono n="capas" size={17} /> {t.hileras}</span>
            <div className="seg chico">
              {([1, 2, 3] as Hileras[]).map((h) => (
                <button key={h} className={hileras === h ? "on" : ""} onClick={() => setHileras(h)}>
                  {h === 1 ? t.simple : h === 2 ? t.doble : t.triple}
                </button>
              ))}
            </div>
          </div>
          <div className="campo">
            <span className="etq etq-ico"><Icono n="regla" size={17} /> {t.unidades}</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => setU("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => setU("in")}>{t.pulgadas}</button>
            </div>
          </div>
        </div>

        <div className="vista">
          <div className="vista-datos">
            <span className="vista-tit">{t.vista}</span>
            <dl>
              <div><dt>{t.cadena}</dt><dd>{cod}</dd></div>
              <div><dt>{t.pasoCorto}</dt><dd>{L(cadena.p)} {U}</dd></div>
              <div><dt>{t.rodillo}</dt><dd>{L(cadena.d1)} {U}</dd></div>
              <div><dt>{t.anchoInt}</dt><dd>{L(cadena.b1)} {U}</dd></div>
              {hileras > 1 && <div><dt>{t.pasoTransv}</dt><dd>{L(cadena.pt)} {U}</dd></div>}
            </dl>
          </div>
          <DibujoPinon z={zValido} p={cadena.p} d1={cadena.d1} dp={r.dp} de={r.deRec} df={r.df}
            dCubo={conCubo ? dCuboEf : undefined} agujero={agujeroEf} />
        </div>

        <div className="corte no-print">
          <button className="btn-dxf" onClick={bajarDxf}>
            <Icono n="descarga" size={18} /> {t.dxf}
          </button>
          <label className="check-mini">
            <input type="checkbox" checked={dxfRefs} onChange={(e) => setDxfRefs(e.target.checked)} />
            {t.dxfRefs}
          </label>
          <p className="nota">{t.dxfNota(agujeroEf)}</p>
        </div>
      </section>

      {/* ── Resultados ── */}
      <section className="panel resultados" aria-label={t.medidas}>
        <div className="resumen">
          <span className="resumen-ico"><Icono n="engranaje" size={34} /></span>
          <div className="resumen-txt">
            <h2>{titulo}</h2>
            <p>{normaTxt}</p>
          </div>
          <MenuFicha texto={textoMedidas} t={t} />
        </div>

        <div className="chips no-print" role="group" aria-label={t.elegir}>
          {GRUPOS.map((g) => (
            <label key={g.id} className={`chip ${visibles.has(g.id) ? "on" : ""}`}>
              <input type="checkbox" checked={visibles.has(g.id)} onChange={() => toggle(g.id)} />
              <Icono n={g.icono} size={17} />
              {t.grupos[g.id]}
            </label>
          ))}
        </div>

        <div className="tarjetas">
          {visibles.has("diametros") && (
            <Tarjeta titulo={t.grupos.diametros} icono="diametro" unidad={U}>
              <Dato nombre={t.dp} sim="Dp" valor={L(r.dp)} destacado />
              <Dato nombre={t.de} sim="De" valor={L(r.deRec)} destacado />
              <Dato nombre={t.deRango} sim="" valor={`${L(r.deMin)} – ${L(r.deMax)}`} />
              <Dato nombre={t.df} sim="Df" valor={L(r.df)} destacado />
              <Dato nombre={t.pasoAng} sim="" valor={grados(r.paso_angular, l)} />
            </Tarjeta>
          )}

          {visibles.has("control") && (
            <Tarjeta titulo={t.grupos.control} icono="calibre" unidad={U}>
              <Dato nombre={zValido % 2 === 0 ? t.mcPar : t.mcImpar} sim="Mc" valor={L(r.dCalibre)} destacado />
              <Dato nombre={t.mr(L(cadena.d1))} sim="MR" valor={L(r.mRodillos)} destacado />
              <p className="nota">{zValido % 2 === 0 ? t.notaPar : t.notaImpar}</p>
              <div className="medicion"><DibujoMedicion z={zValido} dp={r.dp} de={r.deRec} d1={cadena.d1} /></div>
            </Tarjeta>
          )}

          {visibles.has("dentado") && (
            <Tarjeta titulo={t.grupos.dentado} icono="ancho" unidad={U}>
              <Dato nombre={t.bf1} sim="bf1" valor={L(r.bf1)} destacado />
              {hileras > 1 && <Dato nombre={t.bfn(hileras)} sim="bfn" valor={L(r.bfTotal)} destacado />}
              {hileras > 1 && <Dato nombre={t.pt} sim="pt" valor={L(cadena.pt)} />}
              <Dato nombre={t.ba} sim="ba" valor={L(r.ba)} />
              <Dato nombre={t.rx} sim="rx" valor={L(r.rx)} />
            </Tarjeta>
          )}

          {visibles.has("perfil") && (
            <Tarjeta titulo={t.perfilTit} icono="diente" unidad={U}>
              <Dato nombre={t.ri} sim="ri" valor={`${L(r.riMin)} – ${L(r.riMax)}`} />
              <Dato nombre={t.re} sim="re" valor={`${L(r.reMin)} – ${L(r.reMax)}`} />
              <Dato nombre={t.alfa} sim="α" valor={`${grados(r.alfaMin, l)} – ${grados(r.alfaMax, l)}`} />
            </Tarjeta>
          )}

          {visibles.has("cubo") && (
            <Tarjeta titulo={t.grupos.cubo} icono="cubo" unidad={U}>
              <Dato nombre={t.cuboMax} sim="Dg máx" valor={L(r.dCuboMax)} destacado />
              <div className="entradas">
                <label className="check"><input type="checkbox" checked={conCubo} onChange={(e) => setConCubo(e.target.checked)} /> {t.conCubo}</label>
                {conCubo && (
                  <>
                    <Entrada etq={t.cuboD} valor={dCubo} sug={dCuboSug} onChange={setDCubo} sugTxt={t.sugerido} />
                    <Entrada etq={t.cuboH} valor={largoTotal} sug={largoSug} onChange={setLargoTotal} sugTxt={t.sugerido} />
                  </>
                )}
                <Entrada etq={t.agujero} valor={agujero} sug={agujeroSug} onChange={setAgujero} sugTxt={t.sugerido} />
              </div>
              {cuboExcede && <p className="alerta">{t.cuboExcede}</p>}
            </Tarjeta>
          )}

          {visibles.has("material") && (
            <Tarjeta titulo={t.materialTit} icono="peso" unidad="">
              <div className="entradas">
                <label>{t.sobremedida}
                  <input type="number" min={0} step={0.5} value={sobremedida} onChange={(e) => setSobremedida(Number(e.target.value) || 0)} />
                </label>
              </div>
              <Dato nombre={t.corteD} sim="" valor={`${L(mat.dCorte)} ${U}`} destacado />
              <Dato nombre={t.corteL} sim="" valor={`${L(mat.largoCorte)} ${U}`} destacado />
              <Dato nombre={t.pesoBruto} sim="" valor={kg(mat.pesoBruto, l)} />
              <Dato nombre={t.pesoNeto} sim="" valor={kg(mat.pesoNeto, l)} />
              <p className="nota">{t.notaPeso}</p>
            </Tarjeta>
          )}
        </div>

        <p className="aviso">{t.aviso}</p>
      </section>
    </div>
  );
}

function MenuFicha({ texto, t }: { texto: () => string; t: Textos }) {
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    document.addEventListener("keydown", cerrar);
    return () => {
      document.removeEventListener("mousedown", cerrar);
      document.removeEventListener("keydown", cerrar);
    };
  }, [abierto]);

  const copiar = async (txt: string, msg: string) => {
    setAbierto(false);
    try {
      await navigator.clipboard.writeText(txt);
      setAviso(msg);
    } catch {
      setAviso(t.noCopia);
    }
    setTimeout(() => setAviso(""), 2000);
  };

  return (
    <div className="ficha no-print" ref={ref}>
      <div className="ficha-btns">
        <button className="btn-prim" onClick={() => window.print()}><Icono n="impresora" size={18} /> {t.imprimir}</button>
        <button className="btn-prim btn-mas" aria-label={t.mas} aria-haspopup="menu" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
          <Icono n="chevron" size={18} />
        </button>
      </div>
      {abierto && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={() => copiar(window.location.href, t.enlaceCopiado)}><Icono n="enlace" size={17} /> {t.copiarEnlace}</button>
          <button role="menuitem" onClick={() => copiar(texto(), t.medidasCopiadas)}><Icono n="copiar" size={17} /> {t.copiarMedidas}</button>
        </div>
      )}
      {aviso && <span className="toast" role="status"><Icono n="check" size={16} /> {aviso}</span>}
    </div>
  );
}

function Ayuda({ texto }: { texto: string }) {
  return (
    <span className="ayuda" tabIndex={0} aria-label={texto}>
      <Icono n="info" size={15} />
      <span className="ayuda-txt" role="tooltip">{texto}</span>
    </span>
  );
}

function Tarjeta({ titulo, icono, unidad, children }: { titulo: string; icono: string; unidad: string; children: React.ReactNode }) {
  return (
    <article className="tarjeta">
      <header>
        <h3><Icono n={icono} size={20} className="tarjeta-ico" />{titulo}</h3>
        {unidad && <span className="u">{unidad}</span>}
      </header>
      <dl>{children}</dl>
    </article>
  );
}

function Dato({ nombre, sim, valor, destacado }: { nombre: string; sim: string; valor: string; destacado?: boolean }) {
  return (
    <div className={`dato ${destacado ? "dest" : ""}`}>
      <dt>{nombre}{sim && <span className="sim">{sim}</span>}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

function Entrada({ etq, valor, sug, onChange, sugTxt }: { etq: string; valor: number | ""; sug: number; onChange: (v: number | "") => void; sugTxt: string }) {
  return (
    <label>
      {etq}
      <input type="number" min={0} placeholder={`${sug} (${sugTxt})`} value={valor}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
    </label>
  );
}
