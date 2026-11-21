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
 * - "oss": mỗi dòng qualifying.json (mỗi lượt vào top 12): s{mùa}-{slug họ tên}-{mã trường của dòng đó}.jpg
 * - "olympia": mỗi (người, năm Olympia) trong olympia.json: o{năm}-{slug}-{mã trường (people.json)}.jpg
 *   (gồm cả người OSS có tham gia Đường lên đỉnh Olympia và người chỉ thi Đường lên đỉnh Olympia)
 * - "win": ảnh Quán quân dùng ở Hall of Fame, mỗi Quán quân một ảnh của mùa vô địch gần nhất:
 *   s{mùa}-{slug}-{mã trường}-win.jpg (cần truyền `matches`)
 */
export function personPhotoFiles({ people, qualifying, olympia, schools, matches = [] }) {
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

  const seen = new Set();
  for (const o of olympia) {
    const key = `${o.person}|${o.year}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const school = people.find((p) => p.id === o.person)?.school ?? "";
    list.push({
      file: `o${o.year}-${slugify(nameOf(o.person))}-${schoolCode(schools, school)}.jpg`,
      personId: o.person,
      kind: "olympia",
      year: o.year,
      label: `${nameOf(o.person)} · Olympia năm thứ ${o.year}`,
    });
  }

  // Quán quân: mùa vô địch gần nhất của từng người
  const latestWin = new Map(); // person → { season, school }
  for (const m of matches) {
    if (m.round !== "chung-ket") continue;
    for (const r of m.results) {
      if (r.placement !== "vo-dich") continue;
      const cur = latestWin.get(r.person);
      if (!cur || m.season > cur.season) latestWin.set(r.person, { season: m.season, school: r.school });
    }
  }
  for (const [person, { season, school }] of latestWin) {
    const row = qualifying.find((q) => q.person === person && q.season === season);
    list.push({
      file: `s${season}-${slugify(nameOf(person))}-${schoolCode(schools, row?.school ?? school)}-win.jpg`,
      personId: person,
      kind: "win",
      season,
      label: `${nameOf(person)} · Quán quân mùa ${season} (ảnh Hall of Fame)`,
    });
  }
  return list;
}

/**
 * Ảnh người chơi tại sự kiện: thi-sinh/{photoKey}-{slug họ tên}-{mã trường}.jpg, chỉ cho người chơi có `school`
 * thuộc schools.json (trường ngoài thì không có ảnh theo quy ước). `participant` = vị trí trong `participants`.
 */
export function eventPhotoFiles(events, schools) {
  const list = [];
  for (const e of events) {
    if (!e.photoKey) continue;
    (e.participants ?? []).forEach((p, index) => {
      if (!p.school || !schools.some((s) => s.id === p.school)) return;
      list.push({
        file: `${e.photoKey}-${slugify(p.name)}-${schoolCode(schools, p.school)}.jpg`,
        personId: p.person,
        kind: "event",
        eventId: e.id,
        participant: index,
        label: `${p.name} · ${e.shortName ?? e.name}`,
      });
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
