import { percent } from "../lib/format";
import type { RatioSegment } from "../lib/ratio";

/** Đoạn rộng từ ngần này phần trăm mới ghi số trong thanh (hẹp hơn thì chỉ có ở chú thích). */
const MIN_INSIDE = 12;

/**
 * Thanh 100% chia đoạn theo số đếm, chú thích chữ luôn nằm ngay dưới (ghi đủ mọi nhóm: "Nam 43 · 80%").
 * `title` chỉ dùng cho trình đọc màn hình, vd "Giới tính, đăng kí".
 */
export default function RatioBar({ title, segments }: { title: string; segments: RatioSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const spoken = segments.map((s) => `${s.label} ${s.count} (${percent(s.count, total)}%)`).join(", ");
  return (
    <div className="min-w-0">
      <div role="img" aria-label={`${title}: ${spoken}.`} className="flex h-7 gap-[2px] overflow-hidden rounded-md bg-white">
        {segments
          .filter((s) => s.count > 0)
          .map((s) => (
            <span
              key={s.key}
              className="flex min-w-0 basis-0 items-center justify-center text-xs font-semibold tabular-nums"
              style={{ flexGrow: s.count, backgroundColor: s.color, color: s.ink }}
            >
              {(s.count / total) * 100 >= MIN_INSIDE ? s.count : null}
            </span>
          ))}
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm leading-snug">
        {segments.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ backgroundColor: s.color }} />
            <span className="tabular-nums">
              {s.label} {s.count} · {percent(s.count, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
