import { Calculadora } from "@/components/Calculadora";

export default function Inicio() {
  return (
    <>
      <div className="intro">
        <h1>Calculadora de piñones para cadena</h1>
        <p>Elige la norma, el paso y el número de dientes (Z): obtienes todas las medidas para fabricar o verificar el piñón.</p>
      </div>
      <Calculadora />

      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <h3>¿Qué diferencia hay entre cadena ISO (europea) y ASA (americana)?</h3>
        <p>
          Para el mismo paso, el rodillo y el ancho interior cambian. Por ejemplo, en paso 1/2" la cadena europea 08B tiene
          rodillo de 8,51 mm y la americana ASA 40 de 7,92 mm. Por eso el diámetro de fondo y el ancho del diente no son
          iguales: un piñón hecho para una no siempre sirve para la otra.
        </p>
        <h3>¿Cómo se calcula el diámetro primitivo?</h3>
        <p>Dp = paso ÷ sen(180° ÷ Z). Es el círculo donde quedan los centros de los rodillos de la cadena.</p>
        <h3>¿Cómo mido un piñón con Z impar?</h3>
        <p>
          Con Z impar no hay dos dientes enfrentados, así que el pie de metro no mide el diámetro de fondo directamente. La
          calculadora entrega la “medida con pie de metro” corregida: Dp · cos(90° ÷ Z) − Ø rodillo.
        </p>
        <h3>¿Sirve para coronas sin cubo?</h3>
        <p>Sí: desmarca “Piñón con cubo” y la calculadora toma el espesor del dentado para el material y el peso.</p>
      </section>
    </>
  );
}
