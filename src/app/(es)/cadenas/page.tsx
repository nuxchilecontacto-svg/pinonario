import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";
import { largo } from "@/lib/formato";

export const metadata: Metadata = {
  title: { absolute: "¿08B o ASA 40? Identifica tu Cadena de Rodillos" },
  description:
    "Parecen iguales, pero un piñón para 08B no siempre sirve en ASA 40. Mide paso y rodillo y compáralos con las medidas de 24 cadenas ISO y ASA.",
  alternates: alternativas("/cadenas/", "/en/chains/", "es"),
};

export default function Cadenas() {
  const L = (n: number) => largo(n, "mm");
  return (
    <div className="pagina">
      <h1>Medidas de cadenas de rodillos</h1>
      <p className="sub">Dimensiones principales en mm. ¿Tienes la cadena en la mano? <a href="/identificar/">Identifícala automáticamente con tres medidas de pie de metro →</a></p>
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
