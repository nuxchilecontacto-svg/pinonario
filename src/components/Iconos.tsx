/** Íconos de trazo (24×24), heredan el color del texto. */
const P: Record<string, React.ReactNode> = {
  engranaje: (
    <>
      <path d="M12 2.5l1.3 2.3 2.6-.5.6 2.6 2.4 1.1-.9 2.5 1.6 2.1-2 1.7.3 2.6-2.6.4-1.2 2.4-2.4-1.1L9.4 21l-1.3-2.3-2.6.5-.6-2.6-2.4-1.1.9-2.5L1.8 11l2-1.7-.3-2.6 2.6-.4 1.2-2.4 2.4 1.1z" transform="translate(.6 .2)" />
      <circle cx="12.4" cy="12.2" r="3" />
    </>
  ),
  ajustes: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  diametro: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M5 19L19 5" />
    </>
  ),
  calibre: <path d="M4 3v18M4 5h14l2 2-2 2H8M8 9v6M4 13h4M12 9v3" />,
  ancho: <path d="M4 7v10M20 7v10M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3" />,
  diente: <path d="M4 20c2-1 3-7 5-12 1-3 5-3 6 0 2 5 3 11 5 12" />,
  cubo: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
    </>
  ),
  peso: (
    <>
      <circle cx="12" cy="6" r="2.2" />
      <path d="M7 9h10l3 11H4z" />
    </>
  ),
  capas: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  regla: <path d="M3 15l12-12 6 6-12 12zM7 11l2 2M10 8l2 2M13 5l2 2" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  impresora: (
    <>
      <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3" />
      <path d="M7 14h10v7H7z" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  enlace: <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />,
  copiar: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" />
    </>
  ),
  check: <path d="M5 12l5 5 9-10" />,
  escudo: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  lapiz: <path d="M4 20l4-1 11-11-3-3L5 16zM14 7l3 3" />,
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  luna: <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />,
  cadena: (
    <>
      <rect x="2" y="8" width="11" height="8" rx="4" />
      <rect x="11" y="8" width="11" height="8" rx="4" />
    </>
  ),
};

export type NombreIcono = keyof typeof P;

export function Icono({ n, size = 20, className }: { n: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {P[n]}
    </svg>
  );
}
