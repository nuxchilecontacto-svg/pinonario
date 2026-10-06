import type { Metadata } from "next";
import { CalcEngranajes } from "@/components/CalcEngranajes";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Spur Gear Calculator (Diametral Pitch or Module): Dimensions, Span and DXF" },
  description:
    "Diametral pitch or module and teeth: pitch, outside and root diameters, span over k teeth, chordal thickness, center distance and a DXF of the profile.",
  alternates: alternativas("/engranajes/", "/en/gears/", "en"),
  openGraph: {
    title: "Spur Gear Calculator (Diametral Pitch or Module): Dimensions, Span and DXF",
    description: "Spur gear dimensions, span measurement, chordal thickness, gear pair and DXF for cutting. DP or module.",
    images: [{ url: "/img/taller-engranajes.jpg", width: 427, height: 760 }],
  },
};

export default function Gears() {
  return (
    <>
      <div className="intro">
        <span className="ceja">Spur gears</span>
        <h1>Spur gear calculator</h1>
        <p>Diametral pitch (or module) and number of teeth: every dimension to cut and inspect the gear, the gear pair and the DXF of the profile.</p>
      </div>
      <CalcEngranajes l="en" />

      <section className="texto">
        <h2>Frequently asked questions</h2>
        <details open>
          <summary>How do you calculate the outside diameter of a spur gear?</summary>
          <p>
            In diametral pitch: pitch diameter = N ÷ DP and outside diameter = (N + 2) ÷ DP. A 10 DP gear with 20 teeth has a 2.000" pitch
            diameter and a 2.200" outside diameter. In metric: d = m·N and da = m·(N + 2).
          </p>
        </details>
        <details>
          <summary>How do I find the diametral pitch of a gear I have?</summary>
          <p>
            Measure the outside diameter and count the teeth: DP ≈ (N + 2) ÷ OD (in inches). Round to the nearest standard DP (4, 5, 6, 8,
            10, 12, 16…). If it does not land on a standard value, it may be a metric gear: module m ≈ OD ÷ (N + 2) in mm.
          </p>
        </details>
        <details>
          <summary>What is the span measurement (Wk)?</summary>
          <p>
            It is the practical way to check tooth thickness with a caliper: span k teeth with the flat jaws. For 20° and no profile shift,
            k ≈ N/9 + 0.5. The calculator gives k and the exact value of Wk.
          </p>
        </details>
        <details>
          <summary>What is profile shift (x)?</summary>
          <p>
            Moving the cutter out (positive x) or in (negative x) when generating the teeth. It avoids undercut on pinions with few teeth
            (below 17 at 20°) or adjusts the center distance. It changes the outside and root diameters, tooth thickness and Wk.
          </p>
        </details>
      </section>
    </>
  );
}
