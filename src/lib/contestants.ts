// Lọc / sắp xếp danh sách thí sinh OSSPEDIA (thuần hàm, không phụ thuộc giao diện).
// Mọi dữ liệu lấy qua data.ts. Giá trị lọc và sắp xếp lưu trên địa chỉ trang (query), xem ContestantList.
import { getSchool, participationsOf, people, PLACEMENT_LABEL } from "./data";
import { normalize } from "./format";
import type { Person, Placement, School } from "../types";

export type PrizeFilter = "quan-quan" | "a-quan" | "quy-quan" | "top-12";
export type SortKey = "ten" | "thanh-tich" | "mua";

export const PRIZE_PLACEMENT: Record<Exclude<PrizeFilter, "top-12">, Placement> = {
  "quan-quan": "vo-dich",
  "a-quan": "a-quan",
  "quy-quan": "giai-ba",
};
export const PRIZE_LABEL: Record<PrizeFilter, string> = {
  "quan-quan": "Quán quân",
  "a-quan": "Á quân",
  "quy-quan": "Quý quân",
  "top-12": "Top 12 (không vào Chung kết)",
};
export const SORT_LABEL: Record<SortKey, string> = { ten: "Tên A–Z", "thanh-tich": "Thành tích", mua: "Mùa" };

export interface Filters {
  q: string;
  truong: string; // id trường, "" = tất cả
  mua: number | null;
  giai: PrizeFilter | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = { q: "", truong: "", mua: null, giai: null, sort: "ten" };

/** Kết quả của 1 thí sinh trong 1 mùa. */
interface SeasonRow {
  season: number;
  qualRank: number | null;
  semiRank: number | null; // rank nhỏ nhất ở Bán kết
  placement: Placement | null; // danh hiệu ở Chung kết
  inFinal: boolean;
}

export interface Row {
  person: Person;
  school: School | undefined;
  key: string; // tên không dấu để tìm
  nameKey: string[]; // tên (từ cuối) rồi tên đệm, họ (đọc ngược) — để so sánh kiểu Việt Nam
  seasons: SeasonRow[];
}

export const ROWS: Row[] = people.map((p) => ({
  person: p,
  school: getSchool(p.school),
  key: normalize(p.name),
  nameKey: p.name.trim().split(/\s+/).reverse(),
  seasons: participationsOf(p.id).map((s) => {
    const semis = s.matches.filter((m) => m.match.round === "ban-ket");
    const final = s.matches.find((m) => m.match.round === "chung-ket");
    return {
      season: s.season,
      qualRank: s.qualifying?.rank ?? null,
      semiRank: semis.length ? Math.min(...semis.map((m) => m.result.rank)) : null,
      placement: final?.result.placement ?? null,
      inFinal: !!final,
    };
  }),
}));

const collator = new Intl.Collator("vi");

/** Tên A–Z kiểu Việt Nam: so tên, rồi tên đệm và họ (đọc ngược từ cuối lên đầu); trùng hoàn toàn thì theo mùa đầu tiên. */
export function compareName(a: Row, b: Row) {
  const n = Math.max(a.nameKey.length, b.nameKey.length);
  for (let i = 0; i < n; i++) {
    const c = collator.compare(a.nameKey[i] ?? "", b.nameKey[i] ?? "");
    if (c) return c;
  }
  return (a.seasons[0]?.season ?? 0) - (b.seasons[0]?.season ?? 0);
}

/** Các mùa tính đến khi so sánh: chỉ mùa n nếu đang chọn Mùa n. */
function scoped(r: Row, mua: number | null) {
  return mua === null ? r.seasons : r.seasons.filter((s) => s.season === mua);
}

export function matchesFilters(r: Row, f: Filters) {
  if (f.q && !r.key.includes(normalize(f.q))) return false;
  if (f.truong && r.person.school !== f.truong) return false;
  const list = scoped(r, f.mua);
  if (f.mua !== null && list.length === 0) return false;
  if (!f.giai) return true;
  if (f.giai === "top-12") return f.mua === null ? !r.seasons.some((s) => s.inFinal) : list.some((s) => !s.inFinal);
  const placement = PRIZE_PLACEMENT[f.giai];
  return list.some((s) => s.placement === placement);
}

const INF = Number.POSITIVE_INFINITY;
const count = (list: SeasonRow[], p: Placement) => list.filter((s) => s.placement === p).length;
const best = (list: SeasonRow[], pick: (s: SeasonRow) => number | null) =>
  Math.min(INF, ...list.map((s) => pick(s) ?? INF));

export function sortRows(rows: Row[], f: Filters) {
  const out = rows.slice();
  if (f.sort === "thanh-tich") {
    out.sort((a, b) => {
      const A = scoped(a, f.mua);
      const B = scoped(b, f.mua);
      for (const p of ["vo-dich", "a-quan", "giai-ba"] as const) {
        const d = count(B, p) - count(A, p);
        if (d) return d;
      }
      const sa = best(A, (s) => s.semiRank);
      const sb = best(B, (s) => s.semiRank);
      if (sa !== sb) return sa < sb ? -1 : 1;
      const qa = best(A, (s) => s.qualRank);
      const qb = best(B, (s) => s.qualRank);
      if (qa !== qb) return qa < qb ? -1 : 1;
      return compareName(a, b);
    });
  } else if (f.sort === "mua") {
    const first = (r: Row) => scoped(r, f.mua)[0];
    out.sort((a, b) => {
      const A = first(a);
      const B = first(b);
      const d = (A?.season ?? INF) - (B?.season ?? INF);
      if (d) return d;
      const qa = A?.qualRank ?? INF;
      const qb = B?.qualRank ?? INF;
      return qa !== qb ? (qa < qb ? -1 : 1) : compareName(a, b);
    });
  } else {
    out.sort(compareName);
  }
  return out;
}

/** Danh hiệu cao nhất để hiện trên thẻ (trong mùa đang lọc nếu có), null = chỉ Top 12. */
export function topTitle(r: Row, mua: number | null): { placement: Placement; label: string } | null {
  const list = scoped(r, mua);
  for (const p of ["vo-dich", "a-quan", "giai-ba"] as const) {
    if (count(list, p)) return { placement: p, label: PLACEMENT_LABEL[p] };
  }
  return null;
}

export function applyFilters(f: Filters) {
  return sortRows(ROWS.filter((r) => matchesFilters(r, f)), f);
}

// ----- đọc / ghi query của địa chỉ -----
const PRIZES = Object.keys(PRIZE_LABEL) as PrizeFilter[];
const SORTS = Object.keys(SORT_LABEL) as SortKey[];

export function filtersFromParams(p: URLSearchParams): Filters {
  const mua = Number(p.get("mua"));
  const giai = p.get("giai") as PrizeFilter | null;
  const sort = p.get("sap-xep") as SortKey | null;
  return {
    q: p.get("q") ?? "",
    truong: p.get("truong") ?? "",
    mua: Number.isInteger(mua) && mua > 0 ? mua : null,
    giai: giai && PRIZES.includes(giai) ? giai : null,
    sort: sort && SORTS.includes(sort) ? sort : "ten",
  };
}

/** Chỉ ghi giá trị khác mặc định. */
export function paramsFromFilters(f: Filters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.truong) p.set("truong", f.truong);
  if (f.mua !== null) p.set("mua", String(f.mua));
  if (f.giai) p.set("giai", f.giai);
  if (f.sort !== "ten") p.set("sap-xep", f.sort);
  return p;
}

export function activeFilterCount(f: Filters) {
  return (f.truong ? 1 : 0) + (f.mua !== null ? 1 : 0) + (f.giai ? 1 : 0);
}
