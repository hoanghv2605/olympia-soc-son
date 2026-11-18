import type { ReactNode } from "react";
import { MEDAL_BADGE, type Medal } from "../lib/medal";

/** Nhãn danh hiệu theo màu huy chương; không có huy chương thì dùng màu tím nhạt. */
export default function MedalBadge({ medal, children }: { medal: Medal | null; children: ReactNode }) {
  const tone = medal ? MEDAL_BADGE[medal] : "border-oss/25 bg-oss-soft text-oss";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${tone}`}>
      {children}
    </span>
  );
}
