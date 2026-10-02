import { aPuntos, contornoPinon } from "@/lib/perfil";

/**
 * Ilustración decorativa: piñón Z18 (paso 25,4) con cadena, generado con la
 * misma geometría de la calculadora. Escala 1 mm = 1,6 px.
 */
export function HeroIlustracion() {
  const p = 25.4, z = 18, d1 = 15.88;
  const dp = p / Math.sin(Math.PI / z);
  const de = dp + 0.6 * p;
  const k = 1.6;
  const R = (dp / 2) * k;
  const cx = 520, cy = 300;
  const pts = contornoPinon(z, dp, de, d1, -Math.PI / 2);

  // Rodillos de la cadena: tramo envuelto (arriba → derecha) + tramo recto hacia la izquierda
  const rod: { x: number; y: number }[] = [];
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / z;
    rod.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
  }
  const recto: { x: number; y: number }[] = [];
  for (let i = 1; i <= 7; i++) recto.push({ x: cx - i * p * k, y: cy - R });
  const cadena = [...recto.reverse(), ...rod];
  const rr = (d1 / 2) * k;

  return (
    <svg className="hero-ilu" viewBox="0 0 800 420" aria-hidden="true" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="h-brillo" cx="0.68" cy="0.5" r="0.55">
          <stop offset="0" stopColor="var(--acento)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--acento)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d737b" />
          <stop offset="0.45" stopColor="#3a3f46" />
          <stop offset="1" stopColor="#1c1f23" />
        </linearGradient>
        <linearGradient id="h-placa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a9098" />
          <stop offset="1" stopColor="#2c3036" />
        </linearGradient>
        <linearGradient id="h-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="h-mask"><rect width="800" height="420" fill="url(#h-fade)" /></mask>
      </defs>
      <rect width="800" height="420" fill="url(#h-brillo)" />
      <g mask="url(#h-mask)">
        <polygon points={aPuntos(pts, k, cx, cy)} fill="url(#h-metal)" stroke="var(--acento)" strokeOpacity="0.55" strokeWidth="1.4" />
        <circle cx={cx} cy={cy} r={R * 0.52} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={R * 0.42} fill="#2a2e34" stroke="#7b818a" strokeOpacity="0.5" />
        <circle cx={cx} cy={cy} r={R * 0.17} fill="#121417" stroke="#9aa0a8" strokeOpacity="0.5" />
        <rect x={cx - 7} y={cy - R * 0.17 - 8} width="14" height="12" fill="#121417" />
        {cadena.slice(1).map((b, i) => {
          const a = cadena[i];
          return (
            <line key={`pl${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i % 2 ? "url(#h-placa)" : "#4a4f57"}
              strokeWidth={rr * (i % 2 ? 2.3 : 2)} strokeLinecap="round" opacity="0.95" />
          );
        })}
        {cadena.map((c, i) => (
          <g key={`r${i}`}>
            <circle cx={c.x} cy={c.y} r={rr} fill="#25292e" stroke="#9aa0a8" strokeOpacity="0.7" />
            <circle cx={c.x} cy={c.y} r={rr * 0.4} fill="#7b818a" />
          </g>
        ))}
      </g>
    </svg>
  );
}
