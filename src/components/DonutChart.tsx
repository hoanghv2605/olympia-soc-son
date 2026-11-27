import { useChartTooltip } from "./ChartTooltip";
import { percent } from "../lib/format";
import type { RatioSegment } from "../lib/ratio";

const SIZE = 160;
const CENTER = SIZE / 2;
const OUTER = 78;
const INNER = 50;
/** Phần có số đếm > 0 rộng ít nhất ngần này độ để còn rê / chạm được. */
const MIN_ANGLE = 4;

/** Góc của từng phần (tổng 360): phần quá hẹp được nới tới MIN_ANGLE, các phần còn lại co lại theo tỉ lệ. */
function anglesOf(counts: number[]) {
  const small = new Set<number>();
  for (;;) {
    const rest = counts.reduce((sum, c, i) => (small.has(i) ? sum : sum + c), 0);
    const free = 360 - small.size * MIN_ANGLE;
    const angles = counts.map((c, i) => (small.has(i) ? MIN_ANGLE : (c / rest) * free));
    const next = angles.findIndex((a, i) => !small.has(i) && a < MIN_ANGLE);
    if (next < 0) return angles;
    small.add(next);
  }
}

/** Điểm trên đường tròn bán kính r; góc tính từ đỉnh, theo chiều kim đồng hồ. */
function point(r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return `${(CENTER + r * Math.cos(rad)).toFixed(2)} ${(CENTER + r * Math.sin(rad)).toFixed(2)}`;
}

function sectorPath(from: number, to: number) {
  // Trọn một vòng: một cung 360 độ không vẽ được, ghép từ hai nửa
  if (to - from > 359.99) {
    const ring = (r: number, sweep: 0 | 1) =>
      `M${point(r, 0)}A${r} ${r} 0 0 ${sweep} ${point(r, 180)}A${r} ${r} 0 0 ${sweep} ${point(r, 0)}Z`;
    return `${ring(OUTER, 1)}${ring(INNER, 0)}`;
  }
  const large = to - from > 180 ? 1 : 0;
  return `M${point(OUTER, from)}A${OUTER} ${OUTER} 0 ${large} 1 ${point(OUTER, to)}L${point(INNER, to)}A${INNER} ${INNER} 0 ${large} 0 ${point(INNER, from)}Z`;
}

/**
 * Biểu đồ vòng (SVG, không hiệu ứng). Chú thích bên dưới chỉ có ô màu và tên nhóm; số hiện trong hộp nổi.
 * `unit`: chữ đơn vị trong hộp ("thí sinh" / "người"). Nhóm bằng 0 không có cung nhưng vẫn có trong chú thích.
 */
export default function DonutChart({
  title,
  segments,
  value,
  caption,
  unit,
}: {
  title: string;
  segments: RatioSegment[];
  /** Số lớn giữa vòng */
  value: number;
  /** Chữ nhỏ dưới số lớn */
  caption: string;
  unit: string;
}) {
  const { bind, tooltip } = useChartTooltip();
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const drawn = segments.filter((s) => s.count > 0);
  const angles = anglesOf(drawn.map((s) => s.count));
  let start = 0;

  return (
    <div className="flex min-w-0 flex-col items-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label={`${title}: ${value} ${caption}`} className="mt-3 w-40 max-w-full md:w-44">
        {drawn.map((s, i) => {
          const from = start;
          start += angles[i];
          const share = percent(s.count, total);
          return (
            <path
              key={s.key}
              d={sectorPath(from, start)}
              role="img"
              aria-label={`${s.label}: ${s.count} ${unit}, ${share}%`}
              style={{ fill: s.color }}
              className="stroke-white stroke-2 focus-visible:stroke-ink"
              {...bind({ title: s.label, lines: [`${s.count} ${unit} · ${share}%`] })}
            />
          );
        })}
        <text aria-hidden x={CENTER} y={CENTER - 2} textAnchor="middle" fontSize={30} className="font-display fill-ink font-bold tabular-nums">
          {value}
        </text>
        <text aria-hidden x={CENTER} y={CENTER + 20} textAnchor="middle" fontSize={13} className="fill-ink-soft">
          {caption}
        </text>
      </svg>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm leading-snug">
        {segments.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ backgroundColor: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      {tooltip}
    </div>
  );
}
