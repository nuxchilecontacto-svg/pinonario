import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import Link from "next/link";
import { GUIAS } from "@/lib/guias";

export const metadata: Metadata = {
  title: { absolute: "Guías de Piñones, Cadenas y Engranajes para el Taller" },
  description:
    "Guías prácticas escritas desde el taller: cómo medir un piñón, diferencias entre cadena europea y americana, cuántos dientes usar y qué acero y temple elegir.",
  alternates: alternativas("/guias/", "/en/guides/", "es"),
};

export default function Guias() {
  return (
    <div className="pagina">
      <span className="ceja">Guías</span>
      <h1>Guías para el taller</h1>
      <p className="sub">Lo que no viene en el catálogo: cómo medir, cómo elegir y qué errores evitar, explicado con números reales.</p>
      <ul className="lista-guias">
        {GUIAS.map((g) => (
          <li key={g.slug}>
            <Link href={`/guias/${g.slug}/`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/${g.foto}`} alt="" width={760} height={570} loading="lazy" />
              <div>
                <b>{g.titulo}</b>
                <span>{g.resumen}</span>
                <small>{g.minutos} min de lectura</small>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
