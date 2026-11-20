// Danh sách ảnh có sẵn trong public/ (sinh tự động bởi scripts/gen-image-manifest.mjs).
// Mọi component ảnh chỉ gọi tải ảnh có trong danh sách; không có thì dùng ảnh giữ chỗ luôn.
import manifest from "../data/generated/images.json";
import focusJson from "../data/tieu-diem-anh.json";

const available = new Set((manifest as string[]).map((p) => p.replace(/^\//, "")));

/** Ảnh có trong public/ không (đường dẫn tính từ public/, vd "images/thi-sinh/le-tra-my.jpg"). */
export function hasImage(path: string | undefined | null): path is string {
  return !!path && available.has(path.replace(/^\//, ""));
}

/** Ảnh đầu tiên có thật trong danh sách ứng viên (vd .svg rồi .png), không có thì undefined. */
export function pickImage(candidates: string[]) {
  return candidates.find((c) => hasImage(c));
}

/** Mọi ảnh có thật có đường dẫn bắt đầu bằng `prefix` (vd "images/thu-vien/mua-10/"), sắp theo tên file kiểu tự nhiên (2.jpg trước 10.jpg). */
export function listImages(prefix: string) {
  const pre = prefix.replace(/^\//, "");
  return [...available]
    .filter((p) => p.startsWith(pre))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** Tiêu điểm riêng từng ảnh: { "thi-sinh/s8-ten-ss.jpg": "50% 10%" } (đường dẫn tính từ images/). */
const focusOverrides = focusJson as Record<string, string>;

export type ImageKind = "person" | "wide";

/**
 * `object-position` cho ảnh cắt bằng object-fit: cover. Ưu tiên: tuỳ chỉnh trong src/data/tieu-diem-anh.json →
 * ảnh người (thi-sinh, human-of-oss, nhan-xet) `50% 25%` → ảnh ngang / còn lại `50% 35%`.
 * `kind` ghi đè theo thư mục khi cần. Giá trị thứ hai nhỏ hơn = lấy phần cao hơn của ảnh.
 */
export function imageFocus(path: string | undefined | null, kind?: ImageKind): string {
  const key = (path ?? "").replace(/^\//, "").replace(/^images\//, "");
  if (focusOverrides[key]) return focusOverrides[key];
  const person = kind ? kind === "person" : /^(thi-sinh|human-of-oss|nhan-xet)\//.test(key);
  return person ? "50% 25%" : "50% 35%";
}
