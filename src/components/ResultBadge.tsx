import { MEDAL_BADGE, type Medal } from "../lib/medal";

/**
 * Nhãn kết quả (cột "Kết quả" trong hồ sơ thí sinh): bo tròn, chữ đậm, nền + viền + chữ theo màu huy chương
 * (vàng / bạc / đồng). Không có huy chương (Hạng 4 trở xuống, kết quả khác) thì chỉ chữ đậm màu `ink`, không nhãn.
 * Chữ đã nói kết quả nên không cần thêm chữ sr-only.
 */
export default function ResultBadge({ medal, children }: { medal: Medal | null; children: React.ReactNode }) {
  if (!medal) return <span className="font-bold text-ink">{children}</span>;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-sm font-bold whitespace-nowrap ${MEDAL_BADGE[medal]}`}>
      {children}
    </span>
  );
}
