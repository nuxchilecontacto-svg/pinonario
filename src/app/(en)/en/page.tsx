import type { Metadata } from "next";
import { Calculadora } from "@/components/Calculadora";
import { Icono } from "@/components/Iconos";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = { alternates: alternativas("/", "/en/", "en") };

const FOTOS = [
  { src: "taller-pinones-eje.jpg", alt: "Sprockets mounted on a shaft", w: 760, h: 570, clase: "ancha" },
  { src: "taller-pinon-simple.jpg", alt: "Simplex roller chain sprocket", w: 570, h: 760, clase: "" },
  { src: "taller-engranajes.jpg", alt: "Spur gears", w: 427, h: 760, clase: "" },
  { src: "taller-eje-pinones.jpg", alt: "Painted shaft with sprockets", w: 428, h: 760, clase: "" },
  { src: "taller-torneado.jpg", alt: "Turning the hub", w: 570, h: 760, clase: "" },
  { src: "taller-cnc.jpg", alt: "Machining on a CNC center", w: 760, h: 570, clase: "ancha" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-foto" src="/img/pinon.jpg" alt="" width={760} height={570} fetchPriority="high" />
        <div className="hero-txt">
          <span className="ceja">Design &amp; calculation</span>
          <h1>Roller chain sprocket calculator</h1>
          <p>Pick the chain standard, the pitch and the number of teeth: get every dimension you need to make or check the sprocket.</p>
        </div>
        <ul className="hero-puntos">
          <li><Icono n="lapiz" size={26} /><div><b>Standard formulas</b><span>ANSI B29.1 and ISO 606 / DIN 8187</span></div></li>
          <li><Icono n="regla" size={26} /><div><b>Inch and mm</b><span>Simplex, duplex and triplex</span></div></li>
          <li><Icono n="engranaje" size={26} /><div><b>Built for the shop</b><span>Inspection, hub, stock size and DXF</span></div></li>
        </ul>
      </section>

      <Calculadora l="en" cadenaInicial="asa40" unidadInicial="in" />

      <a href="/en/chain-length/" className="cta-herramienta">
        <Icono n="cadena" size={30} />
        <div>
          <b>How many links does the chain need?</b>
          <span>Get the chain length, the exact center distance, the ratio and the RPM of your drive.</span>
        </div>
        <span className="cta-flecha">Chain length calculator →</span>
      </a>

      <section className="taller" aria-labelledby="taller-tit">
        <div className="taller-cab">
          <span className="ceja">From the shop floor</span>
          <h2 id="taller-tit">Real parts made in a machine shop</h2>
          <p>Custom sprockets, shafts and gears: from the calculation to the lathe and the machining center.</p>
        </div>
        <div className="galeria">
          {FOTOS.map((f) => (
            <figure key={f.src} className={f.clase}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/${f.src}`} alt={f.alt} width={f.w} height={f.h} loading="lazy" />
              <figcaption>{f.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="texto">
        <h2>Frequently asked questions</h2>
        <details open>
          <summary>What is the difference between ANSI and ISO (European) roller chain?</summary>
          <p>
            For the same pitch, the roller and the inner width change. At 1/2" pitch, ANSI 40 has a 0.312" (7.92 mm) roller while the
            European 08B has 0.335" (8.51 mm). That is why the bottom diameter and tooth width differ: a sprocket cut for one does not
            always run well with the other.
          </p>
        </details>
        <details>
          <summary>How is the sprocket pitch diameter calculated?</summary>
          <p>PD = pitch ÷ sin(180° ÷ N). It is the circle on which the chain roller centers sit.</p>
        </details>
        <details>
          <summary>How do I measure a sprocket with an odd number of teeth?</summary>
          <p>
            With an odd tooth count no two teeth are opposite, so a caliper does not read the bottom diameter directly. The calculator
            gives the corrected caliper diameter: PD · cos(90° ÷ N) − roller Ø.
          </p>
        </details>
        <details>
          <summary>Does it work for plate wheels without a hub?</summary>
          <p>Yes: untick “Sprocket with hub” and the calculator uses the tooth width for stock size and weight.</p>
        </details>
      </section>
    </>
  );
}
