import type { Metadata } from "next";
import Link from "next/link";
import { CalcChavetas } from "@/components/CalcChavetas";
import { DatosApp } from "@/components/DatosApp";
import { TablaAnsi, TablaDin } from "@/components/TablasChavetas";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Keyway Size Calculator: ANSI and DIN 6885 Keys, Free" },
  description:
    "Enter the shaft diameter to get the key size and the shaft and hub keyseat width and depth (ANSI inch or DIN 6885 metric with tolerances), plus torque.",
  alternates: alternativas("/chavetas/", "/en/keyways/", "en"),
};

export default function Keyways() {
  return (
    <>
      <DatosApp nombre="Keyway size calculator" descripcion={metadata.description as string} ruta="/en/keyways/" l="en" />
      <div className="intro">
        <span className="ceja">Keys and keyways</span>
        <h1>Keyway size calculator</h1>
        <p>From the shaft diameter: the right key, the shaft and hub keyseat with tolerances, and how much torque it carries.</p>
      </div>
      <CalcChavetas l="en" />

      <section className="texto">
        <h2>ANSI B17.1 square key chart</h2>
        <TablaAnsi l="en" />
        <h2>DIN 6885 metric key chart (sheet 1)</h2>
        <p>
          Parallel keys, high form. t1 is the keyseat depth in the shaft and t2 in the hub; in the shop you check d − t1 on the shaft
          and d + t2 in the hub.
        </p>
        <TablaDin l="en" />

        <h2>FAQ</h2>
        <details open>
          <summary>What tolerance does a metric keyway width have?</summary>
          <p>
            It depends on the fit. Normal: shaft N9 and hub JS9 (general use). Tight: P9 in both (reversing loads or shock). Sliding:
            shaft H9 and hub D10, when the hub has to move along the shaft. The calculator gives the deviations in mm.
          </p>
        </details>
        <details>
          <summary>How do you measure keyway depth?</summary>
          <p>
            From the opposite side, not from the keyway edge: check d − t1 on the shaft and d + t2 in the bore with a caliper or
            micrometer. Example: a 1 1/4 in shaft with a 1/4 in key gives 1.125 in on the shaft and 1.375 in in the hub.
          </p>
        </details>
        <details>
          <summary>What key length should I use?</summary>
          <p>
            As a rule of thumb, 1 to 1.5 times the shaft diameter, never longer than the hub. If the torque capacity is not enough,
            use a longer key or two keys at 180°.
          </p>
        </details>
        <details>
          <summary>Which key does a sprocket need?</summary>
          <p>
            The one for the shaft diameter. In the <Link href="/en/">sprocket calculator</Link>, the drawing generator adds the DIN
            6885 keyway automatically from the bore.
          </p>
        </details>
      </section>
    </>
  );
}
