import type { Metadata } from "next";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";

export const metadata: Metadata = {
  title: "Tablas de piñones por paso de cadena (ISO y ASA)",
  description: "Tablas de diámetros de piñones de 8 a 120 dientes para cada paso de cadena de rodillos, europea ISO 606 y americana ANSI.",
};

export default function Tablas() {
  return (
    <div className="pagina">
      <h1>Tablas de piñones por paso</h1>
      <p className="sub">Diámetro primitivo, exterior, de fondo y medida de control para Z 8 a 120.</p>
      {(["ISO", "ASA"] as const).map((n) => (
        <section key={n}>
          <h2>{n === "ISO" ? "Cadena europea ISO 606 / DIN 8187 (serie B)" : "Cadena americana ANSI B29.1 / ASA (serie A)"}</h2>
          <ul className="grilla-links">
            {CADENAS.filter((c) => c.norma === n).map((c) => (
              <li key={c.id}>
                <Link href={`/tablas/${c.id}/`}>
                  <b>{c.medida}</b>
                  <span>{c.codigo}{c.equivalente ? ` · ${c.equivalente}` : ""} · p {c.p} mm</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
