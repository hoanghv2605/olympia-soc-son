import { useChartTooltip } from "./ChartTooltip";
import { percent } from "../lib/format";
import type { RatioSegment } from "../lib/ratio";

/**
 * Thanh 100% chia đoạn theo số lượt. Trong thanh không ghi số: rê chuột / chạm / Tab vào từng đoạn thì hiện hộp số.
 * Chú thích màu do nơi dùng đặt một lần cho cả nhóm thanh. `title` là tên chặng.
 */
export default function RatioBar({ title, segments }: { title: string; segments: RatioSegment[] }) {
  const { bind, tooltip } = useChartTooltip();
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  return (
    <div role="group" aria-label={title} className="flex h-7 min-w-0 gap-[2px]">
      {segments
        .filter((s) => s.count > 0)
        .map((s) => {
          const share = `${percent(s.count, total)}%`;
          return (
            <span
              key={s.key}
              role="img"
              aria-label={`${title}, ${s.label}: ${s.count} lượt, ${share}`}
              {...bind({ title: `${title} · ${s.label}`, lines: [`${s.count} lượt · ${share}`] })}
              className="min-w-[5px] basis-0 first:rounded-l-md last:rounded-r-md"
              style={{ flexGrow: s.count, backgroundColor: s.color }}
            />
          );
        })}
      {tooltip}
    </div>
  );
}
