// Kiểm tra năm sinh suy ra từ dữ liệu OSS: năm đầu của schoolYear − khối (2 chữ số đầu của lớp) − 5.
// Một người ra 2 năm sinh khác nhau ở các mùa → in cảnh báo tên người đó (KHÔNG chặn build).
// Chạy tự động trước dev / build / typecheck (cùng gen-image-manifest.mjs).
import { read } from "./lib/read-data.mjs";

const seasons = new Map(read("seasons").map((s) => [s.season, Number(s.schoolYear.slice(0, 4))]));
const people = new Map(read("people").map((p) => [p.id, p.name]));
const years = new Map(); // person → Map(năm sinh → [mùa])
for (const q of read("qualifying")) {
  const grade = Number(/^\d{2}/.exec(q.class)?.[0]);
  const start = seasons.get(q.season);
  if (!grade || !start) continue;
  const y = start - grade - 5;
  const m = years.get(q.person) ?? new Map();
  m.set(y, [...(m.get(y) ?? []), q.season]);
  years.set(q.person, m);
}
for (const [id, m] of years) {
  if (m.size > 1) {
    const detail = [...m].map(([y, ss]) => `${y} (mùa ${ss.join(", ")})`).join(" / ");
    console.warn(`[nam-sinh] CẢNH BÁO: ${people.get(id) ?? id} ra nhiều năm sinh khác nhau: ${detail}`);
  }
}
