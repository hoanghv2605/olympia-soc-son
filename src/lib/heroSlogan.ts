// Slogan ở ảnh lớn trang chủ: mỗi lần TẢI TRANG chọn ngẫu nhiên 1 câu trong site.heroSlogans.
import { site } from "./data";
import { splitSlogan } from "./format";

const STORAGE_KEY = "oss-hero-slogan";

/** Chỉ số ngẫu nhiên, khác câu của lần tải trước (nhớ trong sessionStorage; không dùng được thì chọn ngẫu nhiên). */
function pickIndex(n: number) {
  let previous = -1;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) previous = Number(saved);
  } catch {
    /* sessionStorage bị chặn */
  }
  const choices = [...Array(n).keys()].filter((i) => n === 1 || i !== previous);
  const index = choices[Math.floor(Math.random() * choices.length)];
  try {
    sessionStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    /* sessionStorage bị chặn */
  }
  return index;
}

let chosen: string[] | undefined;

/**
 * Các dòng của slogan (tách tại " / "). Chọn một lần rồi nhớ trong biến của module: vẽ lại hay chuyển trang rồi
 * quay lại vẫn là câu đó. Không có `heroSlogans` thì dùng `slogan`, tách tại dấu phẩy đầu tiên.
 */
export function heroSloganLines(): string[] {
  if (!chosen) {
    const list = (site.heroSlogans ?? []).filter((s) => s.trim());
    chosen = list.length ? list[pickIndex(list.length)].split(" / ") : splitSlogan(site.slogan);
  }
  return chosen;
}

/** Slogan dài (3 dòng trở lên, hoặc có dòng quá 30 ký tự) dùng cỡ chữ nhỏ hơn và được tự xuống dòng. */
export function isLongSlogan(lines: string[]) {
  return lines.length >= 3 || lines.some((line) => line.length > 30);
}
