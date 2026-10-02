import { Calculadora } from "@/components/Calculadora";
import { Icono } from "@/components/Iconos";

export default function Inicio() {
  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-foto" src="/img/pinon.jpg" alt="" width={760} height={570} fetchPriority="high" />
        <div className="hero-txt">
          <span className="ceja">Diseño y cálculo</span>
          <h1>Calculadora de piñones para cadena</h1>
          <p>Elige la norma, el paso y el número de dientes (Z): obtienes todas las medidas para fabricar o verificar el piñón.</p>
        </div>
        <ul className="hero-puntos">
          <li><Icono n="lapiz" size={26} /><div><b>Fórmulas de norma</b><span>ISO 606 / DIN 8187 y ANSI B29.1</span></div></li>
          <li><Icono n="regla" size={26} /><div><b>mm y pulgadas</b><span>Cadena simple, doble y triple</span></div></li>
          <li><Icono n="engranaje" size={26} /><div><b>Para el taller</b><span>Control, cubo y material de corte</span></div></li>
        </ul>
      </section>

      <Calculadora />

      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Qué diferencia hay entre cadena ISO (europea) y ASA (americana)?</summary>
          <p>
            Para el mismo paso, el rodillo y el ancho interior cambian. Por ejemplo, en paso 1/2" la cadena europea 08B tiene
            rodillo de 8,51 mm y la americana ASA 40 de 7,92 mm. Por eso el diámetro de fondo y el ancho del diente no son
            iguales: un piñón hecho para una no siempre sirve para la otra.
          </p>
        </details>
        <details>
          <summary>¿Cómo se calcula el diámetro primitivo?</summary>
          <p>Dp = paso ÷ sen(180° ÷ Z). Es el círculo donde quedan los centros de los rodillos de la cadena.</p>
        </details>
        <details>
          <summary>¿Cómo mido un piñón con Z impar?</summary>
          <p>
            Con Z impar no hay dos dientes enfrentados, así que el pie de metro no mide el diámetro de fondo directamente. La
            calculadora entrega la “medida con pie de metro” corregida: Dp · cos(90° ÷ Z) − Ø rodillo.
          </p>
        </details>
        <details>
          <summary>¿Sirve para coronas sin cubo?</summary>
          <p>Sí: desmarca “Piñón con cubo” y la calculadora toma el espesor del dentado para el material y el peso.</p>
        </details>
      </section>
    </>
  );
}
