// Đổi tên ảnh cũ sang quy ước mới (v0.10). Chạy 1 lần.
//   node scripts/doi-quy-uoc-anh.mjs --thu   → chỉ in kết quả dự kiến, không đổi gì
//   node scripts/doi-quy-uoc-anh.mjs         → chạy thật
//
// Quy tắc:
//   thi-sinh/<person id>.jpg     mẫu → xoá; thật → đổi sang tên MÙA MỚI NHẤT của người đó (người chỉ thi Đường lên đỉnh Olympia: tên o…)
//   humans/<slug>.jpg            mẫu → xoá; thật → human-of-oss/{stt 2 chữ số}.jpg theo humans.json; xoá thư mục humans/ nếu trống
//   about/ban-<id>.jpg, ban/<id>.jpg   mẫu → xoá; thật → ban/ban-<id>.jpg
//   File đích đã có: đích là ảnh mẫu → ghi đè; đích là ảnh thật → KHÔNG ghi đè, in cảnh báo.
//   Chỉ xử lý .jpg; .jpeg / .JPG / .png trong thi-sinh/ chỉ in cảnh báo.
//   "Ảnh mẫu" = có chuỗi OSS-ANH-MAU trong 4KB đầu (cùng quy tắc với danh sách ảnh).
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { departmentPhotoFile, humanPhotoFile, personPhotoFiles } from "../src/lib/photo-names.js";
import { isSampleImage, publicDir, root } from "./lib/scan-images.mjs";

const dryRun = process.argv.includes("--thu");
const imagesDir = join(publicDir, "images");
const read = (name) => JSON.parse(readFileSync(join(root, "src", "data", `${name}.json`), "utf8"));

const people = read("people");
const qualifying = read("qualifying");
const olympia = read("olympia");
const schools = read("schools");
const humans = read("humans");
const departments = read("departments");

const abs = (rel) => join(imagesDir, rel);
const listDir = (dir) => {
  try {
    return readdirSync(abs(dir)).filter((n) => !n.startsWith("."));
  } catch {
    return [];
  }
};

// ----- Trạng thái ảo của các file (rel → ảnh mẫu?) để lập kế hoạch giống hệt khi thử và khi chạy thật -----
const state = new Map(); // rel → { sample: boolean }
for (const dir of ["thi-sinh", "humans", "about", "ban", "human-of-oss"]) {
  for (const n of listDir(dir)) {
    const rel = `${dir}/${n}`;
    if (statSync(abs(rel)).isFile()) state.set(rel, { sample: isSampleImage(abs(rel)) });
  }
}

const ops = []; // { kind: "rename" | "delete", from, to? }
const renamed = [];
const deleted = [];
const warnings = [];

function remove(rel, why) {
  ops.push({ kind: "delete", from: rel });
  state.delete(rel);
  deleted.push(`${rel}  (${why})`);
}

/** Ảnh thật → chuyển sang `to` theo quy tắc ghi đè. */
function move(rel, to) {
  const dest = state.get(to);
  if (dest && !dest.sample) {
    warnings.push(`Không ghi đè: ${to} đã là ảnh thật, giữ nguyên ${rel}`);
    return;
  }
  ops.push({ kind: "rename", from: rel, to });
  state.set(to, state.get(rel));
  state.delete(rel);
  renamed.push(`${rel}  →  ${to}${dest ? "  (ghi đè ảnh mẫu)" : ""}`);
}

/** Xử lý 1 file cũ: mẫu → xoá; thật → chuyển. */
function handle(rel, to) {
  if (state.get(rel).sample) remove(rel, "ảnh mẫu");
  else move(rel, to);
}

// ----- 1. thi-sinh/<person id>.jpg → tên mùa mới nhất (hoặc o…) -----
const photoFiles = personPhotoFiles({ people, qualifying, olympia, schools });
const allNew = new Set(photoFiles.map((f) => f.file));
const targetOf = new Map(); // person id → { file, season }
for (const f of photoFiles) {
  const cur = targetOf.get(f.personId);
  if (!cur || (f.season ?? 0) > cur.season) targetOf.set(f.personId, { file: f.file, season: f.season ?? 0 });
}
for (const name of listDir("thi-sinh")) {
  const rel = `thi-sinh/${name}`;
  if (!state.has(rel)) continue;
  if (!name.endsWith(".jpg")) {
    if (/\.(jpe?g|png)$/i.test(name)) warnings.push(`${rel}: đuôi file không phải .jpg (chữ thường), không động vào`);
    continue;
  }
  const id = name.slice(0, -4);
  if (targetOf.has(id)) handle(rel, `thi-sinh/${targetOf.get(id).file}`);
  else if (!allNew.has(name)) warnings.push(`${rel}: không khớp mã thí sinh nào và không theo quy ước mới, không động vào`);
}

// ----- 2. humans/<slug>.jpg → human-of-oss/{stt}.jpg -----
for (const name of listDir("humans")) {
  const rel = `humans/${name}`;
  if (!state.has(rel) || !name.endsWith(".jpg")) continue;
  const story = humans.find((h) => h.slug === name.slice(0, -4));
  if (!story) warnings.push(`${rel}: không có câu chuyện nào trùng slug trong humans.json, không động vào`);
  else handle(rel, humanPhotoFile(story.stt));
}

// ----- 3. about/ban-<id>.jpg và ban/<id>.jpg → ban/ban-<id>.jpg -----
for (const d of departments) {
  const to = departmentPhotoFile(d.id);
  for (const rel of [`about/ban-${d.id}.jpg`, `ban/${d.id}.jpg`]) {
    if (state.has(rel)) handle(rel, to);
  }
}

// ----- Thư mục humans/ trống (không còn file nào sau khi xử lý) thì xoá -----
let removeHumansDir = false;
if (existsSync(abs("humans"))) {
  const left = listDir("humans").filter((n) => state.has(`humans/${n}`) || !statSync(abs(`humans/${n}`)).isFile());
  if (left.length === 0) {
    removeHumansDir = true;
    deleted.push("humans/  (thư mục trống)");
  } else {
    warnings.push(`Thư mục humans/ còn: ${left.join(", ")} nên không xoá`);
  }
}

// ----- Thực hiện -----
if (!dryRun) {
  for (const op of ops) {
    if (op.kind === "delete") rmSync(abs(op.from));
    else {
      mkdirSync(dirname(abs(op.to)), { recursive: true });
      renameSync(abs(op.from), abs(op.to));
    }
  }
  if (removeHumansDir) rmSync(abs("humans"), { recursive: true });
}

// ----- In bảng -----
const print = (title, rows) => {
  console.log(`\n## ${title}: ${rows.length}`);
  for (const r of rows) console.log(`  - ${r}`);
};
console.log(dryRun ? "[THỬ] Chỉ in kết quả dự kiến, chưa đổi gì." : "[CHẠY THẬT]");
print(dryRun ? "Sẽ đổi tên (cũ → mới)" : "Đã đổi tên (cũ → mới)", renamed);
print(dryRun ? "Sẽ xoá" : "Đã xoá", deleted);
print("Cảnh báo", warnings);
if (!dryRun) console.log("\nXong. Chạy tiếp: npm run anh-con-thieu");
