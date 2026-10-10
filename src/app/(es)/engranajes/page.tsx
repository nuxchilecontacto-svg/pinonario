import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import { CalcEngranajes } from "@/components/CalcEngranajes";
import { DatosApp } from "@/components/DatosApp";

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Engranajes por Módulo: Medidas, Wk y DXF" },
  description:
    "Módulo y dientes: diámetros, altura del diente, medida Wk para controlar con pie de metro, distancia entre centros y DXF del perfil. ISO 53 o DP.",
  alternates: alternativas("/engranajes/", "/en/gears/", "es"),
  openGraph: {
    title: "Calculadora de Engranajes por Módulo: Medidas, Wk y DXF",
    description: "Engranajes rectos ISO 53: diámetros, Wk, espesor cordal, pareja y DXF para corte. Módulo o diametral pitch.",
    images: [{ url: "/img/taller-engranajes.jpg", width: 427, height: 760 }],
  },
};

export default function Engranajes() {
  return (
    <>
      <DatosApp nombre="Calculadora de engranajes rectos" descripcion={metadata.description as string} ruta="/engranajes/" l="es" />
      <div className="intro">
        <span className="ceja">Engranajes rectos</span>
        <h1>Calculadora de engranajes por módulo</h1>
        <p>Módulo (o diametral pitch) y número de dientes: todas las medidas para tallar y controlar el engranaje, la pareja y el DXF del perfil.</p>
      </div>
      <CalcEngranajes />

      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Cómo se calcula el diámetro exterior de un engranaje?</summary>
          <p>
            Con módulo m y Z dientes: diámetro primitivo d = m·Z y diámetro exterior da = m·(Z + 2). Por ejemplo, módulo 2 y 20 dientes:
            d = 40 mm y da = 44 mm. El diámetro de fondo es df = m·(Z − 2,5) = 35 mm.
          </p>
        </details>
        <details>
          <summary>¿Cómo saco el módulo de un engranaje que tengo en la mano?</summary>
          <p>
            Mide el diámetro exterior y cuenta los dientes: m ≈ da ÷ (Z + 2). Redondea al módulo normalizado más cercano (1; 1,25; 1,5;
            2; 2,5; 3…). Si da un valor raro, puede ser diametral pitch (americano): DP = 25,4 ÷ m.
          </p>
        </details>
        <details>
          <summary>¿Qué es la medida sobre k dientes (Wk)?</summary>
          <p>
            Es la forma práctica de controlar el espesor de los dientes con un pie de metro: se abarcan k dientes con las caras planas del
            instrumento. Para 20° y sin desplazamiento, k ≈ Z/9 + 0,5. La calculadora entrega k y el valor exacto de Wk.
          </p>
        </details>
        <details>
          <summary>¿Qué es el desplazamiento de perfil (x)?</summary>
          <p>
            Es correr la herramienta hacia afuera (x positivo) o adentro (x negativo) al tallar. Sirve para evitar el rebaje en piñones de
            pocos dientes (bajo 17 a 20°) o para ajustar la distancia entre centros. Cambia da, df, el espesor del diente y Wk.
          </p>
        </details>
      </section>
    </>
  );
}
