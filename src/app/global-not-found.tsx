import type { Metadata } from "next";
import { Esqueleto } from "@/components/Esqueleto";
import "./globals.css";

export const metadata: Metadata = {
  title: "Página no encontrada · Page not found",
  robots: { index: false },
};

/** 404 bilingüe (el sitio tiene dos raíces, español e inglés). */
export default function GlobalNotFound() {
  return (
    <Esqueleto l="es">
      <div className="pagina no-encontrada">
        <span className="ceja">404</span>
        <h1>Esta página no existe</h1>
        <p className="sub">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <p><a href="/">Ir a la calculadora de piñones →</a></p>
        <hr />
        <h2>Page not found</h2>
        <p className="sub">The link may be mistyped or the page may have moved.</p>
        <p><a href="/en/">Go to the sprocket calculator →</a></p>
      </div>
    </Esqueleto>
  );
}
