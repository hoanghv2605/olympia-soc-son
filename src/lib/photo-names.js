// Quy ước tên file ảnh, dùng chung cho web (src/lib/data.ts) và các script Node (scripts/*.mjs).
// JS thuần (không TypeScript) để Node import được; kiểu nằm ở photo-names.d.ts.

/** Số ô ở trang Human of OSS: câu chuyện thật trước, còn thiếu thì thêm ô "Câu chuyện sắp ra mắt". */
export const HUMAN_SLOTS = 10;

/**
 * Slug họ tên: Đ→D, đ→d; NFD rồi bỏ dấu (U+0300–U+036F); chữ thường;
 * mọi chuỗi ký tự không thuộc [a-z0-9] thành một dấu "-"; bỏ "-" ở đầu và cuối.
 */
export function slugify(name) {
  return name
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Mã trường = slug của `short` trong schools.json: ss, dp, tg, mp, xg. */
export function schoolCode(schools, schoolId) {
  const s = schools.find((x) => x.id === schoolId);
  return slugify(s?.short ?? schoolId);
}

/**
 * Mọi file ảnh thí sinh theo quy ước (tên file trong public/images/thi-sinh/):
 * - mỗi dòng qualifying.json (mỗi lượt vào top 12): s{mùa}-{slug họ tên}-{mã trường của dòng đó}.jpg
 * - người chỉ thi Đường lên đỉnh Olympia (không có trong qualifying.json): o{năm Olympia nhỏ nhất}-{slug}-{mã trường}.jpg
 */
export function personPhotoFiles({ people, qualifying, olympia, schools }) {
  const nameOf = (id) => people.find((p) => p.id === id)?.name ?? id;
  const list = [];
  for (const q of qualifying) {
    list.push({
      file: `s${q.season}-${slugify(nameOf(q.person))}-${schoolCode(schools, q.school)}.jpg`,
      personId: q.person,
      kind: "oss",
      season: q.season,
      label: `${nameOf(q.person)} · mùa ${q.season}`,
    });
  }
  const ossIds = new Set(qualifying.map((q) => q.person));
  const onlyOlympia = [...new Set(olympia.map((o) => o.person))].filter((id) => !ossIds.has(id));
  for (const id of onlyOlympia) {
    const year = Math.min(...olympia.filter((o) => o.person === id).map((o) => o.year));
    const school = people.find((p) => p.id === id)?.school ?? "";
    list.push({
      file: `o${year}-${slugify(nameOf(id))}-${schoolCode(schools, school)}.jpg`,
      personId: id,
      kind: "olympia",
      year,
      label: `${nameOf(id)} · Olympia năm thứ ${year}`,
    });
  }
  return list;
}

/** Các cặp lượt khác nhau ra cùng một tên file: [[a, b], ...]. */
export function findDuplicateFiles(list) {
  const seen = new Map();
  const dups = [];
  for (const item of list) {
    const first = seen.get(item.file);
    if (first) dups.push([first, item]);
    else seen.set(item.file, item);
  }
  return dups;
}

/** Ảnh Human of OSS: human-of-oss/{stt 2 chữ số}.jpg (đường dẫn từ public/images/). */
export function humanPhotoFile(stt) {
  return `human-of-oss/${String(stt).padStart(2, "0")}.jpg`;
}

/** Ảnh ban: ban/ban-{id}.jpg (đường dẫn từ public/images/). */
export function departmentPhotoFile(id) {
  return `ban/ban-${id}.jpg`;
}

/** Các `stt` bị trùng giữa các câu chuyện Human of OSS: [[a, b], ...]. */
export function findDuplicateStt(humans) {
  const seen = new Map();
  const dups = [];
  for (const h of humans) {
    const first = seen.get(h.stt);
    if (first) dups.push([first, h]);
    else seen.set(h.stt, h);
  }
  return dups;
}
