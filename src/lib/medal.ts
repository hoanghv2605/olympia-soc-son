import type { Placement } from "../types";

export type Medal = "gold" | "silver" | "bronze";

const BY_KEY: Record<string, Medal> = {
  "vo-dich": "gold",
  "Giải Nhất": "gold",
  "a-quan": "silver",
  "Giải Nhì": "silver",
  "giai-ba": "bronze",
  "Giải Ba": "bronze",
  "Quý quân": "bronze",
};

/**
 * Màu huy chương: hạng 1 / Quán quân / Giải Nhất → vàng;
 * hạng 2 / Á quân / Giải Nhì → bạc; hạng 3 / Quý quân / Giải Ba → đồng.
 */
export function medalOf(x: number | Placement | string | null | undefined): Medal | null {
  if (typeof x === "number") return x === 1 ? "gold" : x === 2 ? "silver" : x === 3 ? "bronze" : null;
  return x ? (BY_KEY[x] ?? null) : null;
}

/** Viên nhãn: nền nhạt, viền, chữ đậm. */
export const MEDAL_BADGE: Record<Medal, string> = {
  gold: "border-gold bg-gold-bg text-gold-ink",
  silver: "border-silver bg-silver-bg text-silver-ink",
  bronze: "border-bronze bg-bronze-bg text-bronze-ink",
};

/** Tô nền dòng bảng. */
export const MEDAL_ROW: Record<Medal, string> = {
  gold: "bg-gold-bg",
  silver: "bg-silver-bg",
  bronze: "bg-bronze-bg",
};

/** Chấm tròn màu huy chương. */
export const MEDAL_DOT: Record<Medal, string> = {
  gold: "bg-gold",
  silver: "bg-silver",
  bronze: "bg-bronze",
};
