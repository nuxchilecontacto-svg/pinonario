import type { Metadata } from "next";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";
import { alternativas, codigo } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Sprocket Dimension Charts for ANSI and ISO Roller Chain: 8 to 120 Teeth" },
  description:
    'Free sprocket charts for every roller chain size from #25 to #240 and 05B to 48B: pitch, outside, bottom and caliper diameters for 8 to 120 teeth, in inches.',
  alternates: alternativas("/tablas/", "/en/tables/", "en"),
};

export default function Tables() {
  return (
    <div className="pagina">
      <h1>Sprocket charts by chain size</h1>
      <p className="sub">Pitch, outside, bottom and caliper diameters for 8 to 120 teeth.</p>
      {(["ASA", "ISO"] as const).map((n) => (
        <section key={n}>
          <h2>{n === "ASA" ? "American ANSI B29.1 roller chain (A series)" : "European ISO 606 / DIN 8187 roller chain (B series)"}</h2>
          <ul className="grilla-links">
            {CADENAS.filter((c) => c.norma === n).map((c) => (
              <li key={c.id}>
                <Link href={`/en/tables/${c.id}/`}>
                  <b>{codigo(c, "en")}{c.equivalente ? ` (${c.equivalente})` : ""}</b>
                  <span>{c.medida} · p {c.p} mm</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
