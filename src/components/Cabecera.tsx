"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icono } from "./Iconos";

const NAV = [
  { href: "/", txt: "Calculadora" },
  { href: "/transmision/", txt: "Largo de cadena" },
  { href: "/identificar/", txt: "Identificar" },
  { href: "/engranajes/", txt: "Engranajes" },
  { href: "/cremalleras/", txt: "Cremalleras" },
  { href: "/tablas/", txt: "Tablas" },
  { href: "/guias/", txt: "Guías" },
];

export function Cabecera({ nombre }: { nombre: string }) {
  const ruta = usePathname();
  const activo = (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href.replace(/\/$/, "")));

  return (
    <header className="top no-print">
      <div className="top-in">
        <Link href="/" className="marca">
          <Icono n="engranaje" size={30} className="marca-ico" />
          {nombre}
        </Link>
        <nav aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={activo(n.href) ? "activo" : ""} aria-current={activo(n.href) ? "page" : undefined}>
              {n.txt}
            </Link>
          ))}
        </nav>
        <span className="lema"><Icono n="cadena" size={16} /> Herramientas para la transmisión de potencia</span>
        <BotonTema />
      </div>
    </header>
  );
}

function BotonTema() {
  const [tema, setTema] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTema(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const cambiar = () => {
    const nuevo = tema === "dark" ? "light" : "dark";
    setTema(nuevo);
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {}
  };
  return (
    <button className="btn-tema" onClick={cambiar} aria-label={tema === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}>
      <Icono n={tema === "dark" ? "sol" : "luna"} size={19} />
    </button>
  );
}
