import type { Metadata } from "next";
import { CalcTransmision } from "@/components/CalcTransmision";

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Largo de Cadena: Eslabones y Distancia Exacta" },
  description:
    "¿Cuántos eslabones lleva tu cadena? Ingresa paso, dientes y distancia entre ejes: obtén el largo exacto, la distancia real, la relación y RPM, con revisión del diseño.",
  alternates: { canonical: "/transmision/" },
  openGraph: {
    title: "Calculadora de Largo de Cadena: Eslabones y Distancia Exacta",
    description: "Eslabones, distancia entre centros real, relación y RPM de una transmisión por cadena. ISO y ASA.",
    images: [{ url: "/img/taller-pinones-eje.jpg", width: 760, height: 570 }],
  },
};

export default function Transmision() {
  return (
    <>
      <div className="intro">
        <span className="ceja">Transmisión por cadena</span>
        <h1>Calculadora de largo de cadena</h1>
        <p>Con el paso, los dientes de cada piñón y la distancia entre ejes: cuántos eslabones comprar, dónde quedan los ejes y si el diseño está bien.</p>
      </div>
      <CalcTransmision />

      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Cómo se calcula el largo de una cadena?</summary>
          <p>
            En pasos (eslabones): L = 2C/p + (Z1+Z2)/2 + p·((Z2−Z1)/2π)²/C, donde C es la distancia entre centros, p el paso y Z1, Z2
            los dientes. El resultado se redondea hacia arriba a un número par, y con ese número se recalcula la distancia exacta entre ejes.
          </p>
        </details>
        <details>
          <summary>¿Por qué conviene un número par de eslabones?</summary>
          <p>
            La cadena alterna eslabones interiores y exteriores. Con un número par se cierra con un eslabón de unión normal; con un
            número impar hace falta un medio eslabón acodado, que es el punto más débil de la cadena.
          </p>
        </details>
        <details>
          <summary>¿Qué distancia entre centros es la ideal?</summary>
          <p>
            Entre 30 y 50 veces el paso. Más corta, la cadena se desgasta antes; más larga (sobre 80 pasos), conviene poner guía o
            tensor. Deje siempre un recorrido de ajuste de 1 a 2 pasos para compensar el estiramiento.
          </p>
        </details>
        <details>
          <summary>¿Cuántos dientes debe tener el piñón chico?</summary>
          <p>
            Para marcha suave, 17 o más. Con menos de 17 la cadena golpea y vibra (efecto poligonal), y bajo 9 el desgaste es muy
            rápido. La relación entre piñones no debería pasar de 7:1 en una sola etapa.
          </p>
        </details>
      </section>
    </>
  );
}
