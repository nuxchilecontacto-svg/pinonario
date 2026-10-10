import type { Metadata } from "next";
import { CalcCremallera } from "@/components/CalcCremallera";
import { alternativas } from "@/lib/idioma";
import { DatosApp } from "@/components/DatosApp";

export const metadata: Metadata = {
  title: { absolute: "Gear Rack Calculator (DP or Module): Pitch, Length and DXF" },
  description:
    "Diametral pitch or module and length: pitch, number of teeth, pitch line height, travel per pinion revolution and a DXF of the full bar to cut or mill.",
  alternates: alternativas("/cremalleras/", "/en/racks/", "en"),
};

export default function Racks() {
  return (
    <>
      <DatosApp nombre="Gear rack calculator" descripcion={metadata.description as string} ruta="/en/racks/" l="en" />
      <div className="intro">
        <span className="ceja">Gear racks</span>
        <h1>Gear rack calculator</h1>
        <p>From the pitch and the length you need: teeth, exact pitch, heights, where the pinion goes and the DXF of the bar.</p>
      </div>
      <CalcCremallera l="en" />
      <section className="texto">
        <h2>Frequently asked questions</h2>
        <details open>
          <summary>How far does a rack travel per pinion revolution?</summary>
          <p>Travel = π · N ÷ DP (or π · m · N in metric). A 10 DP pinion with 20 teeth moves the rack 6.283" per revolution.</p>
        </details>
        <details>
          <summary>Where does the pinion center go relative to the rack?</summary>
          <p>
            Above the base of the bar by the pitch line height (overall height minus one addendum) plus the pinion pitch radius
            (N ÷ DP ÷ 2).
          </p>
        </details>
        <details>
          <summary>How are two rack sections joined?</summary>
          <p>
            Each section must be a whole number of pitches long and cut at the middle of a tooth space. When joining them, use a short piece
            of rack as a gauge so the pitch stays correct across the joint.
          </p>
        </details>
      </section>
    </>
  );
}
