import type { Metadata } from "next";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";
import { largo } from "@/lib/formato";
import { alternativas, codigo } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Roller Chain Dimensions Chart: ANSI #25 to #240 and ISO 05B to 48B" },
  description:
    "Pitch, roller diameter, inner width, plate height and transverse pitch for 24 ANSI and ISO roller chains, in inches and mm. Tell #40 from 08B in a minute.",
  alternates: alternativas("/cadenas/", "/en/chains/", "en"),
};

export default function Chains() {
  const I = (n: number) => largo(n, "in", "en");
  const M = (n: number) => largo(n, "mm", "en");
  const orden = [...CADENAS.filter((c) => c.norma === "ASA"), ...CADENAS.filter((c) => c.norma === "ISO")];
  return (
    <div className="pagina">
      <h1>Roller chain dimensions</h1>
      <p className="sub">Main dimensions in inches (mm in brackets). Have the chain in your hand? <a href="/en/identify/">Identify it automatically with three caliper readings →</a></p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>Chain</th><th>Size</th><th>Pitch p</th><th>Roller Ø d1</th><th>Inner width b1</th><th>Plate h2</th><th>Transv. pitch pt</th>
            </tr>
          </thead>
          <tbody>
            {orden.map((c) => (
              <tr key={c.id}>
                <td><Link href={`/en/tables/${c.id}/`}>{codigo(c, "en")}{c.equivalente ? ` / ${c.equivalente}` : ""}</Link></td>
                <td className="izq">{c.medida}</td>
                <td>{I(c.p)} ({M(c.p)})</td><td>{I(c.d1)} ({M(c.d1)})</td><td>{I(c.b1)} ({M(c.b1)})</td><td>{I(c.h2)}</td><td>{I(c.pt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aviso">Values from ANSI B29.1 and ISO 606. ANSI 25 and 35 are rollerless (bushing) chains: d1 is the bushing diameter.</p>
    </div>
  );
}
