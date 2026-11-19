// Liệt kê ảnh còn thiếu theo từng nhóm. Chỉ đọc, không sửa file nào.
// Chạy: npm run anh-con-thieu
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HUMAN_SLOTS, departmentPhotoFile, humanPhotoFile, personPhotoFiles } from "../src/lib/photo-names.js";
import { root, scanImages } from "./lib/scan-images.mjs";

const have = new Set(scanImages());
const read = (name) => JSON.parse(readFileSync(join(root, "src", "data", `${name}.json`), "utf8"));

const site = read("site");
const people = read("people");
const qualifying = read("qualifying");
const olympia = read("olympia");
const matches = read("matches");
const milestones = read("milestones");
const testimonials = read("testimonials");
const partners = read("partners");
const humans = read("humans");
const departments = read("departments");
const schools = read("schools");

const personName = new Map(people.map((p) => [p.id, p.name]));
const nameOf = (id) => personName.get(id) ?? id;

/** Mỗi mục: { label, options } — options là các đường dẫn chấp nhận được (vd .svg hoặc .png); có 1 trong số đó là đủ. */
const groups = [];
const group = (title, items) => groups.push({ title, items });
const dedupe = (items) => [...new Map(items.map((i) => [i.options.join("|"), i])).values()];

// 1. Thí sinh: mỗi lượt vào top 12 một ảnh s{mùa}-{slug}-{mã trường}.jpg + người chỉ thi Đường lên đỉnh Olympia o{năm}-...
//    (tên file tính bằng hàm dùng chung src/lib/photo-names.js, cùng hàm với web)
group(
  "Thí sinh (mỗi lượt vào top 12 một ảnh, và người chỉ thi Đường lên đỉnh Olympia)",
  personPhotoFiles({ people, qualifying, olympia, schools }).map((f) => ({
    label: f.label,
    options: [`images/thi-sinh/${f.file}`],
  })),
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

// 4. Nhận xét
group(
  "Nhận xét",
  testimonials.map((t) => ({ label: t.name, options: [`images/nhan-xet/${t.id}.jpg`] })),
);

// 5. Đối tác (svg hoặc png)
group(
  "Đối tác",
  partners.map((p) => ({ label: p.name, options: [`images/doi-tac/${p.id}.svg`, `images/doi-tac/${p.id}.png`] })),
);

// 6. Human of OSS: đủ HUMAN_SLOTS ô, ảnh human-of-oss/{stt 2 chữ số}.jpg
group(
  `Human of OSS (${HUMAN_SLOTS} ô)`,
  Array.from({ length: HUMAN_SLOTS }, (_, i) => {
    const story = humans.find((h) => h.stt === i + 1);
    return { label: story ? story.name : "chưa có câu chuyện", options: [`images/${humanPhotoFile(i + 1)}`] };
  }),
);

// 7. Các ban: ban/ban-{id}.jpg
group(
  "Các ban",
  departments.map((d) => ({ label: d.name, options: [`images/${departmentPhotoFile(d.id)}`] })),
);

// 8. Logo trường (svg hoặc png)
group(
  "Logo trường",
  schools.map((s) => ({ label: s.name, options: [`images/truong/${s.id}.svg`, `images/truong/${s.id}.png`] })),
);

// 9. Ảnh trang Giới thiệu (ảnh lớn trang chủ lấy từ ảnh Chung kết mới nhất nên hero-main.jpg chỉ là tùy chọn)
group("Ảnh trang Giới thiệu", [
  { label: "Ảnh tập thể (trên) trang Giới thiệu", options: [site.images.aboutTop] },
  { label: "Ảnh tập thể (dưới) trang Giới thiệu", options: [site.images.aboutBottom] },
]);

// 10. Logo OSS (logo-oss.svg hoặc logo-oss.png; logo-oss-tam.svg chỉ là logo tạm)
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
