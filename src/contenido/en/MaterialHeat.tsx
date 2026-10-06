import Link from "next/link";

export function MaterialHeat() {
  return (
    <>
      <p className="entrada">
        In the shop where these tools were born, most sprockets and gears are made from <b>1045</b> or <b>4140</b> steel with
        hardened teeth. But that is not the only option. This guide sums up the most common materials and heat treatments and when each
        one makes sense.
      </p>

      <h2>The most common materials</h2>
      <div className="tabla-wrap">
        <table className="tabla tabla-texto">
          <thead><tr><th>Material</th><th>Used for</th><th>Usual treatment</th><th>Typical hardness</th></tr></thead>
          <tbody>
            <tr><td>1018 / 1020</td><td>Low-cost parts, light load, slow conveyors</td><td>None, or carburized</td><td>120–140 HB (untreated)</td></tr>
            <tr><td><b>1045</b></td><td>The workhorse: general-purpose sprockets and gears</td><td>Induction-hardened teeth</td><td>48–55 HRC on teeth</td></tr>
            <tr><td><b>4140</b></td><td>High loads, shock, pinions cut on the shaft</td><td>Quenched and tempered, optionally induction-hardened teeth, or nitrided</td><td>28–34 HRC Q&amp;T; 50–55 HRC with induction</td></tr>
            <tr><td>8620</td><td>Heavily loaded gears: hard case, tough core</td><td>Carburized and hardened</td><td>58–62 HRC case</td></tr>
            <tr><td>4340</td><td>Heavy duty with impact (mining, rolling mills)</td><td>Quenched and tempered</td><td>30–40 HRC</td></tr>
            <tr><td>Gray or ductile cast iron</td><td>Large, slow wheels and plate wheels</td><td>None (as cast)</td><td>180–250 HB</td></tr>
            <tr><td>Stainless 304 / 316</td><td>Food processing, wet and chemical environments</td><td>Not hardenable</td><td>~200 HB</td></tr>
            <tr><td>Plastics (nylon, UHMW, acetal)</td><td>Low noise, no lubrication, light loads</td><td>—</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Typical values. Actual hardness depends on the process, the part section and the heat-treat supplier.</p>

      <h2>Heat treatments, in plain words</h2>
      <h3>Induction hardening of the teeth</h3>
      <p>
        A coil heats only the tooth zone, which is quenched right away. You get a hard layer where the chain or mating gear works, while
        the rest of the part (hub, bore) stays soft. It is the most common choice for roller chain sprockets in 1045 and 4140: wear-resistant
        teeth and a hub you can still machine.
      </p>
      <h3>Quench and temper (through hardening)</h3>
      <p>
        The whole part is hardened and then tempered for toughness. It is not as hard as surface hardening, but it handles shock well across
        the whole section. 4140 is often bought already prehardened, which saves a step.
      </p>
      <h3>Carburizing and hardening</h3>
      <p>
        Carbon is added to the surface of a low-carbon steel (8620, 1018) before hardening. Result: a very hard case and a tough core. It is
        the treatment for heavily loaded reducer gears. It needs more control and tends to distort the part, so bores are ground afterwards.
      </p>
      <h3>Nitriding</h3>
      <p>Hardens a thin layer without heating to quench temperature, so distortion is minimal. Works well on prehardened 4140 when precision matters.</p>

      <h2>How to choose</h2>
      <ul>
        <li><b>General use, medium load:</b> 1045 with induction-hardened teeth.</li>
        <li><b>High load, shock, or a pinion cut on the shaft:</b> 4140 quenched and tempered, with induction on the teeth if wear is high.</li>
        <li><b>Reducers and heavily loaded gears:</b> 8620 carburized.</li>
        <li><b>Large, slow plate wheels:</b> cast iron, or plate cut to shape (see the <Link href="/en/">DXF for cutting</Link>).</li>
        <li><b>Food or corrosion:</b> stainless (not hardened) or engineering plastics.</li>
        <li><b>Golden rule:</b> in a pair, the small sprocket turns more times, so it should be <b>as hard or harder</b> than the large one.</li>
      </ul>

      <h2>Common mistakes we see in repairs</h2>
      <ol>
        <li><b>Through-hardening the whole part and then trying to cut the keyway.</b> Machine the bore and keyway first, or harden only the teeth.</li>
        <li><b>Using untreated steel in a loaded drive.</b> The teeth hook within weeks.</li>
        <li><b>Replacing only the chain or only the sprocket.</b> A stretched chain destroys a new sprocket, and a worn sprocket destroys a new chain.</li>
        <li><b>Hardening without tempering.</b> The part is brittle and can crack at the tooth root on the first shock.</li>
        <li><b>Ignoring heat-treat distortion.</b> On parts carburized or hardened after machining, leave stock to grind the bore.</li>
      </ol>

      <h2>From material to part</h2>
      <p>
        Once the material is chosen, the <Link href="/en/">sprocket calculator</Link> and the <Link href="/en/gears/">gear calculator</Link>{" "}
        give you the stock cut size and approximate weight, handy for ordering material and quoting heat treatment.
      </p>
    </>
  );
}
