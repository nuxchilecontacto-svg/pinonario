import type { Metadata } from "next";
import { Identificador } from "@/components/Identificador";
import { alternativas } from "@/lib/idioma";
import { DatosApp } from "@/components/DatosApp";

export const metadata: Metadata = {
  title: { absolute: "What Chain or Sprocket Do I Have? Identify It with a Caliper" },
  description:
    "Worn sprocket with no markings? Count the teeth, take three caliper readings and find out if it is #40 or 08B, its pitch and how stretched your chain is.",
  alternates: alternativas("/identificar/", "/en/identify/", "en"),
  openGraph: {
    title: "What Chain or Sprocket Do I Have? Identify It with a Caliper",
    description: "Identify roller chains and sprockets (ANSI and ISO) with three caliper measurements.",
    images: [{ url: "/img/taller-pinon-simple.jpg", width: 570, height: 760 }],
  },
};

export default function Identify() {
  return (
    <>
      <DatosApp nombre="Chain and sprocket identifier" descripcion={metadata.description as string} ruta="/en/identify/" l="en" />
      <div className="intro">
        <span className="ceja">Identifier</span>
        <h1>What chain or sprocket do I have?</h1>
        <p>For worn or unmarked parts: with a caliper and a tooth count, we tell you the chain size, whether it is American or European, and if it is time to replace it.</p>
      </div>
      <Identificador l="en" />

      <section className="texto">
        <h2>Frequently asked questions</h2>
        <details open>
          <summary>How can I tell an ANSI 40 chain from a European 08B?</summary>
          <p>
            Both have a 1/2" pitch, but the roller is different: 0.312" (7.92 mm) on ANSI 40 and 0.335" (8.51 mm) on 08B. Measure the
            roller with a caliper; that 0.6 mm difference is easy to see. On the sprocket, the difference shows up root to root.
          </p>
        </details>
        <details>
          <summary>Why measure the pitch over several links?</summary>
          <p>
            A 0.1 mm error on a single pitch is almost 1% of a 1/2" pitch. Measuring 10 pitches spreads the same error over 10 and makes the
            reading ten times more accurate. It also shows the real elongation of the chain.
          </p>
        </details>
        <details>
          <summary>When should a roller chain be replaced?</summary>
          <p>
            When it is stretched more than 2 to 3% over its nominal pitch. Beyond that the chain rides up the teeth, skips and wears the
            sprockets. Replace chain and sprockets together if the teeth are already hooked.
          </p>
        </details>
        <details>
          <summary>Why is the root measurement more reliable than the tips?</summary>
          <p>
            Tooth tips wear, and every manufacturer turns them to a slightly different diameter within the standard. The root barely wears
            and its size is fixed by the standard: pitch diameter minus roller diameter.
          </p>
        </details>
      </section>
    </>
  );
}
