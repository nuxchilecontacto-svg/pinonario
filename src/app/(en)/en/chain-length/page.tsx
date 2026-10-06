import type { Metadata } from "next";
import { CalcTransmision } from "@/components/CalcTransmision";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Roller Chain Length Calculator: Links and Exact Center Distance" },
  description:
    "How many links does your chain need? Enter pitch, sprocket teeth and center distance: get the exact length, the real center distance, ratio and RPM, plus a design check.",
  alternates: alternativas("/transmision/", "/en/chain-length/", "en"),
  openGraph: {
    title: "Roller Chain Length Calculator: Links and Exact Center Distance",
    description: "Links, real center distance, ratio and RPM of a roller chain drive. ANSI and ISO.",
    images: [{ url: "/img/taller-pinones-eje.jpg", width: 760, height: 570 }],
  },
};

export default function ChainLength() {
  return (
    <>
      <div className="intro">
        <span className="ceja">Roller chain drives</span>
        <h1>Chain length calculator</h1>
        <p>From the pitch, the teeth on each sprocket and the center distance: how many links to buy, where the shafts end up and whether the design is sound.</p>
      </div>
      <CalcTransmision l="en" />

      <section className="texto">
        <h2>Frequently asked questions</h2>
        <details open>
          <summary>How do you calculate roller chain length?</summary>
          <p>
            In pitches (links): L = 2C/p + (N1+N2)/2 + p·((N2−N1)/2π)²/C, where C is the center distance, p the pitch and N1, N2 the
            tooth counts. Round up to an even number, then recalculate the exact center distance for that number of links.
          </p>
        </details>
        <details>
          <summary>Why use an even number of links?</summary>
          <p>
            A roller chain alternates roller links and pin links. With an even number you close it with a standard connecting link; an
            odd number needs an offset (half) link, which is the weakest point of the chain.
          </p>
        </details>
        <details>
          <summary>What is the ideal center distance?</summary>
          <p>
            30 to 50 times the pitch. Shorter, and the chain wears faster; longer than about 80 pitches, add a guide or idler. Always leave
            1 to 2 pitches of adjustment for chain elongation.
          </p>
        </details>
        <details>
          <summary>How many teeth should the small sprocket have?</summary>
          <p>
            17 or more for smooth running. Below 17 teeth chordal action makes the chain pulse and vibrate, and below 9 wear is very fast.
            Keep the ratio of a single stage at or below 7:1.
          </p>
        </details>
      </section>
    </>
  );
}
