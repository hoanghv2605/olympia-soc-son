// Quét public/ lấy danh sách ảnh có sẵn. Dùng chung cho gen-image-manifest.mjs (danh sách ảnh của web)
// và anh-con-thieu.mjs (liệt kê ảnh còn thiếu).
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const publicDir = join(root, "public");

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const IGNORED = new Set([".gitkeep", ".DS_Store"]);

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

/** Đường dẫn (tính từ public/, dấu "/") của mọi ảnh trong public/images/** và public/logo-oss*.(svg|png), đã sắp xếp. */
export function scanImages() {
  const files = [
    ...walk(join(publicDir, "images")),
    // logo ở gốc public/: logo-oss.svg, logo-oss.png, logo-oss-tam.svg
    ...readdirSync(publicDir)
      .filter((n) => /^logo-oss.*\.(svg|png)$/i.test(n))
      .map((n) => join(publicDir, n)),
  ];
  return files.map((f) => relative(publicDir, f).split(sep).join("/")).sort();
}
