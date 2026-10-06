import type { Metadata } from "next";
import Link from "next/link";
import { GUIAS_EN } from "@/lib/guias";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Sprocket, Roller Chain and Gear Guides for the Machine Shop" },
  description:
    "Practical guides written from the shop floor: how to measure a sprocket, ANSI vs ISO chain, how many teeth to use and which steel and heat treatment to choose.",
  alternates: alternativas("/guias/", "/en/guides/", "en"),
};

export default function Guides() {
  return (
    <div className="pagina">
      <span className="ceja">Guides</span>
      <h1>Guides for the shop</h1>
      <p className="sub">What the catalog doesn&apos;t tell you: how to measure, how to choose and which mistakes to avoid, explained with real numbers.</p>
      <ul className="lista-guias">
        {GUIAS_EN.map((g) => (
          <li key={g.slug}>
            <Link href={`/en/guides/${g.slug}/`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/${g.foto}`} alt="" width={760} height={570} loading="lazy" />
              <div>
                <b>{g.titulo}</b>
                <span>{g.resumen}</span>
                <small>{g.minutos} min read</small>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
