import Link from "next/link";
import { CADENAS, cadenaPorId } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";
import { codigo } from "@/lib/idioma";

const inch = (mm: number) => (mm / 25.4).toFixed(3);
const mm = (n: number) => n.toFixed(2);

export function AnsiVsIso() {
  const b = cadenaPorId("08b")!;
  const a = cadenaPorId("asa40")!;
  const pb = calcularPinon(b, 20);
  const pa = calcularPinon(a, 20);
  const pares = CADENAS.filter((c) => c.norma === "ASA")
    .map((asa) => [asa, CADENAS.find((x) => x.norma === "ISO" && x.p === asa.p)] as const)
    .filter(([, iso]) => iso);
  const b16 = cadenaPorId("16b")!, a80 = cadenaPorId("asa80")!;

  return (
    <>
      <p className="entrada">
        Both are sold as “1/2-inch chain”, both have exactly the same pitch, and side by side they look identical. But a sprocket cut for
        one does not run right with the other. Here is what changes.
      </p>

      <h2>Two standards for the same pitch</h2>
      <ul>
        <li><b>ANSI 40</b> (also #40, RS40, or 08A in ISO) is the American chain, standard <b>ANSI/ASME B29.1</b>. It dominates in North America and on most Asian machinery.</li>
        <li><b>08B</b> is the European chain, <b>ISO 606 B series</b> (formerly DIN 8187, also called British Standard). Common on machinery built in Europe.</li>
      </ul>
      <p>The pitch is the same, the roller and inner width are not:</p>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Dimension</th><th>ANSI 40</th><th>08B</th><th>Difference</th></tr></thead>
          <tbody>
            <tr><td className="izq">Pitch</td><td>{inch(a.p)}"</td><td>{inch(b.p)}"</td><td>0</td></tr>
            <tr><td className="izq">Roller diameter</td><td>{inch(a.d1)}" ({mm(a.d1)})</td><td>{inch(b.d1)}" ({mm(b.d1)})</td><td>{mm(b.d1 - a.d1)} mm</td></tr>
            <tr><td className="izq">Inner width</td><td>{inch(a.b1)}" ({mm(a.b1)})</td><td>{inch(b.b1)}" ({mm(b.b1)})</td><td>{mm(a.b1 - b.b1)} mm</td></tr>
            <tr><td className="izq">20T sprocket: pitch dia.</td><td>{inch(pa.dp)}"</td><td>{inch(pb.dp)}"</td><td>0</td></tr>
            <tr><td className="izq">20T sprocket: bottom dia.</td><td>{inch(pa.df)}"</td><td>{inch(pb.df)}"</td><td>{mm(pa.df - pb.df)} mm</td></tr>
            <tr><td className="izq">20T sprocket: tooth width</td><td>{inch(pa.bf1)}"</td><td>{inch(pb.bf1)}"</td><td>{mm(pa.bf1 - pb.bf1)} mm</td></tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Per ANSI B29.1 and ISO 606. Millimeters in brackets.</p>

      <h2>Can you mix them?</h2>
      <p>Because the pitch diameter is the same, the chain does go onto the other sprocket, which is why the mix-up is so common. But it does not run well:</p>
      <ul>
        <li><b>08B chain on an ANSI 40 sprocket:</b> the roller is {mm(b.d1 - a.d1)} mm larger than the seat the tooth was cut for. The chain rides high on the flanks instead of the root, pounds, and wears quickly.</li>
        <li><b>ANSI 40 chain on an 08B sprocket:</b> the roller is loose in the seat. It works under light load, but with play, noise and accelerated wear.</li>
      </ul>
      <p><b>The recommendation is not to mix them.</b> For a temporary repair it may do, but when you replace parts, the sprocket should match the chain standard.</p>

      <h2>How to tell them apart in a minute</h2>
      <ol>
        <li><b>Measure the roller with a caliper.</b> 0.312" (7.9 mm) is ANSI 40; 0.335" (8.5 mm) is 08B. The 0.6 mm difference is easy to see.</li>
        <li><b>Read the markings.</b> Most chains have the size stamped on the plates: “40”, “RS40”, “40-1”, “08B-1”.</li>
        <li><b>On the sprocket, measure root to root.</b> With 20 teeth: {inch(pa.df)}" is ANSI 40 and {inch(pb.df)}" is 08B.</li>
      </ol>
      <p>The <Link href="/en/identify/">chain and sprocket identifier</Link> runs this comparison automatically from your readings.</p>

      <h2>The same applies to every pitch</h2>
      <p>Each pitch has an American and a European version:</p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Pitch</th><th>ANSI</th><th>Roller</th><th>ISO B</th><th>Roller</th></tr></thead>
          <tbody>
            {pares.map(([asa, iso]) => (
              <tr key={asa.id}>
                <td className="izq">{asa.medida.split(" x ")[0]}</td>
                <td><Link href={`/en/tables/${asa.id}/`}>{codigo(asa, "en")}</Link></td><td>{inch(asa.d1)}"</td>
                <td><Link href={`/en/tables/${iso!.id}/`}>{iso!.codigo}</Link></td><td>{inch(iso!.d1)}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Watch out at 1" (ANSI 80 and 16B): <b>the roller is practically the same</b> ({inch(b16.d1)}"). The difference is the inner width
        ({inch(a80.b1)}" on ANSI 80 vs {inch(b16.b1)}" on 16B): measure between the inner plates.
      </p>

      <h2>Simplex, duplex and triplex</h2>
      <p>
        The number after the dash is the strand count: 40-1 is simplex, 40-2 duplex and 40-3 triplex; in ISO, 08B-1, 08B-2 and 08B-3. The
        transverse pitch between strands also differs between standards ({inch(a.pt)}" on ANSI 40 vs {inch(b.pt)}" on 08B), so a European
        duplex sprocket won&apos;t fit an American duplex chain. The <Link href="/en/">sprocket calculator</Link> gives the total tooth
        width for each case.
      </p>
    </>
  );
}
