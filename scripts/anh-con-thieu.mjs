// Liệt kê ảnh còn thiếu theo từng nhóm. Chỉ đọc, không sửa file nào.
// Chạy: npm run anh-con-thieu
import { HUMAN_SLOTS, departmentPhotoFile, eventPhotoFiles, humanPhotoFile, personPhotoFiles } from "../src/lib/photo-names.js";
import { read, readEventDocs } from "./lib/read-data.mjs";
import { scanImages } from "./lib/scan-images.mjs";

const have = new Set(scanImages());

const site = read("site");
const people = read("people");
const qualifying = read("qualifying");
const olympia = read("olympia");
const matches = read("matches");
const milestones = read("milestones");
const partners = read("partners");
const humans = read("humans");
const matchesAll = matches;
const departments = read("departments");
const schools = read("schools");
const events = read("events").sort((a, b) => a.stt - b.stt);

const personName = new Map(people.map((p) => [p.id, p.name]));
const nameOf = (id) => personName.get(id) ?? id;

/** Mỗi mục: { label, options } — options là các đường dẫn chấp nhận được (vd .svg hoặc .png); có 1 trong số đó là đủ. */
const groups = [];
const group = (title, items) => groups.push({ title, items });
const dedupe = (items) => [...new Map(items.map((i) => [i.options.join("|"), i])).values()];

// 1. Ảnh thí sinh (tên file tính bằng hàm dùng chung src/lib/photo-names.js, cùng hàm với web), chia 3 nhóm:
//    theo mùa s{mùa}-..., Đường lên đỉnh Olympia o{năm}-..., Quán quân Hall of Fame s{mùa}-...-win
const photoFiles = personPhotoFiles({ people, qualifying, olympia, schools, matches: matchesAll });
const photoItems = (kind) =>
  photoFiles.filter((f) => f.kind === kind).map((f) => ({ label: f.label, options: [`images/thi-sinh/${f.file}`] }));
group("Thí sinh theo mùa (mỗi lượt vào top 12 một ảnh)", photoItems("oss"));
group("Ảnh Olympia (mỗi năm Đường lên đỉnh Olympia một ảnh)", photoItems("olympia"));
group("Quán quân Hall of Fame (ảnh vuông ~800×800 của mùa vô địch gần nhất)", photoItems("win"));

// 1b. Ảnh bìa mùa: bia/oss{n}-bia.jpg
group(
  `Ảnh bìa mùa (${[...new Set(matches.map((m) => m.season))].length})`,
  [...new Set(matches.map((m) => m.season))]
    .sort((a, b) => a - b)
    .map((n) => ({ label: `Mùa ${n}`, options: [`images/bia/oss${n}-bia.jpg`] })),
);

// 1c. Ảnh sự kiện (events.json, nằm ngoài nhóm Thí sinh): ảnh bìa bia/{id}-bia.jpg và ảnh người chơi
//     thi-sinh/{photoKey}-{slug}-{mã trường}.jpg (chỉ người chơi có trường trong schools.json)
group(
  `Ảnh bìa sự kiện (${events.length})`,
  events.map((e) => ({ label: e.name, options: [`images/bia/${e.id}-bia.jpg`] })),
);
// Các nhóm sự kiện tự tính từ dữ liệu: mọi cặp (sự kiện có photoKey, người tham gia có trong people.json)
const peopleIds = new Set(people.map((p) => p.id));
const eventPlayers = eventPhotoFiles(events, schools, readEventDocs(events)).filter((f) => f.personId && peopleIds.has(f.personId));
group(
  `Người chơi tại sự kiện (${eventPlayers.length})`,
  eventPlayers.map((f) => ({ label: f.label, options: [`images/thi-sinh/${f.file}`] })),
);
const awards = events.filter((e) => e.awardPhoto);
group(
  `Ảnh trao giải sự kiện (${awards.length})`,
  awards.map((e) => ({ label: `${e.name}: ${e.awardPhoto.caption}`, options: [`images/${e.awardPhoto.src}`] })),
);

// 2. Trận đấu
group(
  "Trận đấu (Bán kết và Chung kết)",
  matches.map((m) => ({
    label: `${m.round === "chung-ket" ? "Chung kết" : `Bán kết ${m.number}`} mùa ${m.season}`,
    options: [`images/tran-dau/${m.id}.jpg`],
  })),
);

// 3. Cột mốc (theo ngày)
group(
  "Cột mốc",
  dedupe(
    milestones.map((m) => ({
      label: `${m.date}: ${m.highlight}${m.person ? ` (${nameOf(m.person)})` : ""}`,
      options: [`images/cot-moc/${m.date}.jpg`],
    })),
  ),
);

// 4. Đơn vị đồng hành theo nhóm (svg hoặc png): doi-tac/{id}.svg|png, id = phoi-hop-n / tai-tro-n / dong-hanh-n trong partners.json
for (const [tier, title] of [
  ["phoi-hop", "Đơn vị phối hợp tổ chức"],
  ["tai-tro", "Nhà tài trợ"],
  ["dong-hanh", "Đơn vị đồng hành"],
]) {
  group(
    title,
    partners
      .filter((p) => p.group === tier)
      .map((p) => ({ label: p.name, options: [`images/doi-tac/${p.id}.svg`, `images/doi-tac/${p.id}.png`] })),
  );
}

// 5. Human of OSS: đủ HUMAN_SLOTS ô, ảnh human-of-oss/{stt 2 chữ số}.jpg.
//    Tập có `person` mà chưa có ảnh riêng vẫn dùng được ảnh thí sinh (tính là có, ghi chú "đang dùng ảnh thí sinh").
const humanItems = Array.from({ length: HUMAN_SLOTS }, (_, i) => {
  const story = humans.find((h) => h.stt === i + 1);
  const file = `images/${humanPhotoFile(i + 1)}`;
  const label = story ? story.name : "chưa có câu chuyện";
  if (story?.person && !have.has(file)) {
    const own = photoFiles.find((f) => f.personId === story.person && have.has(`images/thi-sinh/${f.file}`));
    if (own) return { label: `${label} (đang dùng ảnh thí sinh)`, options: [`images/thi-sinh/${own.file}`] };
  }
  return { label, options: [file] };
});
group(`Human of OSS (${HUMAN_SLOTS} ô, theo stt)`, humanItems);

// 6. Các ban: ban/ban-{id}.jpg
group(
  "Các ban",
  departments.map((d) => ({ label: d.name, options: [`images/${departmentPhotoFile(d.id)}`] })),
);

// 7. Logo trường (svg hoặc png)
group(
  "Logo trường",
  schools.map((s) => ({ label: s.name, options: [`images/truong/${s.id}.svg`, `images/truong/${s.id}.png`] })),
);

// 8. Ảnh trang Giới thiệu (ảnh lớn trang chủ lấy từ ảnh Chung kết mới nhất nên hero-main.jpg chỉ là tùy chọn)
group("Ảnh trang Giới thiệu", [
  { label: "Ảnh tập thể (trên) trang Giới thiệu", options: [site.images.aboutTop] },
  { label: "Ảnh tập thể (dưới) trang Giới thiệu", options: [site.images.aboutBottom] },
]);

// 9. Logo OSS (logo-oss.svg hoặc logo-oss.png; logo-oss-tam.svg chỉ là logo tạm)
group("Logo OSS", [{ label: "Logo Olympia Sóc Sơn", options: ["logo-oss.svg", "logo-oss.png"] }]);

// ===== In kết quả =====
let totalHave = 0;
let totalAll = 0;
for (const g of groups) {
  const missing = g.items.filter((i) => !i.options.some((o) => have.has(o)));
  const done = g.items.length - missing.length;
  totalHave += done;
  totalAll += g.items.length;
  console.log(`\n## ${g.title}: đã có ${done} / ${g.items.length}`);
  for (const i of missing) {
    const [first, ...rest] = i.options;
    console.log(`  - public/${first}${rest.length ? ` (hoặc ${rest.map((r) => `public/${r}`).join(", ")})` : ""}  ← ${i.label}`);
  }
}
console.log(`\nTổng: đã có ${totalHave} / ${totalAll} ảnh.`);

// Tùy chọn (không bắt buộc, không tính vào tổng)
const heroMain = site.images.heroMain;
console.log(
  `\n## Tùy chọn: ảnh lớn dự phòng trang chủ (chỉ dùng khi chưa mùa nào có ảnh Chung kết): ${
    have.has(heroMain) ? "đã có" : "chưa có"
  } public/${heroMain}`,
);

// Thông tin: Thư viện ảnh theo mùa (public/images/thu-vien/mua-{n}/, tên file tùy ý). Không tính là thiếu.
const seasonNums = [...new Set(read("seasons").map((s) => s.season))].sort((a, b) => a - b);
console.log("\n## Thư viện (thông tin, không tính là thiếu): số ảnh trong public/images/thu-vien/mua-{n}/");
for (const n of seasonNums) {
  const dir = `images/thu-vien/mua-${n}/`;
  const c = [...have].filter((p) => p.startsWith(dir)).length;
  console.log(`  - Mùa ${n}: ${c} ảnh`);
}

// Thông tin: Thư viện ảnh theo sự kiện (public/images/thu-vien/su-kien/{id}/, tên file tùy ý). Không tính là thiếu.
console.log("\n## Thư viện sự kiện (thông tin, không tính là thiếu): số ảnh trong public/images/thu-vien/su-kien/{id}/");
for (const e of events) {
  const dir = `images/thu-vien/su-kien/${e.id}/`;
  const c = [...have].filter((p) => p.startsWith(dir)).length;
  console.log(`  - ${e.name}: ${c} ảnh`);
}
