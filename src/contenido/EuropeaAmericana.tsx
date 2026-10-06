import Link from "next/link";
import { CADENAS, cadenaPorId } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";

const f = (n: number, d = 2) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export function EuropeaAmericana() {
  const b = cadenaPorId("08b")!;
  const a = cadenaPorId("asa40")!;
  const pb = calcularPinon(b, 20);
  const pa = calcularPinon(a, 20);
  // Pares con el mismo paso
  const pares = CADENAS.filter((c) => c.norma === "ISO")
    .map((iso) => [iso, CADENAS.find((x) => x.norma === "ASA" && x.p === iso.p)] as const)
    .filter(([, asa]) => asa);

  return (
    <>
      <p className="entrada">
        Las dos se piden como "cadena de 1/2 pulgada", las dos tienen exactamente el mismo paso (12,7 mm) y a simple vista son
        idénticas. Pero un piñón hecho para una no queda bien con la otra. Esto es lo que cambia.
      </p>

      <h2>Dos normas para el mismo paso</h2>
      <ul>
        <li><b>08B</b> es la cadena europea, norma <b>ISO 606 serie B</b> (antes DIN 8187). Es la más común en maquinaria de origen europeo.</li>
        <li><b>ASA 40</b> (o ANSI 40, o 08A en ISO) es la americana, norma <b>ANSI B29.1</b>. Viene en maquinaria norteamericana y asiática.</li>
      </ul>
      <p>El paso es el mismo, pero el rodillo y el ancho interior no:</p>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Medida</th><th>08B (europea)</th><th>ASA 40 (americana)</th><th>Diferencia</th></tr></thead>
          <tbody>
            <tr><td className="izq">Paso</td><td>{f(b.p)}</td><td>{f(a.p)}</td><td>0</td></tr>
            <tr><td className="izq">Diámetro del rodillo</td><td>{f(b.d1)}</td><td>{f(a.d1)}</td><td>{f(b.d1 - a.d1)}</td></tr>
            <tr><td className="izq">Ancho interior</td><td>{f(b.b1)}</td><td>{f(a.b1)}</td><td>{f(b.b1 - a.b1)}</td></tr>
            <tr><td className="izq">Piñón Z20: diámetro primitivo</td><td>{f(pb.dp)}</td><td>{f(pa.dp)}</td><td>0</td></tr>
            <tr><td className="izq">Piñón Z20: fondo a fondo</td><td>{f(pb.df)}</td><td>{f(pa.df)}</td><td>{f(pb.df - pa.df)}</td></tr>
            <tr><td className="izq">Piñón Z20: ancho del diente</td><td>{f(pb.bf1)}</td><td>{f(pa.bf1)}</td><td>{f(pb.bf1 - pa.bf1)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Medidas en mm, según ISO 606 y ANSI B29.1.</p>

      <h2>¿Se pueden mezclar?</h2>
      <p>
        Como el diámetro primitivo es el mismo, la cadena "entra" en el piñón de la otra norma, y por eso la confusión es tan común.
        Pero no trabaja bien:
      </p>
      <ul>
        <li>
          <b>Cadena 08B en piñón ASA 40:</b> el rodillo es {f(b.d1 - a.d1)} mm más grueso que el asiento para el que se hizo el diente.
          La cadena se apoya alto, en los flancos y no en el fondo, golpea y se desgasta rápido.
        </li>
        <li>
          <b>Cadena ASA 40 en piñón 08B:</b> el rodillo queda suelto en el asiento. Funciona a baja carga, pero con juego, ruido y
          desgaste acelerado.
        </li>
      </ul>
      <p>
        <b>La recomendación es no mezclarlas.</b> Para un arreglo provisorio puede servir, pero al reponer, el piñón debe ser de la misma
        norma que la cadena.
      </p>

      <h2>Cómo distinguirlas en un minuto</h2>
      <ol>
        <li><b>Mide el rodillo con pie de metro.</b> 8,5 mm es 08B; 7,9 mm es ASA 40. La diferencia de 0,6 mm se ve sin problema.</li>
        <li><b>Lee la marca.</b> Muchas cadenas traen grabado el código en las placas: "08B-1", "40", "RS40", "40-1".</li>
        <li><b>En el piñón, mide de fondo a fondo.</b> Con 20 dientes: {f(pb.df)} mm es 08B y {f(pa.df)} mm es ASA 40.</li>
      </ol>
      <p>
        El <Link href="/identificar/">identificador de cadenas y piñones</Link> hace esta comparación automáticamente con tus medidas.
      </p>

      <h2>Lo mismo pasa con todos los pasos</h2>
      <p>Para cada paso existe una versión europea y una americana:</p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Paso</th><th>Europea</th><th>Rodillo</th><th>Americana</th><th>Rodillo</th></tr></thead>
          <tbody>
            {pares.map(([iso, asa]) => (
              <tr key={iso.id}>
                <td className="izq">{iso.medida.split(" x ")[0]}</td>
                <td><Link href={`/tablas/${iso.id}/`}>{iso.codigo}</Link></td><td>{f(iso.d1)}</td>
                <td><Link href={`/tablas/${asa!.id}/`}>{asa!.codigo}</Link></td><td>{f(asa!.d1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Ojo con 1" (16B y ASA 80): <b>el rodillo es prácticamente igual</b> ({f(cadenaPorId("16b")!.d1)} mm). Ahí la diferencia está en el
        ancho interior ({f(cadenaPorId("16b")!.b1)} mm en 16B contra {f(cadenaPorId("asa80")!.b1)} mm en ASA 80): mide entre las placas
        interiores.
      </p>

      <h2>Simple, doble y triple</h2>
      <p>
        El número después del guion indica las hileras: 08B-1 es simple, 08B-2 doble y 08B-3 triple; en la americana, 40-1, 40-2 y 40-3.
        El paso transversal entre hileras también es distinto entre normas ({f(b.pt)} mm en 08B contra {f(a.pt)} mm en ASA 40), así que
        un piñón doble europeo no sirve para una cadena doble americana. La <Link href="/">calculadora de piñones</Link> entrega el ancho
        total del dentado para cada caso.
      </p>
    </>
  );
}
