import Link from "next/link";
import { calcularTransmision } from "@/lib/transmision";

const f = (n: number, d = 1) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Variación de velocidad de la cadena por efecto poligonal: 1 − cos(180°/Z). */
const poligonal = (z: number) => (1 - Math.cos(Math.PI / z)) * 100;

export function ElegirDientes() {
  const filas = [9, 11, 13, 15, 17, 19, 21, 25, 30];
  // Ejemplo: motor 1450 rpm → máquina a ~400 rpm, cadena 08B, ~500 mm entre ejes
  const opciones = [15, 17, 19, 21].map((z1) => {
    const z2 = Math.round((z1 * 1450) / 400);
    const t = calcularTransmision({ p: 12.7, z1, z2, c: 500, rpm1: 1450 });
    return { z1, z2, t };
  });

  return (
    <>
      <p className="entrada">
        "¿Cuántos dientes le pongo al piñón chico?" La respuesta corta es 17 o más. La respuesta útil explica por qué, cuándo se puede
        bajar y qué pasa con el piñón grande.
      </p>

      <h2>El efecto poligonal: por qué los piñones chicos golpean</h2>
      <p>
        La cadena no envuelve un círculo sino un polígono: cada eslabón es un lado recto. Al girar, la cadena sube y baja y su
        velocidad varía en cada diente. Mientras menos dientes, más grande la variación, y eso se traduce en vibración, ruido, golpe de
        los rodillos contra el diente y desgaste.
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Dientes del piñón</th>{filas.map((z) => <th key={z}>{z}</th>)}</tr></thead>
          <tbody>
            <tr><td className="izq">Variación de velocidad</td>{filas.map((z) => <td key={z}>{f(poligonal(z))} %</td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Variación = 1 − cos(180°/Z).</p>
      <p>
        Bajo 17 dientes la variación crece rápido; sobre 21 casi no se nota. De ahí las recomendaciones habituales:
      </p>
      <ul>
        <li><b>17 dientes o más</b> para uso general.</li>
        <li><b>21 a 25 dientes</b> para velocidades altas o cargas con golpes.</li>
        <li><b>9 a 13 dientes</b> solo a baja velocidad y baja carga (transportadores lentos, accionamientos manuales).</li>
      </ul>

      <h2>El piñón grande también tiene límite</h2>
      <p>
        Con el uso la cadena se estira, y el rodillo sube en el diente. Mientras más dientes tiene el piñón, menos estiramiento tolera
        antes de que la cadena salte. Como regla práctica, el estiramiento admisible es del orden de 200 ÷ Z por ciento: un piñón de 50
        dientes tolera cerca de 4 %, uno de 120 apenas 1,7 %. Por eso conviene <b>no pasar de 120 dientes</b> y evitar relaciones grandes
        en una sola etapa.
      </p>

      <h2>Relación máxima: 7 a 1</h2>
      <p>
        Con más de 7:1, el piñón chico queda abrazado en un ángulo pequeño (pocos dientes engranados) y el grande se vuelve enorme. Si
        necesitas más reducción, hazla en dos etapas. Lo ideal es quedarse bajo 6:1 y con un ángulo de contacto en el piñón chico de al
        menos 120°.
      </p>

      <h2>Dientes impares y eslabones pares</h2>
      <p>
        La cadena casi siempre tiene un número par de eslabones (para cerrarla con un eslabón de unión normal). Si además el piñón tiene
        un número <b>impar</b> de dientes, cada diente se encuentra con un eslabón distinto en cada vuelta y el desgaste se reparte
        parejo. Por eso es común ver piñones de 17, 19, 21 o 23 dientes.
      </p>

      <h2>Ejemplo completo</h2>
      <p>
        Un motor de 1.450 rpm debe mover una máquina a unas 400 rpm, con cadena 08B y unos 500 mm entre ejes. La relación necesaria
        es 1.450 ÷ 400 = 3,6. Estas son las opciones:
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Z1</th><th>Z2</th><th>RPM salida</th><th>Eslabones</th><th>Velocidad cadena</th><th>Comentario</th></tr></thead>
          <tbody>
            {opciones.map(({ z1, z2, t }) => (
              <tr key={z1}>
                <td>{z1}</td><td>{z2}</td><td>{f(t.rpm2!, 0)}</td><td>{t.eslabones}</td><td>{f(t.velocidad!, 1)} m/s</td>
                <td className="izq">{z1 < 17 ? "Funciona, pero con más vibración" : z1 === 17 ? "Mínimo recomendado" : "Más suave; piñón grande más voluminoso"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        La opción de 17 o 19 dientes en el piñón chico es la más equilibrada. Para ver la distancia exacta entre ejes y el resto de los
        datos de cada opción, usa la <Link href="/transmision/?c=08b&z1=19&z2=69&d=500&n=1450">calculadora de largo de cadena</Link>.
      </p>

      <h2>Resumen</h2>
      <ul>
        <li>Piñón chico: 17 o más; 21 a 25 si hay velocidad o golpes.</li>
        <li>Piñón grande: hasta unos 120 dientes.</li>
        <li>Relación: hasta 7:1 por etapa, idealmente bajo 6:1.</li>
        <li>Preferir dientes impares con un número par de eslabones.</li>
        <li>Distancia entre ejes: 30 a 50 pasos.</li>
      </ul>
      <p>
        Cuando tengas los dientes definidos, la <Link href="/">calculadora de piñones</Link> te da todas las medidas para fabricarlos.
      </p>
    </>
  );
}
