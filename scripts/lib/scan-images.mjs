// Quét public/ lấy danh sách ảnh có sẵn. Dùng chung cho gen-image-manifest.mjs (danh sách ảnh của web)
// và anh-con-thieu.mjs (liệt kê ảnh còn thiếu).
import { closeSync, openSync, readSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const publicDir = join(root, "public");

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const IGNORED = new Set([".gitkeep", ".DS_Store"]);

/** Ảnh mẫu giữ chỗ: có chuỗi này trong 4KB đầu của file → coi như CHƯA có ảnh. */
export const SAMPLE_MARKER = "OSS-ANH-MAU";

export function isSampleImage(file) {
  const buf = Buffer.alloc(4096);
  const fd = openSync(file, "r");
  try {
    const n = readSync(fd, buf, 0, buf.length, 0);
    return buf.subarray(0, n).includes(SAMPLE_MARKER);
  } finally {
    closeSync(fd);
  }
}

function walk(dir) {
  let out = [];
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (IGNORED.has(name) || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else if (IMAGE_EXT.test(name)) out.push(full);
  }
  return out;
}

/** Đường dẫn (tính từ public/, dấu "/") của mọi ảnh trong public/images/** và public/logo-oss*.(svg|png), đã sắp xếp. Bỏ qua ảnh mẫu giữ chỗ (có SAMPLE_MARKER trong 4KB đầu). */
export function scanImages() {
  const files = [
    ...walk(join(publicDir, "images")),
    // logo ở gốc public/: logo-oss.svg, logo-oss.png, logo-oss-tam.svg
    ...readdirSync(publicDir)
      .filter((n) => /^logo-oss.*\.(svg|png)$/i.test(n))
      .map((n) => join(publicDir, n)),
  ];
  return files
    .filter((f) => !isSampleImage(f))
    .map((f) => relative(publicDir, f).split(sep).join("/"))
    .sort();
}
