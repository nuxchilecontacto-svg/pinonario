import type { Metadata } from "next";
import Link from "next/link";
import { alternativas } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "About",
  description: `${SITIO.nombre} was born at Ingema, a machine shop in Chile, to stop digging through paper catalogs. Free tools for machine shops.`,
  alternates: alternativas("/acerca/", "/en/about/", "en"),
};

export default function About() {
  return (
    <article className="guia">
      <span className="ceja">About</span>
      <h1>Made in a machine shop, for machine shops</h1>
      <div className="guia-cuerpo">
        <p className="entrada">
          {SITIO.nombre} (Spanish for a “book of sprockets”) was born at <b>Ingema</b>, a machine shop in Chile where we make sprockets,
          gears, shafts and custom parts.
        </p>
        <p>
          To quote and make a sprocket, we had to look up its dimensions in a paper catalog: the table for the pitch, the row for the tooth
          count, and another table depending on whether the chain was American or European. Several people working from the same worn-out
          book, with the risk of reading the wrong row.
        </p>
        <p>
          We realized we were not the only ones: machine shops, job shops and maintenance teams everywhere have the same problem. So instead
          of digitizing a catalog, we built tools that <b>calculate the dimensions straight from the standards</b> (ANSI B29.1, ISO 606,
          ISO 53), for any tooth count, in inches or millimeters.
        </p>

        <h2>What you will find here</h2>
        <ul>
          <li><Link href="/en/">Sprocket calculator</Link> with drawing and DXF for cutting.</li>
          <li><Link href="/en/chain-length/">Chain length</Link> and drive design.</li>
          <li><Link href="/en/identify/">Identifier</Link> for chains and sprockets with a caliper.</li>
          <li><Link href="/en/gears/">Spur gears</Link> and <Link href="/en/racks/">gear racks</Link>.</li>
          <li><Link href="/en/guides/">Practical guides</Link> written from the shop floor.</li>
        </ul>

        <h2>How we work</h2>
        <p>
          The formulas follow the international standards, and we check them against manufacturer catalogs and real parts made in our shop.
          Still, every manufacturer has its own tolerances: verify the dimensions against the actual chain or gear before you cut metal.
        </p>
        <p>
          The tools are and will remain <b>free</b>. If you find a mistake, have a suggestion or need a tool that isn&apos;t here,{" "}
          <Link href="/en/contact/">get in touch</Link>.
        </p>
      </div>
    </article>
  );
}
