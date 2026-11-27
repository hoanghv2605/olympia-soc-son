/** "2017-07-26" → "26/07/2017" */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Năm học dùng gạch dài: "2017-2018" → "2017–2018" (dữ liệu JSON giữ nguyên gạch ngang). */
export function formatSchoolYear(schoolYear: string) {
  return schoolYear.replace("-", "–");
}

export function yearOf(iso: string) {
  return iso.slice(0, 4);
}

/** Tách khẩu hiệu tại dấu phẩy đầu tiên (dấu phẩy ở lại vế đầu); không có phẩy thì 1 vế. */
export function splitSlogan(slogan: string): string[] {
  const i = slogan.indexOf(",");
  return i < 0 ? [slogan] : [slogan.slice(0, i + 1), slogan.slice(i + 1).trim()];
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

/**
 * Chữ nhãn kết quả khi đứng TRONG CÂU (dòng thời gian): "Giải Nhất" → "giải Nhất", "Giải Khuyến khích" → "giải Khuyến khích".
 * Danh hiệu (Quán quân, Á quân, Quý quân) giữ chữ hoa. Nhãn đứng riêng (ResultBadge, bảng, ⓘ) KHÔNG dùng hàm này.
 */
export function inSentence(label: string) {
  return label.replace(/^Giải /, "giải ");
}

/** Điểm kiểu tiếng Việt (dấu phẩy thập phân): 62.5 → "62,5". Dùng cho sự kiện dạng mùa thi (DOC). */
export function formatScoreVi(value: number | null | undefined) {
  return formatScore(value).replace(".", ",");
}

/** Số thập phân kiểu Việt Nam, 1 chữ số: 4.1 → "4,1". */
export function formatDecimalVi(value: number) {
  return value.toFixed(1).replace(".", ",");
}

/** Phần trăm làm tròn số nguyên (mẫu số 0 → 0). */
export function percent(part: number, whole: number) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

/** Chữ viết tắt: chữ cái đầu của 2 từ cuối trong họ tên. "Chu Đức Huy" → "ĐH". */
export function initials(fullName: string) {
  return fullName
    .normalize("NFC")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => [...w][0]?.toLocaleUpperCase("vi") ?? "")
    .join("");
}

const ORDINALS = ["", "hai", "ba", "tư", "năm", "sáu", "bảy", "tám", "chín", "mười"];

/** 1 → "đầu tiên", 2 → "thứ hai", 4 → "thứ tư", 10 → "thứ mười", 11 → "thứ 11". */
export function seasonOrdinal(n: number) {
  return n === 1 ? "đầu tiên" : `thứ ${ORDINALS[n - 1] ?? n}`;
}

/** Cuộn mượt tới phần tử theo id (không dùng href="#..." vì web dùng HashRouter). */
export function scrollToId(id: string) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/** Nối danh sách kiểu tiếng Việt: "A", "A và B", "A, B và C". */
export function joinViText(parts: string[]) {
  return parts.length <= 1 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} và ${parts[parts.length - 1]}`;
}

/**
 * Câu dòng thời gian dạng "{tên} {động từ} {phần nổi bật}" — MỌI loại dòng (cột mốc, sự kiện, vòng thi)
 * đều ghép qua đây để luôn có khoảng trắng giữa các phần (động từ có thể không có: "{tên} tham dự").
 */
export function sentenceParts(name: string | undefined, action: string | undefined, highlight: string) {
  return { name, lead: action ? ` ${action} ` : name ? " " : "", highlight };
}

/** Câu dạng chữ thuần (alt, chú thích ảnh). */
export function sentenceText(name: string | undefined, action: string | undefined, highlight: string) {
  const { name: n, lead, highlight: h } = sentenceParts(name, action, highlight);
  return `${n ?? ""}${lead}${h}`;
}
