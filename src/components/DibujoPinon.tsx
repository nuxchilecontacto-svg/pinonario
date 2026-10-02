/**
 * Esquema a escala del piñón: contorno con los Z asientos de rodillo,
 * círculo primitivo (Dp) y rodillos de la cadena.
 */
export function DibujoPinon({ p, z, d1, dp, de, df }: { p: number; z: number; d1: number; dp: number; de: number; df: number }) {
  const R = dp / 2;
  const rho = 0.505 * d1; // radio de asiento
  const rExt = de / 2;
  const N = Math.max(720, z * 24);

  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const phi = (2 * Math.PI * i) / N;
    let r = rExt;
    // Asiento más cercano al ángulo phi
    const k = Math.round((phi * z) / (2 * Math.PI));
    for (const j of [k - 1, k, k + 1]) {
      const delta = phi - (2 * Math.PI * j) / z;
      const s = R * Math.sin(delta);
      if (Math.abs(s) <= rho) {
        const t = R * Math.cos(delta) - Math.sqrt(rho * rho - s * s);
        r = Math.min(r, t);
      }
    }
    pts.push(`${(r * Math.cos(phi)).toFixed(2)},${(r * Math.sin(phi)).toFixed(2)}`);
  }

  const m = rExt * 1.12;
  const mostrarRodillos = z <= 60;
  const trazo = rExt / 160;

  return (
    <svg viewBox={`${-m} ${-m} ${2 * m} ${2 * m}`} role="img" aria-label={`Esquema de piñón de ${z} dientes, paso ${p} mm`}>
      <polygon points={pts.join(" ")} className="d-cuerpo" strokeWidth={trazo} />
      <circle r={R} className="d-primitivo" strokeWidth={trazo} strokeDasharray={`${trazo * 6} ${trazo * 4}`} />
      <circle r={df / 2} className="d-fondo" strokeWidth={trazo * 0.7} strokeDasharray={`${trazo * 2} ${trazo * 3}`} />
      {mostrarRodillos &&
        Array.from({ length: z }, (_, i) => {
          const a = (2 * Math.PI * i) / z;
          return i < Math.ceil(z / 3) ? (
            <circle key={i} cx={R * Math.cos(a)} cy={R * Math.sin(a)} r={d1 / 2} className="d-rodillo" strokeWidth={trazo} />
          ) : null;
        })}
      <circle r={rExt * 0.06} className="d-centro" />
    </svg>
  );
}
