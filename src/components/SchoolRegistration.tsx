import { Link } from "react-router";
import { useChartTooltip, type TooltipContent } from "./ChartTooltip";
import { matchPath, schoolRegistration, SCHOOL_STAGES, type SchoolStageCounts } from "../lib/data";
import { formatDecimalVi, percent } from "../lib/format";
import type { School } from "../types";

/** Màu 5 chặng: 2 token riêng + màu viền của nhãn kết quả (đồng, bạc, vàng). */
const STAGE_COLOR: Record<keyof SchoolStageCounts, string> = {
  "vong-loai": "var(--stage-vong-loai)",
  "ban-ket": "var(--stage-ban-ket)",
  "quy-quan": "var(--color-bronze)",
  "a-quan": "var(--color-silver)",
  "quan-quan": "var(--color-gold)",
};

/** Bề rộng tối thiểu của một phần và khe giữa các phần (px). */
const MIN_PART = 5;
const PART_GAP = 2;

interface BarData {
  stages: SchoolStageCounts;
  registered: number;
  top12: number;
}

/** Một thanh chia 5 chặng, trong thanh không ghi số. `head`: "10 mùa" / "Mùa n"; `width`: phần trăm bề ngang. */
function StageBar({
  head,
  data,
  width,
  bind,
}: {
  head: string;
  data: BarData;
  width: number;
  bind: (content: TooltipContent) => object;
}) {
  const parts = SCHOOL_STAGES.filter((s) => data.stages[s.id] > 0);
  return (
    <div className="flex h-5" style={{ width: `${width}%`, gap: PART_GAP, minWidth: parts.length * (MIN_PART + PART_GAP) }}>
      {parts.map((s) => {
        const count = data.stages[s.id];
        const title = `${head} · ${s.label}`;
        const lines = [
          `${count} lượt · ${percent(count, data.registered)}%`,
          ...(s.id === "ban-ket" ? [`Tổng vào top 12: ${data.top12} lượt`] : []),
        ];
        const muted = `${data.registered} lượt đăng kí`;
        return (
          <span
            key={s.id}
            role="img"
            aria-label={`${title}: ${[...lines, muted].join(", ").replace(/ · /g, ", ")}`}
            className="block basis-0 first:rounded-l-[4px] last:rounded-r-[4px]"
            style={{ flexGrow: count, minWidth: MIN_PART, backgroundColor: STAGE_COLOR[s.id] }}
            {...bind({ title, lines, muted })}
          />
        );
      })}
    </div>
  );
}

const ROW = "grid items-center gap-x-3 gap-y-1 sm:grid-cols-[4.5rem_minmax(0,1fr)]";

/** Mục "Đăng kí dự thi" ở trang trường: câu tóm tắt, thanh tổng và từng mùa chia theo chặng xa nhất mỗi lượt đi được. */
export default function SchoolRegistration({ school }: { school: School }) {
  const { rows, total, max } = schoolRegistration(school.id);
  const { bind, tooltip } = useChartTooltip();
  if (!rows.length) return null;
  return (
    <section className="mt-12">
      <h2 className="h2 text-ink">Đăng kí dự thi</h2>
      <p className="mt-2 max-w-[70ch] text-ink-soft">
        Qua {rows.length} mùa, {school.name} có {total.registered} lượt đăng kí dự thi và{" "}
        {total.top12 > 0
          ? `${total.top12} lượt vào top 12: cứ khoảng ${formatDecimalVi(total.registered / total.top12)} lượt đăng kí thì có 1 lượt vào top 12.`
          : "chưa có lượt nào vào top 12."}
      </p>

      {total.registered > 0 && (
        <div className={`${ROW} mt-5 border-b border-oss/15 pb-4`}>
          <p className="text-sm font-bold text-ink">Tổng</p>
          <StageBar head={`${rows.length} mùa`} data={total} width={100} bind={bind} />
        </div>
      )}

      <ul className="mt-3 space-y-3 sm:space-y-2">
        {rows.map((r) => (
          <li key={r.season} className={ROW}>
            <Link to={matchPath(r.season)} className="justify-self-start text-sm font-semibold whitespace-nowrap text-oss hover:underline">
              Mùa {r.season}
            </Link>
            {r.registered > 0 ? (
              <StageBar head={`Mùa ${r.season}`} data={r} width={(r.registered / max) * 100} bind={bind} />
            ) : (
              <p className="text-sm leading-5 text-ink-soft">Không có đơn đăng kí</p>
            )}
          </li>
        ))}
      </ul>

      <ul aria-label="Chú thích" className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {SCHOOL_STAGES.map((s) => (
          <li key={s.id} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ backgroundColor: STAGE_COLOR[s.id] }} />
            {s.label}
          </li>
        ))}
      </ul>
      {tooltip}
    </section>
  );
}
