import Link from "next/link";
import { cadenaPorId } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";

const f = (n: number, d = 2) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export function MedirPinon() {
  const b08 = cadenaPorId("08b")!;
  const a40 = cadenaPorId("asa40")!;
  const p20 = calcularPinon(b08, 20);
  const p21 = calcularPinon(b08, 21);
  const a20 = calcularPinon(a40, 20);

  return (
    <>
      <p className="entrada">
        Llega un piñón gastado, sin marca y sin plano, y hay que hacer uno igual. Con un pie de metro y cinco minutos se puede
        saber exactamente qué es. Esta es la secuencia que usamos en el taller.
      </p>

      <h2>1. Cuenta los dientes (Z)</h2>
      <p>
        Parece obvio, pero es el error más común. Marca un diente con tiza o plumón y cuenta hasta volver a él. En piñones grandes,
        cuenta dos veces. Anota también si el número es <b>par o impar</b>, porque cambia la forma de medir.
      </p>

      <h2>2. Averigua el paso</h2>
      <p>
        Si tienes la cadena, mide sobre varios eslabones: del borde izquierdo de un rodillo al borde izquierdo de otro, 10 rodillos
        más allá, y divide por 10. Así un error de 0,1 mm del instrumento se reduce a 0,01 mm por paso. Los pasos estándar son
        6,35 – 8 – 9,525 – 12,7 – 15,875 – 19,05 – 25,4 – 31,75 – 38,1 mm (1/4" a 1½").
      </p>
      <p>
        Si solo tienes el piñón, el paso se deduce del diámetro: con las medidas de los puntos 3 y 4, el{" "}
        <Link href="/identificar/?m=pinon">identificador de piñones</Link> te dice qué cadena calza.
      </p>

      <h2>3. Mide sobre las puntas</h2>
      <p>
        Con <b>Z par</b>, los dientes quedan enfrentados: mide de punta a punta. Con <b>Z impar</b>, frente a un diente hay un hueco,
        así que el pie de metro no mide el diámetro real sino uno un poco menor (multiplicado por el coseno de 90°/Z).
      </p>
      <p>
        Esta medida sirve para orientarse, pero <b>no es la más confiable</b>: las puntas se gastan y cada fabricante las tornea a un
        diámetro algo distinto dentro de la norma. Para un piñón 1/2" × 5/16" (08B) de 20 dientes, la norma ISO 606 permite un
        diámetro exterior entre {f(p20.deMin)} y {f(p20.deMax)} mm.
      </p>

      <h2>4. Mide de fondo a fondo: la medida que manda</h2>
      <p>
        El fondo del diente casi no se gasta y su medida está fijada por la norma: diámetro primitivo menos el diámetro del rodillo.
        Apoya las puntas exteriores del pie de metro en el fondo de dos huecos opuestos.
      </p>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr><th>Piñón</th><th>Dp</th><th>Fondo a fondo</th><th>Cómo se mide</th></tr></thead>
          <tbody>
            <tr><td className="izq">08B, Z20 (par)</td><td>{f(p20.dp)}</td><td>{f(p20.dCalibre)}</td><td className="izq">Huecos enfrentados: Df = Dp − rodillo</td></tr>
            <tr><td className="izq">08B, Z21 (impar)</td><td>{f(p21.dp)}</td><td>{f(p21.dCalibre)}</td><td className="izq">Al hueco más opuesto: Dp·cos(90°/Z) − rodillo</td></tr>
            <tr><td className="izq">ASA 40, Z20</td><td>{f(a20.dp)}</td><td>{f(a20.dCalibre)}</td><td className="izq">Mismo paso que 08B, rodillo menor</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Fíjate en las dos filas de Z20: el piñón europeo y el americano tienen el <b>mismo diámetro primitivo</b>, pero el fondo difiere
        en {f(a20.dCalibre - p20.dCalibre)} mm. Esa diferencia se nota perfectamente con un pie de metro, y es la forma más rápida de
        saber si el piñón es para cadena europea o americana. Lo explicamos en{" "}
        <Link href="/guias/08b-vs-asa-40/">08B vs ASA 40</Link>.
      </p>

      <h2>5. Mide el ancho del diente, el cubo y el agujero</h2>
      <ul>
        <li><b>Ancho del diente</b> en la base (no en la punta, que viene achaflanada). Para 08B simple es del orden de {f(p20.bf1, 1)} mm.</li>
        <li><b>Cubo:</b> diámetro y largo total. El diámetro del cubo tiene un máximo para que la cadena no lo roce.</li>
        <li><b>Agujero y chavetero:</b> diámetro del eje, ancho y profundidad del chavetero. Si hay prisionero, su rosca y posición.</li>
        <li><b>Doble o triple:</b> mide también la distancia entre las hileras de dientes (paso transversal).</li>
      </ul>

      <h2>6. Reconoce el desgaste</h2>
      <p>
        Un diente sano es simétrico. Un diente gastado tiene <b>forma de gancho</b>: el lado que trabaja se come y la punta se inclina
        hacia el sentido de giro. También aparecen brillos en el fondo y puntas con rebaba. Si el piñón está así, la cadena casi
        seguro está estirada: mídela (sobre 2 a 3 % de estiramiento hay que cambiarla) y <b>cambia ambos juntos</b>; una cadena
        nueva en un piñón gastado dura poco.
      </p>

      <h2>Con esas medidas, ya puedes fabricarlo</h2>
      <p>
        Con Z, paso y tipo de cadena, la <Link href="/">calculadora de piñones</Link> te entrega todas las medidas para tornear y
        controlar, el material de partida y el <b>archivo DXF</b> del perfil para corte. Y si dudas entre dos cadenas, el{" "}
        <Link href="/identificar/?m=pinon">identificador</Link> compara tus medidas con todas las normas.
      </p>
    </>
  );
}
