// Các đoạn của thanh tỉ lệ (RatioBar): thứ tự, nhãn và màu cho từng tiêu chí. Màu khai báo ở `:root` trong index.css.
import { schoolLabel } from "./data";

export interface RatioSegment {
  key: string;
  label: string;
  count: number;
  color: string;
  /** Màu chữ ghi trong đoạn */
  ink: string;
}

export type RatioDimension = "grade" | "gender" | "school";

const DARK = "var(--color-ink)";
const LIGHT = "#fff";

/** Thứ tự đoạn trong mỗi tiêu chí = thứ tự khai báo ở đây. */
const GROUPS: Record<RatioDimension, { key: string; label?: string; color: string; ink: string }[]> = {
  grade: [
    { key: "9", label: "Lớp 9 (THCS)", color: "var(--ratio-lop-9)", ink: DARK },
    { key: "10", label: "Lớp 10", color: "var(--ratio-lop-10)", ink: DARK },
    { key: "11", label: "Lớp 11", color: "var(--ratio-lop-11)", ink: LIGHT },
    { key: "12", label: "Lớp 12", color: "var(--ratio-lop-12)", ink: LIGHT },
  ],
  gender: [
    { key: "nam", label: "Nam", color: "var(--ratio-nam)", ink: LIGHT },
    { key: "nu", label: "Nữ", color: "var(--ratio-nu)", ink: LIGHT },
  ],
  school: ["soc-son", "da-phuc", "minh-phu", "trung-gia", "xuan-giang", "kim-anh", "thcs"].map((id) => ({
    key: id,
    color: `var(--ratio-${id})`,
    ink: LIGHT,
  })),
};

const OTHER_COLOR = "var(--ratio-thcs)";

export function schoolColor(id: string) {
  return GROUPS.school.find((g) => g.key === id)?.color ?? OTHER_COLOR;
}

/**
 * Các đoạn của một thanh. `shown` quyết định nhóm nào xuất hiện (nhóm > 0 của số đăng kí),
 * nhờ vậy thanh "Top 12" giữ đúng các nhóm của thanh "Đăng kí", kể cả nhóm bằng 0.
 */
export function ratioSegments(
  dimension: RatioDimension,
  counts: Partial<Record<string, number>>,
  shown: Partial<Record<string, number>> = counts,
): RatioSegment[] {
  const known = GROUPS[dimension];
  // Mã mới chưa có trong bảng màu (vd thêm một trường ở otherSchools): xếp cuối, tô xám
  const extra = Object.keys(shown)
    .filter((key) => !known.some((g) => g.key === key))
    .map((key) => ({ key, label: undefined as string | undefined, color: OTHER_COLOR, ink: LIGHT }));
  return [...known, ...extra]
    .filter((g) => (shown[g.key] ?? 0) > 0)
    .map((g) => ({
      key: g.key,
      label: g.label ?? (dimension === "school" ? schoolLabel(g.key) : g.key),
      count: counts[g.key] ?? 0,
      color: g.color,
      ink: g.ink,
    }));
}
