// Thu nhỏ ảnh trong public/ bằng lệnh `sips` có sẵn trên macOS (không cần thêm thư viện).
// Chạy: npm run thu-nho-anh            (quét toàn bộ public/, thu nhỏ thật, ghi đè đúng file cũ)
//       npm run thu-nho-anh -- --thu   (chỉ in danh sách sẽ xử lý, không sửa file)
//       npm run thu-nho-anh -- public/images/a.jpg public/images/b.png   (chỉ xử lý các file này; --thu dùng được cả hai cách)
// Git hook pre-commit (.githooks/pre-commit) gọi script này với đúng các ảnh được thêm / sửa trong lần commit.
// File không nằm trong public/images/ (trừ public/logo-oss.png), không phải ảnh, không tồn tại hoặc là ảnh mẫu thì bỏ qua, không báo lỗi.
//
// Cạnh dài tối đa theo thư mục (không bao giờ phóng to):
//   thi-sinh/, human-of-oss/, nhan-xet/, ban/                        1200px
//   bia/, tran-dau/, thu-vien/**, cot-moc/, hero/, about/            1600px
//   truong/, doi-tac/, logo-oss.png                                  600px
// Ảnh lớn hơn giới hạn: thu nhỏ (JPEG chất lượng 80, hạ dần 70 / 60 nếu file mới vẫn nặng hơn file cũ). JPEG không vượt giới hạn nhưng nặng hơn 400KB: chỉ nén lại.
// PNG giữ PNG (giữ nền trong suốt). Ảnh mẫu (có OSS-ANH-MAU trong 4KB đầu) bị bỏ qua.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { existsSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { isSampleImage, publicDir, root, scanImages } from "./lib/scan-images.mjs";

if (process.platform !== "darwin") {
  console.error("Script này chỉ chạy trên macOS (cần lệnh sips).");
  process.exit(0);
}

const dry = process.argv.includes("--thu");
const JPEG_QUALITIES = [80, 70, 60]; // chất lượng JPEG thử lần lượt
const RECOMPRESS_OVER = 400 * 1024; // JPEG nặng hơn mức này (dù chưa vượt giới hạn cạnh) thì nén lại

/** Cạnh dài tối đa theo đường dẫn (tính từ public/); undefined = không xử lý. */
function limitOf(rel) {
  if (rel === "logo-oss.png") return 600;
  const dir = rel.split("/")[1];
  if (["thi-sinh", "human-of-oss", "nhan-xet", "ban"].includes(dir)) return 1200;
  if (["bia", "tran-dau", "thu-vien", "cot-moc", "hero", "about"].includes(dir)) return 1600;
  if (["truong", "doi-tac"].includes(dir)) return 600;
  return undefined;
}

function dimensions(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const w = Number(/pixelWidth:\s*(\d+)/.exec(out)?.[1]);
  const h = Number(/pixelHeight:\s*(\d+)/.exec(out)?.[1]);
  return w && h ? { w, h } : null;
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const isCandidate = (rel) => /\.(jpe?g|png|webp)$/i.test(rel) && (rel.startsWith("images/") || rel === "logo-oss.png");

/** Đường dẫn do người dùng / hook đưa vào → đường dẫn tính từ public/ (dấu "/"); undefined nếu không hợp lệ. */
function toRel(arg) {
  const abs = isAbsolute(arg) ? arg : resolve(root, arg);
  const rel = relative(publicDir, abs).split(sep).join("/");
  if (rel.startsWith("..") || !isCandidate(rel) || !existsSync(abs) || isSampleImage(abs)) return undefined;
  return rel;
}

const pathArgs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const files = pathArgs.length ? [...new Set(pathArgs.map(toRel).filter(Boolean))].sort() : scanImages().filter(isCandidate);

const jobs = [];
for (const rel of files) {
  const limit = limitOf(rel);
  if (!limit) continue;
  const file = join(publicDir, rel);
  const size = statSync(file).size;
  const dim = dimensions(file);
  if (!dim) continue;
  const long = Math.max(dim.w, dim.h);
  const isJpeg = /\.jpe?g$/i.test(rel);
  if (long > limit) {
    const k = limit / long;
    jobs.push({ rel, file, size, dim, limit, isJpeg, action: "resize", to: { w: Math.round(dim.w * k), h: Math.round(dim.h * k) } });
  } else if (isJpeg && size > RECOMPRESS_OVER) {
    jobs.push({ rel, file, size, dim, limit, isJpeg, action: "recompress", to: dim });
  }
}

if (!jobs.length) {
  console.log("Không có ảnh nào cần thu nhỏ.");
  process.exit(0);
}

console.log(dry ? `Sẽ xử lý ${jobs.length} ảnh (chế độ --thu, không sửa file):\n` : `Đang xử lý ${jobs.length} ảnh:\n`);

const tmp = dry ? "" : mkdtempSync(join(tmpdir(), "oss-thu-nho-"));
let before = 0;
let after = 0;
for (const j of jobs) {
  let newSize = j.size;
  let note = "";
  if (!dry) {
    const out = join(tmp, "out" + (j.isJpeg ? ".jpg" : /\.png$/i.test(j.rel) ? ".png" : ".webp"));
    try {
      // JPEG: thử chất lượng 80 trước; nếu file mới vẫn nặng hơn file cũ (ảnh gốc đã nén mạnh) thì hạ dần 70, 60
      const qualities = j.isJpeg ? JPEG_QUALITIES : [null];
      let size = Infinity;
      for (const q of qualities) {
        const args = [];
        if (j.action === "resize") args.push("-Z", String(j.limit));
        if (j.isJpeg) args.push("-s", "format", "jpeg", "-s", "formatOptions", String(q));
        execFileSync("sips", [...args, j.file, "--out", out], { stdio: "pipe" });
        size = statSync(out).size;
        if (size <= j.size) break;
      }
      if (size > j.size || (j.action === "recompress" && size === j.size)) {
        // Thu nhỏ / nén lại mà file không nhẹ hơn (ảnh gốc đã nén mạnh, hoặc chỉ vượt giới hạn chút ít): giữ nguyên, không làm ảnh xấu đi
        note = " (không nhẹ hơn, giữ nguyên)";
      } else {
        copyFileSync(out, j.file); // ghi đè đúng file cũ (cùng tên, cùng đuôi)
        newSize = size;
      }
    } catch (e) {
      note = ` (LỖI sips: ${String(e.stderr ?? e.message).trim().split("\n")[0]}; giữ nguyên)`;
    }
  }
  before += j.size;
  after += newSize;
  const dims = j.action === "resize" ? `${j.dim.w}×${j.dim.h} → ${j.to.w}×${j.to.h}` : `${j.dim.w}×${j.dim.h} (nén lại)`;
  const sizes = dry ? kb(j.size) : `${kb(j.size)} → ${kb(newSize)}`;
  console.log(`  ${j.rel}: ${dims}, ${sizes}${note}`);
}
if (tmp) rmSync(tmp, { recursive: true, force: true });

if (dry) console.log(`\nTổng dung lượng các ảnh này hiện tại: ${kb(before)}. Chạy "npm run thu-nho-anh" để thu nhỏ thật.`);
else console.log(`\nTổng dung lượng: ${kb(before)} → ${kb(after)} (giảm ${kb(before - after)}).`);
