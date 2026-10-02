"use client";

import { useEffect, useMemo, useState } from "react";
import { CADENAS, cadenaPorId, type Norma } from "@/lib/cadenas";
import { calcularMaterial, calcularPinon, Z_MAX, Z_MIN, type Hileras } from "@/lib/calculo";
import { grados, kg, largo, unidad, type Unidad } from "@/lib/formato";
import { DibujoPinon } from "./DibujoPinon";

type Grupo = "diametros" | "control" | "dentado" | "perfil" | "cubo" | "material";

const GRUPOS: { id: Grupo; titulo: string }[] = [
  { id: "diametros", titulo: "Diámetros" },
  { id: "control", titulo: "Control y medición" },
  { id: "dentado", titulo: "Ancho del dentado" },
  { id: "perfil", titulo: "Perfil del diente" },
  { id: "cubo", titulo: "Cubo" },
  { id: "material", titulo: "Material y peso" },
];

export function Calculadora({ cadenaInicial = "08b", zInicial = 20 }: { cadenaInicial?: string; zInicial?: number }) {
  const [norma, setNorma] = useState<Norma>(cadenaPorId(cadenaInicial)?.norma ?? "ISO");
  const [cadenaId, setCadenaId] = useState(cadenaInicial);
  const [z, setZ] = useState(zInicial);
  const [hileras, setHileras] = useState<Hileras>(1);
  const [u, setU] = useState<Unidad>("mm");
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
    if (q.get("u") === "in") setU("in");
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

  const L = (mm: number) => largo(mm, u);
  const U = unidad(u);

  return (
    <div className="calc">
      {/* ── Paso 1–3: selección ── */}
      <section className="panel seleccion" aria-label="Datos del piñón">
        <div className="campo">
          <span className="etq"><b>1</b> Norma de la cadena</span>
          <div className="seg" role="radiogroup">
            {(["ISO", "ASA"] as Norma[]).map((n) => (
              <button key={n} role="radio" aria-checked={norma === n} className={norma === n ? "on" : ""} onClick={() => cambiarNorma(n)}>
                {n === "ISO" ? "ISO / DIN (europea, B)" : "ASA / ANSI (americana, A)"}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="cadena"><b>2</b> Paso de la cadena</label>
          <select id="cadena" value={cadena.id} onChange={(e) => setCadenaId(e.target.value)}>
            {cadenas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.medida} — {c.codigo}{c.equivalente ? ` / ${c.equivalente}` : ""} (p = {c.p} mm)
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label className="etq" htmlFor="z"><b>3</b> Número de dientes (Z)</label>
          <div className="zfila">
            <button className="paso" onClick={() => setZ(Math.max(zValido - 1, Z_MIN))} aria-label="Restar un diente">−</button>
            <input id="z" type="number" inputMode="numeric" min={Z_MIN} max={Z_MAX} value={z}
              onChange={(e) => setZ(Number(e.target.value))} onBlur={() => setZ(zValido)} />
            <button className="paso" onClick={() => setZ(Math.min(zValido + 1, Z_MAX))} aria-label="Sumar un diente">+</button>
          </div>
        </div>

        <div className="fila2">
          <div className="campo">
            <span className="etq">Hileras</span>
            <div className="seg chico">
              {([1, 2, 3] as Hileras[]).map((h) => (
                <button key={h} className={hileras === h ? "on" : ""} onClick={() => setHileras(h)}>
                  {h === 1 ? "Simple" : h === 2 ? "Doble" : "Triple"}
                </button>
              ))}
            </div>
          </div>
          <div className="campo">
            <span className="etq">Unidades</span>
            <div className="seg chico">
              <button className={u === "mm" ? "on" : ""} onClick={() => setU("mm")}>mm</button>
              <button className={u === "in" ? "on" : ""} onClick={() => setU("in")}>pulgadas</button>
            </div>
          </div>
        </div>

        <div className="cadena-datos">
          <span>Cadena: <b>{cadena.codigo}</b></span>
          <span>Paso <b>{L(cadena.p)}</b></span>
          <span>Rodillo Ø <b>{L(cadena.d1)}</b></span>
          <span>Ancho int. <b>{L(cadena.b1)}</b></span>
          {hileras > 1 && <span>Paso transv. <b>{L(cadena.pt)}</b></span>}
          <span className="u">{U}</span>
        </div>

        <div className="dibujo">
          <DibujoPinon p={cadena.p} z={zValido} d1={cadena.d1} dp={r.dp} de={r.deRec} df={r.df} />
        </div>
      </section>

      {/* ── Resultados ── */}
      <section className="resultados" aria-label="Medidas calculadas">
        <div className="resumen">
          <div>
            <h2>Piñón {cadena.medida} · Z{zValido}{hileras > 1 ? ` · ${hileras === 2 ? "doble" : "triple"}` : ""}</h2>
            <p>{cadena.norma === "ISO" ? "ISO 606 / DIN 8187" : "ANSI B29.1"} · {cadena.codigo}{cadena.equivalente ? ` (${cadena.equivalente})` : ""}</p>
          </div>
          <button className="btn-imprimir" onClick={() => window.print()}>Imprimir ficha</button>
        </div>

        <div className="chips no-print" aria-label="Elegir qué datos mostrar">
          {GRUPOS.map((g) => (
            <label key={g.id} className={`chip ${visibles.has(g.id) ? "on" : ""}`}>
              <input type="checkbox" checked={visibles.has(g.id)} onChange={() => toggle(g.id)} />
              {g.titulo}
            </label>
          ))}
        </div>

        <div className="tarjetas">
          {visibles.has("diametros") && (
            <Tarjeta titulo="Diámetros" unidad={U}>
              <Dato nombre="Diámetro primitivo" sim="Dp" valor={L(r.dp)} destacado />
              <Dato nombre="Diámetro exterior (torneado)" sim="De" valor={L(r.deRec)} destacado />
              <Dato nombre="De mínimo / máximo norma" sim="" valor={`${L(r.deMin)} – ${L(r.deMax)}`} />
              <Dato nombre="Diámetro de fondo" sim="Df" valor={L(r.df)} destacado />
              <Dato nombre="Paso angular" sim="" valor={grados(r.paso_angular)} />
            </Tarjeta>
          )}

          {visibles.has("control") && (
            <Tarjeta titulo="Control y medición" unidad={U}>
              <Dato nombre={zValido % 2 === 0 ? "Medida con pie de metro (Z par = Df)" : "Medida con pie de metro (Z impar)"} sim="Mc" valor={L(r.dCalibre)} destacado />
              <Dato nombre={`Medida sobre rodillos Ø ${L(cadena.d1)}`} sim="MR" valor={L(r.mRodillos)} />
              <p className="nota">{zValido % 2 === 0
                ? "Z par: se mide de fondo a fondo de dientes opuestos."
                : "Z impar: no hay dientes opuestos; se mide de un fondo al fondo más cercano al otro lado."}</p>
            </Tarjeta>
          )}

          {visibles.has("dentado") && (
            <Tarjeta titulo="Ancho del dentado" unidad={U}>
              <Dato nombre="Ancho de diente (por hilera)" sim="bf1" valor={L(r.bf1)} destacado />
              {hileras > 1 && <Dato nombre={`Ancho total ${hileras} hileras`} sim="bfn" valor={L(r.bfTotal)} destacado />}
              {hileras > 1 && <Dato nombre="Paso transversal" sim="pt" valor={L(cadena.pt)} />}
              <Dato nombre="Chaflán lateral del diente" sim="ba" valor={L(r.ba)} />
              <Dato nombre="Radio lateral del diente" sim="rx" valor={L(r.rx)} />
            </Tarjeta>
          )}

          {visibles.has("perfil") && (
            <Tarjeta titulo="Perfil del diente (ISO 606)" unidad={U}>
              <Dato nombre="Radio de asiento del rodillo" sim="ri" valor={`${L(r.riMin)} – ${L(r.riMax)}`} />
              <Dato nombre="Radio de flanco" sim="re" valor={`${L(r.reMin)} – ${L(r.reMax)}`} />
              <Dato nombre="Ángulo de asiento" sim="α" valor={`${grados(r.alfaMin)} – ${grados(r.alfaMax)}`} />
            </Tarjeta>
          )}

          {visibles.has("cubo") && (
            <Tarjeta titulo="Cubo" unidad={U}>
              <Dato nombre="Diámetro máximo de cubo" sim="Dg máx" valor={L(r.dCuboMax)} destacado />
              <div className="entradas">
                <label className="check"><input type="checkbox" checked={conCubo} onChange={(e) => setConCubo(e.target.checked)} /> Piñón con cubo (si no, es corona/disco)</label>
                {conCubo && (
                  <>
                    <Entrada etq="Ø cubo (mm)" valor={dCubo} sug={dCuboSug} onChange={setDCubo} />
                    <Entrada etq="Largo total H (mm)" valor={largoTotal} sug={largoSug} onChange={setLargoTotal} />
                  </>
                )}
                <Entrada etq="Agujero d (mm)" valor={agujero} sug={agujeroSug} onChange={setAgujero} />
              </div>
              {cuboExcede && <p className="alerta">El cubo supera el máximo: la cadena rozará con el cubo.</p>}
            </Tarjeta>
          )}

          {visibles.has("material") && (
            <Tarjeta titulo="Material de partida (acero)" unidad="">
              <div className="entradas">
                <label>Sobremedida de mecanizado (mm)
                  <input type="number" min={0} step={0.5} value={sobremedida} onChange={(e) => setSobremedida(Number(e.target.value) || 0)} />
                </label>
              </div>
              <Dato nombre="Ø de corte (barra o disco)" sim="" valor={`${L(mat.dCorte)} ${U}`} destacado />
              <Dato nombre="Largo / espesor de corte" sim="" valor={`${L(mat.largoCorte)} ${U}`} destacado />
              <Dato nombre="Peso bruto del material" sim="" valor={kg(mat.pesoBruto)} />
              <Dato nombre="Peso aprox. pieza terminada" sim="" valor={kg(mat.pesoNeto)} />
              <p className="nota">Densidad 7,85 kg/dm³. El peso terminado es aproximado (útil para cotizar flete o tratamiento).</p>
            </Tarjeta>
          )}
        </div>

        <p className="aviso">
          Medidas calculadas según las fórmulas de ISO 606 y ANSI B29.1. Verifique contra la cadena real antes de fabricar;
          los fabricantes pueden usar tolerancias propias.
        </p>
      </section>
    </div>
  );
}

function Tarjeta({ titulo, unidad, children }: { titulo: string; unidad: string; children: React.ReactNode }) {
  return (
    <article className="tarjeta">
      <header>
        <h3>{titulo}</h3>
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

function Entrada({ etq, valor, sug, onChange }: { etq: string; valor: number | ""; sug: number; onChange: (v: number | "") => void }) {
  return (
    <label>
      {etq}
      <input type="number" min={0} placeholder={`${sug} (sugerido)`} value={valor}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
    </label>
  );
}
