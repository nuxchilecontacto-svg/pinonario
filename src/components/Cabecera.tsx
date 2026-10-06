"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { rutaEn, type Idioma } from "@/lib/idioma";
import { Icono } from "./Iconos";

const NAV: Record<Idioma, { href: string; txt: string }[]> = {
  es: [
    { href: "/", txt: "Calculadora" },
    { href: "/transmision/", txt: "Largo de cadena" },
    { href: "/identificar/", txt: "Identificar" },
    { href: "/engranajes/", txt: "Engranajes" },
    { href: "/cremalleras/", txt: "Cremalleras" },
    { href: "/tablas/", txt: "Tablas" },
    { href: "/guias/", txt: "Guías" },
  ],
  en: [
    { href: "/en/", txt: "Sprockets" },
    { href: "/en/chain-length/", txt: "Chain length" },
    { href: "/en/identify/", txt: "Identify" },
    { href: "/en/gears/", txt: "Gears" },
    { href: "/en/racks/", txt: "Racks" },
    { href: "/en/tables/", txt: "Tables" },
    { href: "/en/guides/", txt: "Guides" },
  ],
};

const TX = {
  es: { principal: "Principal", lema: "Herramientas para la transmisión de potencia", claro: "Cambiar a tema claro", oscuro: "Cambiar a tema oscuro", otro: "EN", otroTit: "English version" },
  en: { principal: "Main", lema: "Power transmission tools", claro: "Switch to light theme", oscuro: "Switch to dark theme", otro: "ES", otroTit: "Versión en español" },
};

export function Cabecera({ nombre, l }: { nombre: string; l: Idioma }) {
  const ruta = usePathname() || "/";
  const t = TX[l];
  const inicio = l === "en" ? "/en/" : "/";
  const activo = (href: string) => (href === inicio ? ruta === inicio || ruta === inicio.replace(/\/$/, "") : ruta.startsWith(href.replace(/\/$/, "")));
  const otra = rutaEn(ruta, l === "en" ? "es" : "en");

  return (
    <header className="top no-print">
      <div className="top-in">
        <Link href={inicio} className="marca">
          <Icono n="engranaje" size={30} className="marca-ico" />
          {nombre}
        </Link>
        <nav aria-label={t.principal}>
          {NAV[l].map((n) => (
            <Link key={n.href} href={n.href} className={activo(n.href) ? "activo" : ""} aria-current={activo(n.href) ? "page" : undefined}>
              {n.txt}
            </Link>
          ))}
        </nav>
        <span className="lema"><Icono n="cadena" size={16} /> {t.lema}</span>
        <a href={otra} className="btn-idioma" hrefLang={l === "en" ? "es" : "en"} title={t.otroTit} aria-label={t.otroTit}>{t.otro}</a>
        <BotonTema t={t} />
      </div>
    </header>
  );
}

function BotonTema({ t }: { t: (typeof TX)["es"] }) {
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
    <button className="btn-tema" onClick={cambiar} aria-label={tema === "dark" ? t.claro : t.oscuro}>
      <Icono n={tema === "dark" ? "sol" : "luna"} size={19} />
    </button>
  );
}
