import type { Metadata } from "next";
import Link from "next/link";
import { BuscadorRodamientos } from "@/components/BuscadorRodamientos";
import { DatosApp } from "@/components/DatosApp";
import { TablaRodamientos } from "@/components/FichaRodamiento";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Bearing Size Chart and Lookup by Number or Caliper, Free" },
  description:
    "Type the bearing number (6205-2RS, 608ZZ…) or measure bore, OD and width: get the size, what the suffixes mean and brand equivalents. Free, no sign-up.",
  alternates: alternativas("/rodamientos/", "/en/bearings/", "en"),
};

export default function Bearings() {
  return (
    <>
      <DatosApp nombre="Bearing size lookup" descripcion={metadata.description as string} ruta="/en/bearings/" l="en" />
      <div className="intro">
        <span className="ceja">Bearings</span>
        <h1>Bearing size lookup by number</h1>
        <p>Type the number stamped on the bearing, or measure bore, outside diameter and width with a caliper, to know which bearing it is and how to order it in any brand.</p>
      </div>
      <BuscadorRodamientos l="en" />

      <section className="texto">
        <h2>Deep groove ball bearing size chart</h2>
        <p>Dimensions in mm: d = bore, D = outside diameter, B = width. Tap a number to see its data sheet with versions and equivalents.</p>
        <TablaRodamientos l="en" />

        <h2>FAQ</h2>
        <details open>
          <summary>How do I find the bore size from the bearing number?</summary>
          <p>
            On 4-digit bearings, the last two digits times 5 give the bore in mm: 6205 → 05 × 5 = 25 mm. The exceptions are 00 = 10
            mm, 01 = 12 mm, 02 = 15 mm and 03 = 17 mm. On 3-digit miniature bearings the last digit is the bore: 608 = 8 mm.
          </p>
        </details>
        <details>
          <summary>What is the difference between 2RS and ZZ?</summary>
          <p>
            ZZ (or 2Z) are metal shields: they keep out coarse dirt with no drag, so they allow higher rpm. 2RS (DDU, LLU, 2RSH
            depending on the brand) are rubber seals touching the inner ring: better against fine dust and water, with a bit more drag.
          </p>
        </details>
        <details>
          <summary>What does C3 mean?</summary>
          <p>
            The bearing has more internal clearance than normal. It is used with tight shaft fits or high running temperatures, for
            example in electric motors. If the original is C3, the replacement should be C3 too.
          </p>
        </details>
        <details>
          <summary>Is an SKF 6205 the same as an NSK or NTN 6205?</summary>
          <p>
            The size is: d, D and B are standardized (ISO 15) and identical in every brand. What changes is how seals and shields are
            named, and load ratings, grease or noise level may differ. Each data sheet shows how to order the same version in each brand.
          </p>
        </details>
        <details>
          <summary>Which key does the shaft need?</summary>
          <p>Use the <Link href="/en/keyways/">keyway size calculator</Link>: from the shaft diameter it gives the key and keyseat with tolerances.</p>
        </details>
      </section>
    </>
  );
}
