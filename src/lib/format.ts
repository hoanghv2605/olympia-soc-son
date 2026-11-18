/** "2017-07-26" → "26/07/2017" */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function yearOf(iso: string) {
  return iso.slice(0, 4);
}

/** Bỏ dấu tiếng Việt để tìm kiếm: "Nghiêm Trung Đức" → "nghiem trung duc" */
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/** Đường dẫn tới file trong thư mục public, đúng cả khi chạy local lẫn trên GitHub Pages. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

/** Nền dự phòng khi ảnh chưa có (màu lấy từ logo OSS). */
export const CUBE_GRADIENT = "linear-gradient(160deg, #3d7bf2 0%, #7c4ddb 48%, #e0457b 100%)";
export const HERO_GRADIENT =
  "radial-gradient(circle at 75% 20%, rgba(224,69,123,.45), transparent 55%), linear-gradient(135deg, #2b1f63 0%, #5b2bc4 55%, #8a3a9e 100%)";

export function bgWithFallback(path: string | undefined, fallback: string) {
  return path ? `url("${asset(path)}"), ${fallback}` : fallback;
}

/** Điểm số: null = không có dữ liệu → "–" (KHÔNG đổi thành 0). */
export function formatScore(value: number | null | undefined) {
  return value === null || value === undefined ? "–" : String(value);
}
