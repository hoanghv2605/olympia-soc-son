// Kiểm tra dữ liệu trong src/data. Chạy tay: `npm run kiem-tra-du-lieu`; tự chạy trước `npm run build` (prebuild),
// nên cũng chạy trên GitHub Actions. Chỉ đọc, KHÔNG sửa dữ liệu.
// LỖI (dừng build): tham chiếu mã không tồn tại, trùng id / slug, ô điểm không phải số hoặc null, chuỗi "?",
//   Chung kết OSS không có đúng 1 Quán quân, trích dẫn nhận xét không còn trong bài Human of OSS,
//   số liệu đăng kí (dang-ky.json) lệch tổng / sai nhóm / ít hơn top 12, `gender` khác "nam" / "nu",
//   một trường vào Chung kết nhiều hơn top 12, dòng Chung kết thiếu `placement` hợp lệ.
// CẢNH BÁO (không dừng): ảnh được tham chiếu nhưng không có file (web đã có ảnh thay thế),
//   mùa chưa có số liệu đăng kí, người từng vào top 12 chưa có `gender`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { root, scanImages } from "./lib/scan-images.mjs";

const errors = [];
const warnings = [];
const error = (file, item, reason) => errors.push(`${file} → ${item}: ${reason}`);
const warn = (file, item, reason) => warnings.push(`${file} → ${item}: ${reason}`);

const dataDir = join(root, "src", "data");
const contentDir = join(root, "src", "content", "human-of-oss");

// ===== Đọc mọi file JSON (trừ thư mục generated/) =====
const files = {};
for (const dir of ["", "su-kien"]) {
  for (const name of readdirSync(join(dataDir, dir)).filter((n) => n.endsWith(".json"))) {
    const rel = dir ? `${dir}/${name}` : name;
    try {
      files[rel] = JSON.parse(readFileSync(join(dataDir, rel), "utf8"));
    } catch (e) {
      console.error(`\n[du-lieu] LỖI: src/data/${rel} không đọc được (sai cú pháp JSON): ${e.message}\n`);
      process.exit(1);
    }
  }
}
const path = (rel) => `src/data/${rel}`;
const read = (name) => files[`${name}.json`];

// ===== Chuỗi "?" =====
function scanQuestionMarks(rel, value, where) {
  if (typeof value === "string") {
    if (value.trim() === "?") error(path(rel), where, 'giá trị là "?" (chưa biết thì ghi null)');
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const label = Array.isArray(value) ? `${where}[${k}]${v?.id ?? v?.slug ?? v?.person ? ` (${v.id ?? v.slug ?? v.person})` : ""}` : `${where}.${k}`;
      scanQuestionMarks(rel, v, label);
    }
  }
}
for (const [rel, value] of Object.entries(files)) scanQuestionMarks(rel, value, "mục");

// ===== Trùng id / slug =====
function unique(file, list, keyOf, what) {
  const seen = new Set();
  for (const item of list) {
    const key = keyOf(item);
    if (key === undefined || key === null || key === "") error(file, what, `có mục thiếu ${what}`);
    else if (seen.has(key)) error(file, String(key), `trùng ${what}`);
    seen.add(key);
  }
  return seen;
}

const people = unique(path("people.json"), read("people"), (p) => p.id, "id người");
const schools = unique(path("schools.json"), read("schools"), (s) => s.id, "id trường");
const seasons = unique(path("seasons.json"), read("seasons"), (s) => s.season, "số mùa");
unique(path("matches.json"), read("matches"), (m) => m.id, "id trận");
unique(path("matches.json"), read("matches"), (m) => `mùa ${m.season} ${m.round} ${m.number}`, "trận (mùa, vòng, số)");
unique(path("qualifying.json"), read("qualifying"), (q) => `mùa ${q.season} ${q.person}`, "lượt vòng loại (mùa, người)");
const events = unique(path("events.json"), read("events"), (e) => e.id, "id sự kiện");
unique(path("events.json"), read("events"), (e) => e.stt, "stt sự kiện");
const stories = unique(path("humans.json"), read("humans"), (h) => h.slug, "slug bài");
unique(path("humans.json"), read("humans"), (h) => h.stt, "stt bài");
unique(path("testimonials.json"), read("testimonials"), (t) => t.id, "id nhận xét");
unique(path("partners.json"), read("partners"), (p) => p.id, "id đơn vị");
unique(path("departments.json"), read("departments"), (d) => d.id, "id ban");

// ===== Tham chiếu & ô điểm =====
/** `value` bỏ trống (undefined / null) thì bỏ qua trừ khi `required`. */
function ref(file, item, set, value, what, required = false) {
  if (value === undefined || value === null) {
    if (required) error(file, item, `thiếu ${what}`);
    return;
  }
  if (!set.has(value)) error(file, item, `${what} "${value}" không tồn tại`);
}
function score(file, item, value, field) {
  if (value !== null && !(typeof value === "number" && Number.isFinite(value))) {
    error(file, item, `ô điểm "${field}" phải là số hoặc null (đang là ${value === undefined ? "bị thiếu" : JSON.stringify(value)})`);
  }
}

for (const q of read("qualifying")) {
  const f = path("qualifying.json");
  const item = `mùa ${q.season}, ${q.person}`;
  ref(f, item, seasons, q.season, "mùa", true);
  ref(f, item, people, q.person, "mã người", true);
  ref(f, item, schools, q.school, "mã trường", true);
  score(f, item, q.score, "score");
}

for (const m of read("matches")) {
  const f = path("matches.json");
  ref(f, m.id, seasons, m.season, "mùa", true);
  const inMatch = unique(f, m.results, (r) => r.person, `người trong trận ${m.id}`);
  for (const r of m.results) {
    const item = `${m.id}, ${r.person}`;
    ref(f, item, people, r.person, "mã người", true);
    ref(f, item, schools, r.school, "mã trường", true);
    for (const field of ["kd", "vcnv", "tt", "vd", "total"]) score(f, item, r[field], field);
  }
  ref(f, m.id, inMatch, m.tiebreakWinner, "tiebreakWinner (phải là người trong trận)");
  if (m.round === "chung-ket") {
    const champions = m.results.filter((r) => r.placement === "vo-dich").length;
    if (champions !== 1) error(f, m.id, `Chung kết phải có đúng 1 Quán quân (đang có ${champions})`);
  }
}

// Thanh 5 chặng ở trang trường: mỗi lượt đăng kí tính vào chặng xa nhất, không chặng nào được âm.
// (Đăng kí ít hơn top 12 theo trường đã kiểm ở phần dang-ky.json bên dưới.)
for (const m of read("matches").filter((m) => m.round === "chung-ket")) {
  const f = path("matches.json");
  for (const r of m.results) {
    if (!["vo-dich", "a-quan", "giai-ba"].includes(r.placement)) {
      error(f, `${m.id}, ${r.person}`, `Chung kết thiếu "placement" hợp lệ (đang là ${JSON.stringify(r.placement) ?? "bị thiếu"})`);
    }
  }
  for (const school of new Set(m.results.map((r) => r.school))) {
    const inFinal = m.results.filter((r) => r.school === school).length;
    const inTop12 = read("qualifying").filter((q) => q.season === m.season && q.school === school).length;
    if (inFinal > inTop12) error(f, m.id, `trường "${school}": ${inFinal} người vào Chung kết nhưng top 12 chỉ có ${inTop12}`);
  }
}

for (const o of read("olympia")) {
  const f = path("olympia.json");
  const item = `${o.person}, năm thứ ${o.year}`;
  ref(f, item, people, o.person, "mã người", true);
  ref(f, item, seasons, o.ossSeason, "mùa OSS");
  if (typeof o.round === "string" && o.round.includes("?")) error(f, item, '"round" còn dấu "?": bỏ phần chưa biết, không biết gì thì ghi null');
}

for (const m of read("milestones")) ref(path("milestones.json"), m.date, people, m.person, "mã người");
for (const d of read("departments")) ref(path("departments.json"), d.id, people, d.leaderPerson, "mã người (leaderPerson)");

for (const e of read("events")) {
  const f = path("events.json");
  ref(f, `${e.id}, winner`, people, e.winner?.person, "mã người");
  const participants = [
    ...(e.matches ?? []).flatMap((m) => m.participants),
    ...(e.participants ?? []),
    ...(e.teams ?? []).flatMap((t) => t.members ?? []),
  ];
  for (const p of participants) {
    ref(f, `${e.id}, ${p.name}`, people, p.person, "mã người");
    ref(f, `${e.id}, ${p.name}`, schools, p.school, "mã trường");
  }
  if (e.dataFile && !files[e.dataFile]) error(f, e.id, `file dữ liệu "${e.dataFile}" không tồn tại`);
}

for (const [rel, doc] of Object.entries(files).filter(([rel]) => rel.startsWith("su-kien/"))) {
  const f = path(rel);
  ref(f, "id", events, doc.id, "mã sự kiện", true);
  unique(f, doc.semifinals ?? [], (s) => s.no, "số Bán kết");
  const rows = [
    ...(doc.qualifying ?? []),
    ...(doc.semifinals ?? []).flatMap((s) => s.results),
    ...(doc.final?.results ?? []),
  ];
  for (const p of rows) {
    ref(f, p.name, people, p.ossPerson, "mã người (ossPerson)");
    ref(f, p.name, schools, p.school, "mã trường", true);
  }
  for (const q of doc.qualifying ?? []) score(f, `Vòng loại, ${q.name}`, q.score, "score");
}

for (const h of read("humans")) {
  const f = path("humans.json");
  ref(f, h.slug, people, h.person, "mã người");
  for (const t of h.tranLienQuan ?? []) {
    const exists =
      t.tran === "vl"
        ? read("qualifying").some((q) => q.season === t.mua)
        : read("matches").some((m) => m.season === t.mua && (m.round === "chung-ket" ? "ck" : `bk${m.number}`) === t.tran);
    if (!exists) error(f, h.slug, `trận liên quan { mua: ${t.mua}, tran: "${t.tran}" } không tồn tại`);
  }
  if (!existsSync(join(contentDir, `${h.slug}.md`))) warn(f, h.slug, `chưa có nội dung bài src/content/human-of-oss/${h.slug}.md`);
}

for (const p of read("partners")) {
  if (!["phoi-hop", "tai-tro", "dong-hanh"].includes(p.group)) error(path("partners.json"), p.id, `nhóm "${p.group}" không tồn tại`);
}

// ===== Giới tính =====
const genderOf = new Map(read("people").map((p) => [p.id, p.gender]));
for (const p of read("people")) {
  if (p.gender !== undefined && p.gender !== "nam" && p.gender !== "nu") {
    error(path("people.json"), p.id, `"gender" phải là "nam" hoặc "nu" (đang là ${JSON.stringify(p.gender)})`);
  }
}
for (const id of new Set(read("qualifying").map((q) => q.person))) {
  if (genderOf.has(id) && genderOf.get(id) === undefined) warn(path("people.json"), id, 'từng vào top 12 nhưng chưa có "gender"');
}

// ===== Số liệu đăng kí dự thi =====
const registration = read("dang-ky");
if (!registration) error(path("dang-ky.json"), "file", "không có file");
else {
  const f = path("dang-ky.json");
  const registeredSchools = new Set([...schools, ...registration.otherSchools.map((s) => s.id)]);
  const CRITERIA = [
    { key: "byGrade", what: "khối", allowed: new Set(["9", "10", "11", "12"]), of: (q) => /^\d+/.exec(q.class)?.[0] },
    { key: "byGender", what: "giới tính", allowed: new Set(["nam", "nu"]), of: (q) => genderOf.get(q.person) },
    { key: "bySchool", what: "trường", allowed: registeredSchools, of: (q) => q.school },
  ];
  const isCount = (v) => Number.isInteger(v) && v >= 0;
  const listed = unique(f, registration.seasons, (r) => r.season, "mùa");
  for (const r of registration.seasons) {
    const item = `mùa ${r.season}`;
    ref(f, item, seasons, r.season, "mùa", true);
    if (!isCount(r.total)) error(f, item, '"total" phải là số nguyên không âm');
    const top12 = read("qualifying").filter((q) => q.season === r.season);
    for (const { key, what, allowed, of } of CRITERIA) {
      const counts = r[key] ?? {};
      for (const [group, n] of Object.entries(counts)) {
        if (!allowed.has(group)) error(f, item, `${key}: nhóm ${what} "${group}" không hợp lệ`);
        if (!isCount(n)) error(f, item, `${key}.${group} phải là số nguyên không âm`);
      }
      const sum = Object.values(counts).reduce((a, b) => a + b, 0);
      if (sum !== r.total) error(f, item, `total = ${r.total} nhưng tổng ${key} = ${sum}`);
      const inTop12 = new Map();
      for (const q of top12) {
        const group = of(q);
        if (group !== undefined) inTop12.set(group, (inTop12.get(group) ?? 0) + 1);
      }
      for (const [group, n] of inTop12) {
        if (n > (counts[group] ?? 0)) {
          error(f, item, `${what} "${group}": top 12 có ${n} người nhưng đăng kí chỉ có ${counts[group] ?? 0}`);
        }
      }
    }
  }
  for (const n of seasons) if (!listed.has(n)) warn(f, `mùa ${n}`, "chưa có số liệu đăng kí (mùa mới chưa nhập)");
}

// ===== Trích dẫn nhận xét phải còn trong bài gốc =====
/** So chữ: bỏ emoji, dấu in đậm / nghiêng và dấu kết câu (trong bài, emoji nhiều khi đứng thay dấu chấm). */
const comparable = (text) =>
  text
    .normalize("NFC")
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\u200D\uFE0F*_]/gu, "")
    .replace(/[.!?…]+(?=\s|$|["”’')\p{Extended_Pictographic}])/gu, "")
    .replace(/\s+/g, " ")
    .trim();

for (const t of read("testimonials")) {
  const f = path("testimonials.json");
  if (!t.humanSlug) continue;
  const file = join(contentDir, `${t.humanSlug}.md`);
  if (!stories.has(t.humanSlug)) error(f, t.id, `bài "${t.humanSlug}" không có trong humans.json`);
  else if (!existsSync(file)) error(f, t.id, `không có file bài src/content/human-of-oss/${t.humanSlug}.md`);
  else {
    const body = comparable(readFileSync(file, "utf8"));
    for (const part of (t.quote ?? "").split(/\n\s*\n/).filter((p) => p.trim())) {
      if (!body.includes(comparable(part))) error(f, t.id, `trích dẫn không còn trong bài ${t.humanSlug}.md: "${part.slice(0, 60)}…"`);
    }
  }
}

// ===== Ảnh được tham chiếu (cảnh báo) =====
const images = new Set(scanImages());
function image(file, item, src) {
  if (!images.has(src)) warn(file, item, `không có ảnh public/${src}`);
}
for (const e of read("events")) if (e.awardPhoto) image(path("events.json"), e.id, `images/${e.awardPhoto.src}`);
for (const key of Object.keys(read("tieu-diem-anh"))) image(path("tieu-diem-anh.json"), key, `images/${key}`);
for (const key of ["aboutTop", "aboutBottom"]) image(path("site.json"), `images.${key}`, read("site").images[key]);
for (const name of readdirSync(contentDir).filter((n) => n.endsWith(".md") && !n.startsWith("_"))) {
  for (const [, src] of readFileSync(join(contentDir, name), "utf8").matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)) {
    if (!/^(https?:|data:|\/\/)/.test(src)) image(`src/content/human-of-oss/${name}`, "ảnh trong bài", src.replace(/^\.?\//, ""));
  }
}

// ===== Kết quả =====
for (const w of warnings) console.warn(`[du-lieu] CẢNH BÁO: ${w}`);
if (errors.length) {
  console.error(`\n[du-lieu] ${errors.length} LỖI, dừng lại:\n  ${errors.join("\n  ")}\n`);
  process.exit(1);
}
console.log(`[du-lieu] Dữ liệu hợp lệ (${warnings.length} cảnh báo).`);
