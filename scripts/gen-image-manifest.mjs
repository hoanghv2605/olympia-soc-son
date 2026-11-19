// Sinh danh sách ảnh có sẵn trong public/ → src/data/generated/images.json
// Web chỉ gọi tải ảnh có trong danh sách này (không còn lỗi 404 khi chưa có ảnh).
// Ảnh mẫu (có chuỗi OSS-ANH-MAU trong 4KB đầu) coi như chưa có ảnh, không đưa vào danh sách.
// Tự chạy trước `npm run dev`, `npm run build`, `npm run typecheck` (predev / prebuild / pretypecheck).
// Thêm ảnh mới vào public/images/... thì chạy lại `npm run dev` để danh sách cập nhật.
//
// Trước khi sinh, kiểm tra quy ước tên (dừng build nếu sai):
//  - 2 lượt thi khác nhau ra cùng một tên file ảnh thí sinh;
//  - 2 câu chuyện Human of OSS trùng `stt`.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { findDuplicateFiles, findDuplicateStt, personPhotoFiles } from "../src/lib/photo-names.js";
import { root, scanImages } from "./lib/scan-images.mjs";

const read = (name) => JSON.parse(readFileSync(join(root, "src", "data", `${name}.json`), "utf8"));

const errors = [];
const photoFiles = personPhotoFiles({
  people: read("people"),
  qualifying: read("qualifying"),
  olympia: read("olympia"),
  schools: read("schools"),
});
for (const [a, b] of findDuplicateFiles(photoFiles)) {
  errors.push(`Trùng tên file ảnh thí sinh "${a.file}":\n    - ${a.label} (${a.personId})\n    - ${b.label} (${b.personId})`);
}
for (const [a, b] of findDuplicateStt(read("humans"))) {
  errors.push(`Trùng "stt": ${a.stt} giữa Human of OSS "${a.slug}" và "${b.slug}" (src/data/humans.json)`);
}
if (errors.length) {
  console.error(`\n[images] LỖI quy ước tên ảnh, dừng lại:\n  ${errors.join("\n  ")}\n`);
  process.exit(1);
}

const outFile = join(root, "src", "data", "generated", "images.json");
const list = scanImages();

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(list, null, 2) + "\n");
console.log(`[images] ${list.length} ảnh có sẵn → src/data/generated/images.json`);
