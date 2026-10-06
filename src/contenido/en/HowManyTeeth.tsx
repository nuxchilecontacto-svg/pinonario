import Link from "next/link";
import { calcularTransmision } from "@/lib/transmision";

const f = (n: number, d = 1) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const poligonal = (z: number) => (1 - Math.cos(Math.PI / z)) * 100;

export function HowManyTeeth() {
  const filas = [9, 11, 13, 15, 17, 19, 21, 25, 30];
  // Example: 1750 rpm motor → machine at ~500 rpm, #40 chain, ~20" center distance
  const opciones = [15, 17, 19, 21].map((z1) => {
    const z2 = Math.round((z1 * 1750) / 500);
    const t = calcularTransmision({ p: 12.7, z1, z2, c: 508, rpm1: 1750 });
    return { z1, z2, t };
  });

  return (
    <>
      <p className="entrada">
        “How many teeth should the small sprocket have?” The short answer is 17 or more. The useful answer explains why, when you can go
        lower, and what happens on the large sprocket.
      </p>

      <h2>Chordal action: why small sprockets pound</h2>
      <p>
        The chain doesn&apos;t wrap a circle but a polygon: every link is a straight side. As the sprocket turns, the chain rises and falls
        and its speed varies with every tooth. The fewer the teeth, the bigger the variation, which means vibration, noise, rollers
        hitting the teeth, and wear.
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Sprocket teeth</th>{filas.map((z) => <th key={z}>{z}</th>)}</tr></thead>
          <tbody>
            <tr><td className="izq">Speed variation</td>{filas.map((z) => <td key={z}>{f(poligonal(z))}%</td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Variation = 1 − cos(180°/N).</p>
      <p>Below 17 teeth the variation climbs fast; above 21 it is barely noticeable. Hence the usual guidelines:</p>
      <ul>
        <li><b>17 teeth or more</b> for general use.</li>
        <li><b>21 to 25 teeth</b> for high speed or shock loads.</li>
        <li><b>9 to 13 teeth</b> only at low speed and light load (slow conveyors, hand drives).</li>
      </ul>

      <h2>The large sprocket has a limit too</h2>
      <p>
        As the chain wears it elongates, and the roller rides higher on the tooth. The more teeth the sprocket has, the less elongation it
        tolerates before the chain jumps. As a rule of thumb, allowable elongation is about 200 ÷ N percent: a 50-tooth sprocket tolerates
        about 4%, a 120-tooth one only 1.7%. That is why you should <b>stay at or below 120 teeth</b> and avoid large ratios in one stage.
      </p>

      <h2>Maximum ratio: 7 to 1</h2>
      <p>
        Beyond 7:1 the small sprocket has a small wrap angle (few teeth engaged) and the large one gets huge. If you need more reduction,
        do it in two stages. Ideally stay under 6:1 with at least 120° of wrap on the small sprocket.
      </p>

      <h2>Odd teeth and even links</h2>
      <p>
        A chain almost always has an even number of links (to close it with a standard connecting link). If the sprocket has an{" "}
        <b>odd</b> number of teeth, each tooth meets a different link on every turn and wear spreads evenly. That is why 17, 19, 21 or 23
        teeth are so common.
      </p>

      <h2>Worked example</h2>
      <p>
        A 1,750 rpm motor must drive a machine at about 500 rpm, with #40 chain and roughly 20" between shafts. The required ratio is
        1,750 ÷ 500 = 3.5. These are the options:
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>N1</th><th>N2</th><th>Output RPM</th><th>Links</th><th>Chain speed</th><th>Comment</th></tr></thead>
          <tbody>
            {opciones.map(({ z1, z2, t }) => (
              <tr key={z1}>
                <td>{z1}</td><td>{z2}</td><td>{f(t.rpm2!, 0)}</td><td>{t.eslabones}</td><td>{f(t.velocidad! * 196.85, 0)} ft/min</td>
                <td className="izq">{z1 < 17 ? "Works, but with more vibration" : z1 === 17 ? "Recommended minimum" : "Smoother; larger driven sprocket"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        17 or 19 teeth on the small sprocket is the best balance. For the exact center distance and the rest of the data for each option,
        use the <Link href="/en/chain-length/?c=asa40&z1=19&z2=67&d=508&n=1750">chain length calculator</Link>.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Small sprocket: 17 or more; 21 to 25 for speed or shock.</li>
        <li>Large sprocket: up to about 120 teeth.</li>
        <li>Ratio: up to 7:1 per stage, ideally under 6:1.</li>
        <li>Prefer odd tooth counts with an even number of links.</li>
        <li>Center distance: 30 to 50 pitches.</li>
      </ul>
      <p>Once the tooth counts are set, the <Link href="/en/">sprocket calculator</Link> gives you every dimension to make them.</p>
    </>
  );
}
