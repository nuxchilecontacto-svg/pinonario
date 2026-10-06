import type { Metadata } from "next";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escríbenos para reportar un error, sugerir una herramienta o consultar sobre ${SITIO.nombre}.`,
  alternates: { canonical: "/contacto/" },
};

export default function Contacto() {
  return (
    <article className="guia">
      <span className="ceja">Contacto</span>
      <h1>Contacto</h1>
      <div className="guia-cuerpo">
        <p className="entrada">
          Escríbenos a <a href={`mailto:${SITIO.correo}`}><b>{SITIO.correo}</b></a>. Leemos todos los mensajes.
        </p>
        <h2>Nos sirve especialmente</h2>
        <ul>
          <li><b>Errores:</b> si una medida no calza con tu catálogo o con una pieza real, cuéntanos la cadena o el módulo, el número de dientes y qué valor esperabas.</li>
          <li><b>Herramientas nuevas:</b> si en tu taller buscas a menudo una medida que aquí no está, puede ser la próxima.</li>
          <li><b>Pruebas de corte:</b> si cortaste un piñón o engranaje con nuestros DXF, nos encantaría saber cómo resultó.</li>
        </ul>
        <p>
          {SITIO.nombre} es un proyecto de la maestranza Ingema, en Chile. Respondemos normalmente en uno o dos días hábiles.
        </p>
      </div>
    </article>
  );
}
