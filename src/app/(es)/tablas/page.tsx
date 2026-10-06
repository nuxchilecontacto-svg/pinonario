import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import Link from "next/link";
import { CADENAS } from "@/lib/cadenas";

export const metadata: Metadata = {
  title: { absolute: "Tablas de Piñones ISO y ASA: 24 Pasos, de Z8 a Z120" },
  description:
    'Las tablas de piñones que usas en el taller, sin hojear catálogos: 24 cadenas de 8 mm a 3", europeas y americanas. Abre tu paso y encuentra tu Z en segundos.',
  alternates: alternativas("/tablas/", "/en/tables/", "es"),
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
