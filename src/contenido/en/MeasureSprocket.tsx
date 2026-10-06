import Link from "next/link";
import { cadenaPorId } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";

const inch = (mm: number) => (mm / 25.4).toFixed(3);
const mm = (n: number) => n.toFixed(2);

export function MeasureSprocket() {
  const a40 = cadenaPorId("asa40")!;
  const b08 = cadenaPorId("08b")!;
  const a20 = calcularPinon(a40, 20);
  const a21 = calcularPinon(a40, 21);
  const b20 = calcularPinon(b08, 20);

  return (
    <>
      <p className="entrada">
        A worn sprocket comes in, no markings, no drawing, and you need to make another one. With a caliper and five minutes you can
        find out exactly what it is. This is the sequence we use in the shop.
      </p>

      <h2>1. Count the teeth (N)</h2>
      <p>
        It sounds obvious, but it is the most common mistake. Mark one tooth with chalk or a marker and count until you get back to it.
        On large sprockets, count twice. Note whether the number is <b>even or odd</b>, because it changes how you measure.
      </p>

      <h2>2. Find the pitch</h2>
      <p>
        If you have the chain, measure over several links: from the left edge of one roller to the left edge of another roller 10
        rollers away, then divide by 10. A 0.004" caliper error becomes 0.0004" per pitch. Standard pitches are 1/4", 3/8", 1/2", 5/8",
        3/4", 1", 1¼", 1½", 1¾", 2", 2½" and 3".
      </p>
      <p>
        If you only have the sprocket, the pitch follows from the diameters: with the readings from steps 3 and 4, the{" "}
        <Link href="/en/identify/?m=pinon">sprocket identifier</Link> tells you which chain fits.
      </p>

      <h2>3. Measure over the tips</h2>
      <p>
        With an <b>even</b> tooth count the teeth face each other: measure tip to tip. With an <b>odd</b> count there is a gap opposite
        every tooth, so the caliper reads a slightly smaller value than the true outside diameter (multiplied by the cosine of 90°/N).
      </p>
      <p>
        This reading is useful to get your bearings, but <b>it is not the most reliable</b>: tips wear, and each manufacturer turns them
        to a slightly different diameter within the standard. For a 20-tooth #40 sprocket, ANSI gives a turned OD of about{" "}
        {inch(a20.deRec)}" ({mm(a20.deRec)} mm).
      </p>

      <h2>4. Measure root to root: the reading that matters</h2>
      <p>
        The tooth root barely wears and its size is fixed by the standard: pitch diameter minus roller diameter. Rest the outside jaws of
        the caliper on the bottom of two opposite tooth gaps.
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Sprocket</th><th>Pitch dia.</th><th>Root to root</th><th>How to measure</th></tr></thead>
          <tbody>
            <tr><td className="izq">#40, 20 teeth (even)</td><td>{inch(a20.dp)}"</td><td>{inch(a20.dCalibre)}"</td><td className="izq">Opposite gaps: bottom dia. = PD − roller</td></tr>
            <tr><td className="izq">#40, 21 teeth (odd)</td><td>{inch(a21.dp)}"</td><td>{inch(a21.dCalibre)}"</td><td className="izq">To the most opposite gap: PD·cos(90°/N) − roller</td></tr>
            <tr><td className="izq">08B, 20 teeth</td><td>{inch(b20.dp)}"</td><td>{inch(b20.dCalibre)}"</td><td className="izq">Same pitch as #40, larger roller</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Look at the two 20-tooth rows: the American and the European sprocket have the <b>same pitch diameter</b>, but the root differs by{" "}
        {inch(a20.dCalibre - b20.dCalibre)}" ({mm(a20.dCalibre - b20.dCalibre)} mm). A caliper picks that up easily, and it is the quickest way
        to know whether the sprocket is for ANSI or European chain. More in <Link href="/en/guides/08b-vs-ansi-40/">08B vs ANSI 40</Link>.
      </p>

      <h2>5. Measure tooth width, hub and bore</h2>
      <ul>
        <li><b>Tooth width</b> at the base (not at the tip, which is chamfered). For a #40 simplex it is around {inch(a20.bf1)}".</li>
        <li><b>Hub:</b> diameter and overall length. The hub diameter has a maximum so the chain doesn&apos;t rub on it.</li>
        <li><b>Bore and keyway:</b> shaft diameter, keyway width and depth. If there is a set screw, its thread and position.</li>
        <li><b>Duplex or triplex:</b> also measure the distance between tooth rows (transverse pitch).</li>
      </ul>

      <h2>6. Spot the wear</h2>
      <p>
        A healthy tooth is symmetrical. A worn tooth is <b>hooked</b>: the working face wears away and the tip leans in the direction of
        rotation. You also see polished roots and burred tips. If the sprocket looks like that, the chain is almost certainly stretched:
        measure it (over 2–3% elongation it must be replaced) and <b>replace both together</b>; a new chain on a worn sprocket won&apos;t last.
      </p>

      <h2>With those readings, you can make it</h2>
      <p>
        With tooth count, pitch and chain type, the <Link href="/en/">sprocket calculator</Link> gives you every dimension to turn and
        inspect, the stock size, and a <b>DXF</b> of the tooth profile for cutting. And if you are torn between two chains, the{" "}
        <Link href="/en/identify/?m=pinon">identifier</Link> compares your readings against every standard.
      </p>
    </>
  );
}
