import { useId } from 'react';

// Иллюстрации для ЛЭП (пока нет реальных фото)
const METAL = '#c9d4ce';
const GREEN = '#01d54e';

/* ---------- Решётчатая опора ЛЭП ---------- */
function towerLines() {
  const lines = [];
  // ноги: от основания (120/280, 560) к шейке (178/222, 150)
  const legL = (t) => [120 + (178 - 120) * t, 560 - (560 - 150) * t];
  const legR = (t) => [280 - (280 - 222) * t, 560 - (560 - 150) * t];
  const N = 9;
  for (let i = 0; i < N; i++) {
    const [x1, y1] = legL(i / N); const [x2, y2] = legR(i / N);
    const [x3, y3] = legL((i + 1) / N); const [x4, y4] = legR((i + 1) / N);
    lines.push([x1, y1, x4, y4], [x2, y2, x3, y3], [x1, y1, x2, y2]);
  }
  return lines;
}
const TOWER = towerLines();
// траверсы: [y, полуширина]
const ARMS = [[150, 150], [230, 120], [90, 70]];

export function TowerArt({ className = '' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`tower-art ${className}`} viewBox="0 0 400 580" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={METAL} stopOpacity=".95" /><stop offset="1" stopColor={METAL} stopOpacity=".25" />
        </linearGradient>
        <filter id={`${id}g`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g stroke={`url(#${id}m)`} strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M120 560 L178 150 L200 40 L222 150 L280 560" strokeWidth="3.4" />
        {TOWER.map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} strokeWidth="1.4" />)}
        {/* верхушка */}
        <path d="M178 150 L200 90 L222 150 M185 120 L215 120" strokeWidth="1.6" />
        {ARMS.map(([y, w]) => (
          <g key={y}>
            <path d={`M${200 - w} ${y} L${200 + w} ${y} M${200 - w} ${y} L${190} ${y + 26} M${200 + w} ${y} L${210} ${y + 26}`} strokeWidth="2" />
            <path d={`M${200 - w + 20} ${y} L${200 - w + 40} ${y + 14} L${200 - w + 60} ${y} M${200 + w - 20} ${y} L${200 + w - 40} ${y + 14} L${200 + w - 60} ${y}`} strokeWidth="1.2" />
          </g>
        ))}
      </g>
      {/* изоляторы и провода */}
      <g filter={`url(#${id}g)`}>
        {ARMS.flatMap(([y, w]) => [200 - w + 6, 200 + w - 6].map((x) => (
          <g key={`${x}-${y}`}>
            <line x1={x} y1={y} x2={x} y2={y + 22} stroke={GREEN} strokeWidth="3" strokeDasharray="3 2" />
            <path d={`M${x} ${y + 22} Q ${x < 200 ? x - 120 : x + 120} ${y + 70} ${x < 200 ? -40 : 440} ${y + 40}`} stroke={GREEN} strokeOpacity=".55" strokeWidth="1.3" fill="none" />
          </g>
        )))}
      </g>
    </svg>
  );
}

/* ---------- Иллюстрации продукции ---------- */
const s = { stroke: METAL, strokeWidth: 3, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
const a = { stroke: GREEN, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' };

const KINDS = {
  traverse: (
    <>
      <path d="M20 60h160M20 60l20 22h120l20-22M40 82l20-22 20 22 20-22 20 22 20-22 20 22" {...s} />
      <path d="M100 82v40" {...s} strokeWidth="5" />
      {[30, 100, 170].map((x) => <path key={x} d={`M${x} 60v-24`} {...a} strokeDasharray="4 3" />)}
    </>
  ),
  tower: (
    <>
      <path d="M70 130 90 30l10-16 10 16 20 100M90 30h20M60 40h80M70 62h60M76 130l44-30M124 130 80 100M83 96l34-26M117 96 87 70" {...s} strokeWidth="2.4" />
      {[60, 140, 70, 130].map((x, i) => <path key={i} d={`M${x} ${i < 2 ? 40 : 62}v14`} {...a} strokeDasharray="3 2" />)}
    </>
  ),
  bracket: (
    <>
      <path d="M60 10v125" {...s} strokeWidth="7" />
      <path d="M60 40h90l12 8M60 85l90-45" {...s} />
      <path d="M52 34h16M52 92h16" {...s} />
      <path d="M162 48v18" {...a} />
      <circle cx="162" cy="74" r="8" {...a} />
    </>
  ),
  head: (
    <>
      <path d="M100 135V55" {...s} strokeWidth="9" />
      <path d="M86 55h28l-6-20h-16zM40 70h120M40 70l60 22 60-22" {...s} />
      {[48, 152].map((x) => <path key={x} d={`M${x} 70v22`} {...a} strokeDasharray="4 3" />)}
    </>
  ),
  foundation: (
    <>
      <path d="M40 95h120v35H40z" {...s} />
      <path d="M40 95l20-20h80l20 20" {...s} />
      {[70, 90, 110, 130].map((x) => <path key={x} d={`M${x} 80V40`} {...a} />)}
      {[70, 90, 110, 130].map((x) => <path key={'n' + x} d={`M${x - 5} 48h10`} {...s} strokeWidth="2.4" />)}
    </>
  ),
  brace: (
    <>
      <path d="M70 10v125" {...s} strokeWidth="8" />
      <path d="M70 45l70 85M70 70l45 60" {...s} />
      <path d="M58 45h24M58 70h24M120 130h30" {...s} />
      <circle cx="70" cy="45" r="4" fill={GREEN} /><circle cx="70" cy="70" r="4" fill={GREEN} />
    </>
  ),
  custom: (
    <>
      <path d="M20 20h160v100H20z" stroke={METAL} strokeOpacity=".25" strokeWidth="1" fill="none" />
      {[40, 60, 80, 100, 120, 140, 160].map((x) => <path key={x} d={`M${x} 20v100`} stroke={METAL} strokeOpacity=".12" />)}
      {[40, 60, 80, 100].map((y) => <path key={y} d={`M20 ${y}h160`} stroke={METAL} strokeOpacity=".12" />)}
      <path d="M45 95h110M45 95l25-40h60l25 40M70 55v40M130 55v40M100 55v40" {...s} />
      <path d="M45 110h110M45 106v8M155 106v8" {...a} strokeWidth="2" />
    </>
  ),
};

export function ProductArt({ kind }) {
  return (
    <svg className="product-art" viewBox="0 0 200 145" aria-hidden="true">
      {KINDS[kind] || KINDS.custom}
    </svg>
  );
}
