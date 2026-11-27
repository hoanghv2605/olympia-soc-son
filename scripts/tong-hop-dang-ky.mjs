// Tổng hợp số liệu đăng kí dự thi từ danh sách gốc của BTC. Chạy: `npm run tong-hop-dang-ky`
// (mặc định đọc file .csv duy nhất trong du-lieu-rieng/; hoặc `npm run tong-hop-dang-ky -- đường/dẫn.csv`).
// Cột: STT, Mùa, Họ và tên, Lớp, Trường, Giới tính.
// Ghi: src/data/dang-ky.json (chỉ số đếm) và `gender` còn thiếu của người vào top 12 trong people.json.
// RIÊNG TƯ: du-lieu-rieng/ không được commit (.gitignore + git hook). Script KHÔNG in tên người đăng kí,
// trừ các dòng top 12 ghép lỗi; lỗi ở dòng CSV chỉ báo số dòng.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { root } from "./lib/scan-images.mjs";
import { read } from "./lib/read-data.mjs";

const PRIVATE_DIR = "du-lieu-rieng";
const COLUMNS = { season: "Mùa", name: "Họ và tên", klass: "Lớp", school: "Trường", gender: "Giới tính" };

function stop(message) {
  console.error(`\n[dang-ky] DỪNG, chưa ghi file nào.\n${message}\n`);
  process.exit(1);
}
const writeJson = (name, value) => writeFileSync(join(root, "src", "data", `${name}.json`), `${JSON.stringify(value, null, 2)}\n`);

// ===== Đọc CSV =====
function inputFile() {
  if (process.argv[2]) return resolve(process.argv[2]);
  const dir = join(root, PRIVATE_DIR);
  const files = existsSync(dir) ? readdirSync(dir).filter((n) => n.toLowerCase().endsWith(".csv")) : [];
  if (!files.length) stop(`Không có file .csv trong ${PRIVATE_DIR}/. Đặt file vào đó rồi chạy lại.`);
  if (files.length > 1) stop(`${PRIVATE_DIR}/ có ${files.length} file .csv. Chỉ để lại 1 file, hoặc chạy: npm run tong-hop-dang-ky -- ${PRIVATE_DIR}/<tên file>.csv`);
  return join(dir, files[0]);
}

/** CSV có ô trong ngoặc kép ("" = một dấu ngoặc kép), xuống dòng CRLF hoặc LF. Dấu ngăn: "," hoặc ";" (theo dòng tiêu đề). */
function parseCsv(text) {
  const header = text.split(/\r?\n/, 1)[0];
  const separator = !header.includes(",") && header.includes(";") ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch !== '"') cell += ch;
      else if (text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = false;
    } else if (ch === '"') quoted = true;
    else if (ch === separator) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows;
}

// ===== Chuẩn hoá =====
const clean = (text) => (text ?? "").normalize("NFC").replace(/\s+/g, " ").trim();

/** Khoá so chữ: không phân biệt hoa thường; dấu thanh đưa về cuối mỗi chữ nên "thuỷ" = "thủy". */
function key(text) {
  return clean(text)
    .toLocaleLowerCase("vi")
    .split(" ")
    .map((word) => {
      const parts = word.normalize("NFD");
      const tones = parts.match(/[̣̀́̃̉]/g) ?? [];
      return parts.replace(/[̣̀́̃̉]/g, "").normalize("NFC") + tones.join("");
    })
    .join(" ");
}

const file = inputFile();
if (!existsSync(file)) stop(`Không có file ${relative(root, file)}.`);
const [header = [], ...body] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));

const columnAt = {};
for (const [field, title] of Object.entries(COLUMNS)) {
  columnAt[field] = header.findIndex((h) => key(h) === key(title));
  if (columnAt[field] < 0) stop(`Thiếu cột "${title}" ở dòng tiêu đề. Cần các cột: STT, ${Object.values(COLUMNS).join(", ")}.`);
}

const previous = read("dang-ky");
const schools = read("schools");
const allSchools = [...schools, ...previous.otherSchools];
const schoolByName = new Map(allSchools.map((s) => [key(s.name), s.id]));
const seasonNumbers = new Set(read("seasons").map((s) => s.season));

const entries = [];
const lineErrors = [];
const unknownSchools = new Map();
body.forEach((cells, i) => {
  const line = i + 2; // dòng 1 là tiêu đề
  const value = Object.fromEntries(Object.entries(columnAt).map(([field, at]) => [field, clean(cells[at])]));
  if (!value.name && !value.klass && !value.school && !value.gender) return; // dòng trống

  const season = Number(/\d+/.exec(value.season)?.[0]);
  if (!seasonNumbers.has(season)) lineErrors.push(`dòng ${line}: cột Mùa trống hoặc không có trong seasons.json`);
  if (!value.name) lineErrors.push(`dòng ${line}: thiếu Họ và tên`);

  const klass = value.klass.replace(/^lớp\s*/i, "").replace(/\s+/g, "").toUpperCase();
  const grade = Number(/^\d+/.exec(klass)?.[0]);
  if (!(grade >= 9 && grade <= 12)) lineErrors.push(`dòng ${line}: cột Lớp phải bắt đầu bằng 9, 10, 11 hoặc 12`);

  const school = schoolByName.get(key(value.school)) ?? (key(value.school).startsWith(key("THCS")) ? "thcs" : undefined);
  if (!school) unknownSchools.set(value.school || "(trống)", [...(unknownSchools.get(value.school || "(trống)") ?? []), line]);

  const gender = { [key("Nam")]: "nam", [key("Nữ")]: "nu" }[key(value.gender)];
  if (!gender) lineErrors.push(`dòng ${line}: cột Giới tính phải là "Nam" hoặc "Nữ"`);

  entries.push({ season, name: value.name, grade, school, gender });
});

if (unknownSchools.size) {
  lineErrors.push(
    ...[...unknownSchools].map(([name, lines]) => `Không nhận ra trường "${name}" (dòng ${lines.join(", ")}): sửa trong CSV, hoặc khai thêm ở schools.json / otherSchools`),
  );
}
if (lineErrors.length) stop(lineErrors.map((e) => `  ${e}`).join("\n"));
if (!entries.length) stop("File CSV không có dòng dữ liệu nào.");

// Chốt an toàn: file thiếu một mùa đang có số liệu thì không ghi đè
const inCsv = new Set(entries.map((e) => e.season));
const lost = previous.seasons.map((s) => s.season).filter((n) => !inCsv.has(n));
if (lost.length) stop(`CSV thiếu mùa ${lost.join(", ")} đang có trong dang-ky.json. File CSV phải gồm mọi mùa.`);

// ===== dang-ky.json =====
/** Đếm theo nhóm, khoá theo thứ tự `order`, chỉ ghi nhóm > 0. */
function countBy(list, field, order) {
  return Object.fromEntries(
    order.map((group) => [group, list.filter((e) => String(e[field]) === group).length]).filter(([, n]) => n > 0),
  );
}
const seasonRows = [...inCsv]
  .sort((a, b) => a - b)
  .map((season) => {
    const list = entries.filter((e) => e.season === season);
    return {
      season,
      total: list.length,
      byGrade: countBy(list, "grade", ["9", "10", "11", "12"]),
      byGender: countBy(list, "gender", ["nam", "nu"]),
      bySchool: countBy(list, "school", allSchools.map((s) => s.id)),
    };
  });

// ===== gender của người vào top 12 =====
const people = read("people");
const personById = new Map(people.map((p) => [p.id, p]));
const byRow = new Map();
for (const e of entries) {
  const rowKey = `${e.season}|${e.school}|${key(e.name)}`;
  byRow.set(rowKey, [...(byRow.get(rowKey) ?? []), e]);
}

const problems = [];
const found = new Map(); // mã người → [{ season, gender }]
for (const q of read("qualifying").filter((q) => inCsv.has(q.season))) {
  const name = personById.get(q.person)?.name ?? q.person;
  const matches = byRow.get(`${q.season}|${q.school}|${key(name)}`) ?? [];
  if (matches.length !== 1) {
    problems.push(`mùa ${q.season}, ${name}: ${matches.length ? `ghép được ${matches.length} dòng` : "không ghép được dòng nào (kiểm tra họ tên, trường)"}`);
    continue;
  }
  found.set(q.person, [...(found.get(q.person) ?? []), { season: q.season, gender: matches[0].gender }]);
}

const label = { nam: "Nam", nu: "Nữ" };
const fill = new Map();
for (const [id, list] of found) {
  const person = personById.get(id);
  const genders = new Set(list.map((x) => x.gender));
  const detail = list.map((x) => `mùa ${x.season}: ${label[x.gender]}`).join(", ");
  if (genders.size > 1) problems.push(`${person.name}: giới tính lệch giữa các mùa (${detail})`);
  else if (!person.gender) fill.set(id, list[0].gender);
  else if (!genders.has(person.gender)) problems.push(`${person.name}: people.json ghi ${label[person.gender]}, CSV ghi ${detail} (giữ nguyên people.json)`);
}

// ===== Ghi file =====
writeJson("dang-ky", { _ghiChu: previous._ghiChu, otherSchools: previous.otherSchools, seasons: seasonRows });
if (fill.size) {
  writeJson(
    "people",
    people.map((p) => {
      if (!fill.has(p.id)) return p;
      const { id, name, school, ...rest } = p;
      return { id, name, school, gender: fill.get(p.id), ...rest };
    }),
  );
}

console.log(`[dang-ky] ${entries.length} đơn, ${seasonRows.length} mùa → src/data/dang-ky.json`);
console.log(`[dang-ky] Điền thêm giới tính cho ${fill.size} người trong people.json.`);
if (problems.length) {
  console.warn(`\n[dang-ky] ${problems.length} dòng top 12 cần Kit xem (script không tự đoán):\n  ${problems.join("\n  ")}\n`);
}
console.log("[dang-ky] Xem lại bằng `git diff`, rồi chạy `npm run kiem-tra-du-lieu`.");
