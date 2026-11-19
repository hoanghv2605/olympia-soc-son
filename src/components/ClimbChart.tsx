import { useRef, useState } from "react";
import { CLIMB_STEPS, climbSeries, type ClimbLine } from "../lib/data";
import { prefersReducedMotion, useInViewOnce, useMediaQuery } from "../lib/hooks";
import type { Match, Placement } from "../types";

/** Màu / độ dày đường theo danh hiệu Chung kết. */
const LINE_STYLE: Record<Placement, { color: string; width: number }> = {
  "vo-dich": { color: "#B08600", width: 3 },
  "a-quan": { color: "#6B7280", width: 2 },
  "giai-ba": { color: "#A0612F", width: 2 },
};
const DEFAULT_STYLE = { color: "#6B7280", width: 2 };
const styleOf = (l: ClimbLine) => (l.placement ? LINE_STYLE[l.placement] : DEFAULT_STYLE);

const DRAW_MS = 900;
/** Khoảng cách tối thiểu giữa 2 nhãn cuối đường (đơn vị viewBox; khung không co dưới ~0,8 lần nên vẫn ≥ 16px) */
const LABEL_GAP = 21;

/** Nhãn trục ngang: nhãn dài xuống dòng, không viết tắt. */
const STEP_LINES: Record<string, string[]> = {
  "Vượt chướng ngại vật": ["Vượt chướng", "ngại vật"],
};

/** Bước lưới 50 hoặc 100, chọn sao cho có 4–6 vạch. */
function gridOf(min: number, max: number) {
  for (const step of [50, 100]) {
    const lo = Math.floor(min / step) * step;
    const hi = Math.max(step, Math.ceil(max / step) * step);
    const count = (hi - lo) / step + 1;
    if (count >= 4 && count <= 6) return { lo, hi, step };
  }
  const step = max - min > 300 ? 100 : 50;
  return { lo: Math.floor(min / step) * step, hi: Math.max(step, Math.ceil(max / step) * step), step };
}

/** Dời nhãn theo trục dọc cho cách nhau tối thiểu `gap`, rồi kéo cả cụm về trong [top, bottom]. */
export function dodgeLabels(ys: number[], gap: number, top: number, bottom: number) {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < order.length; k++) {
    if (order[k].y < order[k - 1].y + gap) order[k].y = order[k - 1].y + gap;
  }
  const overflow = order.length ? order[order.length - 1].y - bottom : 0;
  if (overflow > 0) order.forEach((o) => (o.y -= overflow));
  for (let k = order.length - 2; k >= 0; k--) {
    if (order[k].y > order[k + 1].y - gap) order[k].y = order[k + 1].y - gap;
  }
  if (order.length && order[0].y < top) {
    const shift = top - order[0].y;
    order.forEach((o) => (o.y += shift));
  }
  const out = [...ys];
  order.forEach((o) => (out[o.i] = o.y));
  return out;
}

/**
 * Biểu đồ "Diễn biến điểm số": điểm cộng dồn của 4 thí sinh trận Chung kết sau từng vòng thi.
 * Tự vẽ bằng SVG; đường tự vẽ ra khi cuộn tới (1 lần), tôn trọng giảm chuyển động.
 */
export default function ClimbChart({ match, compact = false }: { match: Match; compact?: boolean }) {
  const lines = climbSeries(match);
  const narrow = useMediaQuery("(max-width: 639px)");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(wrapRef, 0.3);
  const [reduced] = useState(prefersReducedMotion);
  const drawn = reduced || inView;
  const [active, setActive] = useState<string | null>(null);

  // Kích thước (đơn vị viewBox). Điện thoại dùng khung hẹp hơn để chữ không quá nhỏ, và không có nhãn cuối đường.
  // compact (trang chủ): không tiêu đề/mô tả, khung thấp hơn (~240px), vẫn giữ nhãn cuối đường trên máy tính.
  const W = narrow ? 400 : compact ? 600 : 760;
  const H = narrow ? (compact ? 260 : 300) : compact ? 260 : 340;
  const M = { top: 16, right: narrow ? 16 : compact ? 180 : 200, bottom: 48, left: 44 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const values = lines.flatMap((l) => l.points.filter((v): v is number => v !== null));
  const { lo, hi, step } = gridOf(Math.min(0, ...values), Math.max(0, ...values));
  const x = (i: number) => M.left + (plotW * i) / (CLIMB_STEPS.length - 1);
  const y = (v: number) => M.top + plotH - ((v - lo) / (hi - lo)) * plotH;
  const ticks = Array.from({ length: (hi - lo) / step + 1 }, (_, k) => lo + k * step);

  // Vẽ Quán quân sau cùng để nằm trên
  const drawOrder = [...lines].sort((a, b) => (a.placement === "vo-dich" ? 1 : 0) - (b.placement === "vo-dich" ? 1 : 0));

  const pathOf = (l: ClimbLine) => {
    let d = "";
    let pen = false;
    l.points.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };

  const lastValue = (l: ClimbLine) => [...l.points].reverse().find((v): v is number => v !== null) ?? 0;
  const labelYs = dodgeLabels(
    lines.map((l) => y(lastValue(l))),
    LABEL_GAP,
    M.top + 6,
    M.top + plotH,
  );

  const summary = [...lines]
    .sort((a, b) => (b.total ?? -Infinity) - (a.total ?? -Infinity))
    .map((l) => `${l.name} ${l.total ?? "không có dữ liệu"}`)
    .join(", ");
  const dim = (l: ClimbLine) => (active && active !== l.person ? 0.2 : 1);

  return (
    <div ref={wrapRef} className={compact ? "" : "mt-10"}>
      {!compact && (
        <>
          <h3 className="h3 text-ink">Diễn biến điểm số</h3>
          <p className="mt-1 text-sm text-ink-soft">Điểm cộng dồn của 4 thí sinh sau từng vòng thi.</p>
        </>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Biểu đồ điểm cộng dồn trận Chung kết mùa ${match.season}: ${summary}.`}
        className={`climb-chart w-full overflow-visible ${compact ? "max-h-[260px]" : "mt-4 max-w-3xl"}`}
        onMouseLeave={() => setActive(null)}
      >
        {/* Lưới ngang + nhãn trục dọc */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke="#1f1b2e" strokeOpacity={t === 0 ? 0.25 : 0.08} />
            <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={12} fill="#5a5670" className="tabular-nums">
              {t}
            </text>
          </g>
        ))}

        {/* Nhãn trục ngang */}
        {CLIMB_STEPS.map((s, i) => (
          <text
            key={s}
            x={x(i)}
            y={M.top + plotH + 20}
            fontSize={narrow ? 11 : 12}
            fill="#5a5670"
            textAnchor={i === 0 ? "start" : i === CLIMB_STEPS.length - 1 ? "end" : "middle"}
          >
            {(STEP_LINES[s] ?? [s]).map((part, k) => (
              <tspan key={k} x={x(i)} dy={k === 0 ? 0 : "1.2em"}>
                {part}
              </tspan>
            ))}
          </text>
        ))}

        {/* Các đường */}
        {drawOrder.map((l) => {
          const st = styleOf(l);
          const d = pathOf(l);
          return (
            <g key={l.person} style={{ opacity: dim(l), transition: "opacity 150ms" }}>
              <path
                d={d}
                fill="none"
                stroke={st.color}
                strokeWidth={active === l.person ? st.width + 1 : st.width}
                strokeLinejoin="round"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={drawn ? 0 : 1}
                className="climb-line"
                style={{ transitionDuration: `${DRAW_MS}ms` }}
              />
              {/* vùng bắt chuột rộng hơn nét vẽ */}
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                pointerEvents="stroke"
                onMouseEnter={() => setActive(l.person)}
              />
              {l.points.map((v, i) =>
                v === null ? null : (
                  <g key={i} className="climb-fade" style={{ opacity: drawn ? 1 : 0, transitionDelay: drawn && !reduced ? `${DRAW_MS}ms` : "0ms" }}>
                    <circle cx={x(i)} cy={y(v)} r={st.width + 1.5} fill="#fff" stroke={st.color} strokeWidth={st.width} />
                    {active === l.person && (
                      <text x={x(i)} y={y(v) - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={st.color} className="tabular-nums">
                        {v}
                      </text>
                    )}
                  </g>
                ),
              )}
            </g>
          );
        })}

        {/* Nhãn cuối đường (máy tính) */}
        {!narrow &&
          lines.map((l, i) => {
            const st = styleOf(l);
            return (
              <text
                key={l.person}
                x={x(CLIMB_STEPS.length - 1) + 12}
                y={labelYs[i]}
                dy="0.32em"
                fontSize={13}
                fill={st.color}
                className="climb-fade cursor-default"
                style={{
                  opacity: drawn ? dim(l) : 0,
                  transitionDelay: drawn && !reduced && !active ? `${DRAW_MS}ms` : "0ms",
                }}
                onMouseEnter={() => setActive(l.person)}
              >
                <tspan fontWeight={700}>{l.name}</tspan> <tspan className="tabular-nums">{l.total ?? "–"}</tspan>
              </text>
            );
          })}
      </svg>

      {/* Điện thoại: chú giải dưới biểu đồ thay cho nhãn cuối đường; chạm để làm nổi đường */}
      {narrow && (
        <ul className="mt-3 grid gap-1.5 text-sm">
          {[...lines]
            .sort((a, b) => (b.total ?? -Infinity) - (a.total ?? -Infinity))
            .map((l) => {
              const st = styleOf(l);
              const pressed = active === l.person;
              return (
                <li key={l.person}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => setActive(pressed ? null : l.person)}
                    className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-2 text-left ${pressed ? "bg-white/80" : ""}`}
                  >
                    <span aria-hidden className="h-[3px] w-6 shrink-0 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="flex-1 font-semibold text-ink">{l.name}</span>
                    <span className="font-bold tabular-nums" style={{ color: st.color }}>
                      {l.total ?? "–"}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
