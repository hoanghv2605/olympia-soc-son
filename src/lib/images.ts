// Danh sách ảnh có sẵn trong public/ (sinh tự động bởi scripts/gen-image-manifest.mjs).
// Mọi component ảnh chỉ gọi tải ảnh có trong danh sách; không có thì dùng ảnh giữ chỗ luôn.
import manifest from "../data/generated/images.json";

const available = new Set((manifest as string[]).map((p) => p.replace(/^\//, "")));

/** Ảnh có trong public/ không (đường dẫn tính từ public/, vd "images/thi-sinh/le-tra-my.jpg"). */
export function hasImage(path: string | undefined | null): path is string {
  return !!path && available.has(path.replace(/^\//, ""));
}

/** Ảnh đầu tiên có thật trong danh sách ứng viên (vd .svg rồi .png), không có thì undefined. */
export function pickImage(candidates: string[]) {
  return candidates.find((c) => hasImage(c));
}
