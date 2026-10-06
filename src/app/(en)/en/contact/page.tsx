import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to us to report a mistake, suggest a tool or ask about ${SITIO.nombre}.`,
  alternates: alternativas("/contacto/", "/en/contact/", "en"),
};

export default function Contact() {
  return (
    <article className="guia">
      <span className="ceja">Contact</span>
      <h1>Contact</h1>
      <div className="guia-cuerpo">
        <p className="entrada">
          Email us at <a href={`mailto:${SITIO.correo}`}><b>{SITIO.correo}</b></a>. We read every message, in English or Spanish.
        </p>
        <h2>Especially helpful</h2>
        <ul>
          <li><b>Mistakes:</b> if a dimension doesn&apos;t match your catalog or a real part, tell us the chain or pitch, the tooth count and the value you expected.</li>
          <li><b>New tools:</b> if your shop keeps looking up a dimension that isn&apos;t here, it could be the next one.</li>
          <li><b>Cutting tests:</b> if you cut a sprocket or gear from one of our DXF files, we&apos;d love to hear how it turned out.</li>
        </ul>
        <p>{SITIO.nombre} is a project of Ingema, a machine shop in Chile. We usually reply within one or two business days.</p>
      </div>
    </article>
  );
}
