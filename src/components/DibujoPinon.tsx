import { aPuntos, contornoPinon } from "@/lib/perfil";

type Props = { z: number; p: number; d1: number; dp: number; de: number; df: number; dCubo?: number; agujero?: number };

/** Vista frontal a escala con cotas de Dp, De y Df. */
export function DibujoPinon({ z, p, d1, dp, de, df, dCubo, agujero }: Props) {
  const R = dp / 2;
  const m = de / 2;
  const pts = contornoPinon(z, dp, de, d1, -Math.PI / 2);
  const fs = m * 0.15;
  const xDp = -m * 1.22;
  const xDe = m * 1.22;
  const yDf = m * 1.3;
  const vb = `${-m * 1.62} ${-m * 1.12} ${m * 3.24} ${m * 2.62}`;

  return (
    <svg viewBox={vb} className="dibujo-svg" role="img" aria-label={`Vista del piñón de ${z} dientes, paso ${p} mm, con cotas`}>
      <defs>
        <marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth={m * 0.09} markerHeight={m * 0.09} orient="auto-start-reverse">
          <path d="M0 1L10 5 0 9z" className="cota-flecha" />
        </marker>
      </defs>

      <polygon points={aPuntos(pts)} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      <circle r={R} className="d-primitivo" vectorEffect="non-scaling-stroke" />
      <circle r={df / 2} className="d-fondo" vectorEffect="non-scaling-stroke" />
      {dCubo ? <circle r={Math.min(dCubo, df) / 2} className="d-cubo" vectorEffect="non-scaling-stroke" /> : null}
      {agujero ? <circle r={agujero / 2} className="d-agujero" vectorEffect="non-scaling-stroke" /> : null}
      <path d={`M${-m * 0.08} 0H${m * 0.08}M0 ${-m * 0.08}V${m * 0.08}`} className="d-eje" vectorEffect="non-scaling-stroke" />

      {/* Cota Dp (izquierda) */}
      <g className="cota">
        <path d={`M${-R * 0.15} ${-R}H${xDp - m * 0.05}M${-R * 0.15} ${R}H${xDp - m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${xDp} ${-R}V${R}`} markerStart="url(#fl)" markerEnd="url(#fl)" vectorEffect="non-scaling-stroke" />
        <text x={xDp - fs * 0.6} y={0} fontSize={fs} textAnchor="end" dominantBaseline="middle">Dp</text>
      </g>
      {/* Cota De (derecha) */}
      <g className="cota">
        <path d={`M${m * 0.15} ${-m}H${xDe + m * 0.05}M${m * 0.15} ${m}H${xDe + m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${xDe} ${-m}V${m}`} markerStart="url(#fl)" markerEnd="url(#fl)" vectorEffect="non-scaling-stroke" />
        <text x={xDe + fs * 0.6} y={0} fontSize={fs} dominantBaseline="middle">De</text>
      </g>
      {/* Cota Df (abajo) */}
      <g className="cota">
        <path d={`M${-df / 2} ${m * 0.2}V${yDf + m * 0.05}M${df / 2} ${m * 0.2}V${yDf + m * 0.05}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        <path d={`M${-df / 2} ${yDf}H${df / 2}`} markerStart="url(#fl)" markerEnd="url(#fl)" vectorEffect="non-scaling-stroke" />
        <text x={0} y={yDf - fs * 0.45} fontSize={fs} textAnchor="middle">Df</text>
      </g>
    </svg>
  );
}

/** Esquema de la medida sobre rodillos (MR): dos rodillos en asientos opuestos. */
export function DibujoMedicion({ z, dp, de, d1 }: { z: number; dp: number; de: number; d1: number }) {
  const R = dp / 2;
  const m = de / 2;
  const pts = contornoPinon(z, dp, de, d1, 0);
  // Asiento en 0° y el más opuesto posible (180° si Z par)
  const j = Math.floor(z / 2);
  const a2 = (2 * Math.PI * j) / z;
  const r1 = { x: R, y: 0 };
  const r2 = { x: R * Math.cos(a2), y: R * Math.sin(a2) };
  const xIzq = Math.min(r1.x, r2.x) - d1 / 2;
  const xDer = Math.max(r1.x, r2.x) + d1 / 2;
  const yCota = -m * 1.18;
  const fs = m * 0.15;

  return (
    <svg viewBox={`${-m * 1.25} ${-m * 1.42} ${m * 2.5} ${m * 1.7}`} className="medicion-svg" role="img" aria-label="Esquema de medición sobre rodillos">
      <defs>
        <marker id="fl2" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth={m * 0.1} markerHeight={m * 0.1} orient="auto-start-reverse">
          <path d="M0 1L10 5 0 9z" className="cota-flecha" />
        </marker>
        <clipPath id="mitad"><rect x={-m * 2} y={-m * 2} width={m * 4} height={m * 2.28} /></clipPath>
      </defs>
      <g clipPath="url(#mitad)">
        <polygon points={aPuntos(pts)} className="d-cuerpo" vectorEffect="non-scaling-stroke" />
      </g>
      {[r1, r2].map((r, i) => (
        <g key={i}>
          <circle cx={r.x} cy={r.y} r={d1 / 2} className="d-rodillo-med" vectorEffect="non-scaling-stroke" />
          <circle cx={r.x} cy={r.y} r={d1 * 0.06} className="d-centro" />
          <path d={`M${r.x + (r.x > 0 ? d1 / 2 : -d1 / 2)} ${r.y - d1 * 0.2}V${yCota - m * 0.04}`} className="cota-ext" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
      <g className="cota">
        <path d={`M${xIzq} ${yCota}H${xDer}`} markerStart="url(#fl2)" markerEnd="url(#fl2)" vectorEffect="non-scaling-stroke" />
        <text x={0} y={yCota - fs * 0.45} fontSize={fs} textAnchor="middle">MR</text>
      </g>
    </svg>
  );
}
