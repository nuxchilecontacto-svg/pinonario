import type { Metadata } from "next";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";
import { largo } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Medidas de cadenas de rodillos ISO y ASA",
  description: "Paso, diámetro de rodillo, ancho interior y paso transversal de cadenas de rodillos europeas (ISO 606 / DIN 8187) y americanas (ANSI / ASA).",
};

export default function Cadenas() {
  const L = (n: number) => largo(n, "mm");
  return (
    <div className="pagina">
      <h1>Medidas de cadenas de rodillos</h1>
      <p className="sub">Dimensiones principales en mm. Úsalas para identificar una cadena midiendo paso y rodillo.</p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>Cadena</th><th>Medida</th><th>Paso p</th><th>Rodillo Ø d1</th><th>Ancho int. b1</th><th>Placa h2</th><th>Paso transv. pt</th>
            </tr>
          </thead>
          <tbody>
            {CADENAS.map((c) => (
              <tr key={c.id}>
                <td><Link href={`/tablas/${c.id}/`}>{c.codigo}{c.equivalente ? ` / ${c.equivalente}` : ""}</Link></td>
                <td className="izq">{c.medida}</td>
                <td>{L(c.p)}</td><td>{L(c.d1)}</td><td>{L(c.b1)}</td><td>{L(c.h2)}</td><td>{L(c.pt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aviso">Valores de ISO 606 y ANSI B29.1. ASA 25 y 35 son cadenas de casquillo (sin rodillo): d1 es el Ø del casquillo.</p>
    </div>
  );
}
