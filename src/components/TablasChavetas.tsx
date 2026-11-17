import { CHAVETAS_ANSI, CHAVETAS_DIN6885 } from "@/lib/chavetas";
import { num } from "@/lib/formato";
import type { Idioma } from "@/lib/idioma";

/** Tablas completas DIN 6885 y ANSI B17.1 (contenido estático para consulta e impresión). */
export function TablaDin({ l }: { l: Idioma }) {
  const N = (v: number) => num(v, v % 1 ? 1 : 0, l);
  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr>
            <th>{l === "en" ? "Shaft Ø over – up to (mm)" : "Eje Ø más de – hasta (mm)"}</th>
            <th>{l === "en" ? "Key b × h" : "Chaveta b × h"}</th>
            <th>{l === "en" ? "Shaft depth t1" : "Prof. eje t1"}</th>
            <th>{l === "en" ? "Hub depth t2" : "Prof. cubo t2"}</th>
          </tr>
        </thead>
        <tbody>
          {CHAVETAS_DIN6885.map((c) => (
            <tr key={c.b}><td>{N(c.dMin)} – {N(c.dMax)}</td><td><b>{c.b} × {c.h}</b></td><td>{N(c.t1)}</td><td>{N(c.t2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TablaAnsi({ l }: { l: Idioma }) {
  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr>
            <th>{l === "en" ? "Shaft Ø over – up to (in)" : "Eje Ø más de – hasta (pulg.)"}</th>
            <th>{l === "en" ? "Square key W × W (in)" : "Chaveta cuadrada W × W (pulg.)"}</th>
            <th>{l === "en" ? "Keyseat depth, shaft and hub (in)" : "Prof. chavetero eje y cubo (pulg.)"}</th>
          </tr>
        </thead>
        <tbody>
          {CHAVETAS_ANSI.map((c) => (
            <tr key={c.wTxt}><td>{c.dMinTxt} – {c.dMaxTxt}</td><td><b>{c.wTxt} × {c.wTxt}</b></td><td>{num(c.w / 2, 3, l)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
