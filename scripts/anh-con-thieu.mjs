// Liệt kê ảnh còn thiếu theo từng nhóm. Chỉ đọc, không sửa file nào.
// Chạy: npm run anh-con-thieu
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

// 1. Thí sinh OSS (có dòng trong qualifying.json) + người trong mục THPT Sóc Sơn tại Đường lên đỉnh Olympia
const ossIds = new Set(qualifying.map((q) => q.person));
const socSonOlympia = new Set(olympia.map((o) => o.person).filter((id) => people.find((p) => p.id === id)?.school === "soc-son"));
const personIds = [...new Set([...ossIds, ...socSonOlympia])];
group(
  "Thí sinh (OSS và THPT Sóc Sơn tại Đường lên đỉnh Olympia)",
  personIds.map((id) => ({ label: nameOf(id), options: [`images/thi-sinh/${id}.jpg`] })),
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

// 6. Human of OSS
group(
  "Human of OSS",
  humans.map((h) => ({ label: h.name, options: [`images/human-of-oss/${h.slug}.jpg`] })),
);

// 7. Các ban (photo trong departments.json nếu có, không thì images/ban/<id>.jpg)
group(
  "Các ban",
  departments.map((d) => ({ label: d.name, options: [d.photo ?? `images/ban/${d.id}.jpg`] })),
);

// 8. Logo trường (svg hoặc png)
group(
  "Logo trường",
  schools.map((s) => ({ label: s.name, options: [`images/truong/${s.id}.svg`, `images/truong/${s.id}.png`] })),
);

// 9. Ảnh trang chủ / giới thiệu
group("Ảnh trang chủ và trang Giới thiệu", [
  { label: "Ảnh lớn trang chủ", options: [site.images.heroMain] },
  ...site.images.heroLetters.map((p, i) => ({ label: `Chữ ${"OSS"[i]} trên trang chủ`, options: [p] })),
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
