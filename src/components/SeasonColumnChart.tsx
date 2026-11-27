import { Link } from "react-router";
import { useChartTooltip } from "./ChartTooltip";
import { matchPath } from "../lib/data";
import { formatDecimalVi } from "../lib/format";
import { ratioSegments } from "../lib/ratio";

/** Chiều cao của cột cao nhất (px). */
const COLUMN_HEIGHT = 220;

interface Row {
  season: number;
  total: number;
  nam: number;
  nu: number;
  slots: number;
}

/**
 * Cột chồng Nam (dưới) / Nữ (trên) theo mùa, số tổng trên đầu cột; không trục dọc, không đường lưới.
 * Thân cột chỉ mở hộp số; liên kết tới Vòng loại là nhãn mùa bên dưới. Dưới 480px nhãn chỉ ghi số mùa.
 */
export default function SeasonColumnChart({ rows, max }: { rows: Row[]; max: number }) {
  const { bind, tooltip } = useChartTooltip();
  const legend = ratioSegments("gender", {}, { nam: 1, nu: 1 });
  return (
    <div className="mt-6">
      <div className="flex items-end gap-1.5">
        <span aria-hidden className="flex h-8 shrink-0 items-center text-xs text-ink-soft min-[480px]:hidden">
          Mùa
        </span>
        <ol className="flex min-w-0 flex-1 items-end justify-between gap-1 sm:gap-3">
          {rows.map((r) => {
            const title = `Mùa ${r.season}: ${r.total} thí sinh`;
            const lines = [`Nam ${r.nam} · Nữ ${r.nu}`];
            const muted = r.slots ? `${formatDecimalVi(r.total / r.slots)} đơn cho một suất Bán kết` : undefined;
            return (
              <li key={r.season} className="flex max-w-16 min-w-0 flex-1 flex-col items-center">
                <div
                  role="img"
                  aria-label={[title, `Nam ${r.nam}, Nữ ${r.nu}`, muted].filter(Boolean).join(". ")}
                  className="flex w-full flex-col items-center"
                  {...bind({ title, lines, muted })}
                >
                  <span className="mb-1 text-xs font-semibold text-ink tabular-nums sm:text-sm">{r.total}</span>
                  <span className="flex w-full flex-col gap-[2px] overflow-hidden rounded-t-[5px]" style={{ height: (r.total / max) * COLUMN_HEIGHT }}>
                    {[...legend].reverse().map((g) => {
                      const count = g.key === "nu" ? r.nu : r.nam;
                      return count > 0 ? <span key={g.key} className="block basis-0" style={{ flexGrow: count, backgroundColor: g.color }} /> : null;
                    })}
                  </span>
                </div>
                <Link
                  to={matchPath(r.season)}
                  aria-label={`Mùa ${r.season}`}
                  className="flex h-8 w-full items-center justify-center text-xs font-semibold whitespace-nowrap text-oss hover:underline"
                >
                  <span className="hidden min-[480px]:inline">Mùa&nbsp;</span>
                  {r.season}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <ul aria-label="Chú thích" className="mt-2 flex justify-center gap-4 text-sm">
        {legend.map((g) => (
          <li key={g.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-3 rounded-[3px]" style={{ backgroundColor: g.color }} />
            {g.label}
          </li>
        ))}
      </ul>
      {tooltip}
    </div>
  );
}
