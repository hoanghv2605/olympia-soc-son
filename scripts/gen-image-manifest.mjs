// Sinh danh sách ảnh có sẵn trong public/ → src/data/generated/images.json
// Web chỉ gọi tải ảnh có trong danh sách này (không còn lỗi 404 khi chưa có ảnh).
// Tự chạy trước `npm run dev`, `npm run build`, `npm run typecheck` (predev / prebuild / pretypecheck).
// Thêm ảnh mới vào public/images/... thì chạy lại `npm run dev` để danh sách cập nhật.
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const outFile = join(root, "src", "data", "generated", "images.json");

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

const files = [
  ...walk(join(publicDir, "images")),
  // logo ở gốc public/: logo-oss.svg, logo-oss.png, logo-oss-tam.svg
  ...readdirSync(publicDir)
    .filter((n) => /^logo-oss.*\.(svg|png)$/i.test(n))
    .map((n) => join(publicDir, n)),
];

const list = files.map((f) => relative(publicDir, f).split(sep).join("/")).sort();

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(list, null, 2) + "\n");
console.log(`[images] ${list.length} ảnh có sẵn → src/data/generated/images.json`);
