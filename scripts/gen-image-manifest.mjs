// Sinh danh sách ảnh có sẵn trong public/ → src/data/generated/images.json
// Web chỉ gọi tải ảnh có trong danh sách này (không còn lỗi 404 khi chưa có ảnh).
// Tự chạy trước `npm run dev`, `npm run build`, `npm run typecheck` (predev / prebuild / pretypecheck).
// Thêm ảnh mới vào public/images/... thì chạy lại `npm run dev` để danh sách cập nhật.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { root, scanImages } from "./lib/scan-images.mjs";

const outFile = join(root, "src", "data", "generated", "images.json");
const list = scanImages();

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(list, null, 2) + "\n");
console.log(`[images] ${list.length} ảnh có sẵn → src/data/generated/images.json`);
