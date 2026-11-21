// Tìm kiếm không dấu dùng chung (hộp tìm kiếm trên header, ô tìm ở trang chủ OSSPEDIA).
// Chỉ tìm thí sinh OSS (`people`), các mùa giải và các trường.
import {
  EVENT_TYPE_LABEL,
  championsList,
  eventPath,
  eventTimeLabel,
  events,
  participationsOf,
  people,
  personPath,
  schoolName,
  schoolPath,
  schoolStat,
  schools,
  seasonPath,
  titlesOf,
} from "./data";
import type { EventType, Placement } from "../types";
import { normalize } from "./format";

export type SearchKind = "person" | "season" | "school" | "event";

export interface SearchResult {
  id: string;
  kind: SearchKind;
  to: string;
  title: string;
  subtitle: string;
  /** Loại sự kiện (chỉ kind "event"): để hiện icon loại */
  eventType?: EventType;
}

export interface SearchGroups {
  person: SearchResult[];
  season: SearchResult[];
  school: SearchResult[];
  event: SearchResult[];
}

export const SEARCH_GROUP_LABEL: Record<SearchKind, string> = {
  person: "Thí sinh",
  season: "Mùa giải",
  school: "Trường",
  event: "Sự kiện",
};

export const SEARCH_GROUP_ORDER: SearchKind[] = ["person", "season", "school", "event"];

/** Số dòng tối đa mỗi nhóm */
const LIMIT = 6;

const PLACEMENT_RANK: Record<Placement, number> = { "vo-dich": 0, "a-quan": 1, "giai-ba": 2 };

// Chỉ mục dựng sẵn 1 lần
const PEOPLE = people.map((p) => {
  const key = normalize(p.name);
  const seasons = participationsOf(p.id).map((s) => s.season);
  return {
    key,
    words: key.split(" "),
    /** Danh hiệu OSS cao nhất: 0 Quán quân, 1 Á quân, 2 Quý quân, 3 chưa có */
    titleRank: Math.min(3, ...titlesOf(p.id).map((t) => PLACEMENT_RANK[t.placement])),
    result: {
      id: p.id,
      kind: "person" as const,
      to: personPath(p.id),
      title: p.name,
      subtitle: [schoolName(p.school), seasons.length ? `Mùa ${seasons.join(", ")}` : ""].filter(Boolean).join(" · "),
    },
  };
});

const SEASONS = championsList().map(({ season: s, champions }) => ({
  n: s.season,
  result: {
    id: `mua-${s.season}`,
    kind: "season" as const,
    to: seasonPath(s.season),
    title: `Mùa ${s.season}`,
    subtitle: champions.length ? `Quán quân ${champions.map((c) => c.person.name).join(", ")}` : "Đang cập nhật",
  },
}));

const SCHOOLS = schools.map((s) => ({
  key: normalize(`${s.name} ${s.short}`),
  keyNoPrefix: normalize(s.name.replace(/^THPT\s+/i, "")),
  result: {
    id: s.id,
    kind: "school" as const,
    to: schoolPath(s.id),
    title: s.name,
    subtitle: `${schoolStat(s).people.length} thí sinh`,
  },
}));

const EVENTS = events.map((e) => ({
  key: normalize(`${e.name} ${e.shortName ?? ""} ${EVENT_TYPE_LABEL[e.type]}`),
  result: {
    id: e.id,
    kind: "event" as const,
    to: eventPath(e.id),
    title: e.name,
    subtitle: `Sự kiện · ${eventTimeLabel(e)}`,
    eventType: e.type,
  },
}));

/**
 * Tìm không dấu, chia 4 nhóm (mỗi nhóm tối đa 6 dòng):
 * - Thí sinh: tên chứa từ khóa. Xếp hạng: tên gọi (từ cuối) trùng từ khóa → có 1 từ trùng → có từ bắt đầu bằng
 *   từ khóa → chỉ chứa; cùng mức thì người có danh hiệu OSS cao hơn trước, rồi theo thứ tự ABC;
 * - Mùa giải: "mùa 4", "mua 4", "oss4", "4" → Mùa 4; gõ "mua" / "oss" → các mùa;
 * - Trường: tên hoặc chữ viết tắt chứa từ khóa;
 * - Sự kiện: tên, tên ngắn hoặc loại sự kiện chứa từ khóa (gõ số mùa ngắn như "4" thì không tìm sự kiện).
 */
export function searchAll(query: string): SearchGroups {
  const q = normalize(query).replace(/\s+/g, " ");
  if (!q) return { person: [], season: [], school: [], event: [] };

  const matchLevel = (p: (typeof PEOPLE)[number]) =>
    p.words[p.words.length - 1] === q ? 0 : p.words.includes(q) || ` ${p.key} `.includes(` ${q} `) ? 1 : ` ${p.key}`.includes(` ${q}`) ? 2 : 3;
  const person = PEOPLE.filter((p) => p.key.includes(q))
    .map((p, i) => ({ p, i, level: matchLevel(p) }))
    .sort((a, b) => a.level - b.level || a.p.titleRank - b.p.titleRank || a.i - b.i)
    .slice(0, LIMIT)
    .map((x) => x.p.result);

  const num = /^(?:mua|oss)?\s*(\d+)$/.exec(q);
  const season = num
    ? SEASONS.filter((s) => s.n === Number(num[1])).map((s) => s.result)
    : /^(mua|oss)$/.test(q)
      ? SEASONS.slice(0, LIMIT).map((s) => s.result)
      : [];

  const school = SCHOOLS.filter((s) => s.key.includes(q) || s.keyNoPrefix.includes(q))
    .slice(0, LIMIT)
    .map((s) => s.result);

  const event = num && q.length <= 2 ? [] : EVENTS.filter((e) => e.key.includes(q)).slice(0, LIMIT).map((e) => e.result);

  return { person, season, school, event };
}

/** Gộp các nhóm thành 1 danh sách theo thứ tự hiển thị (dùng cho phím ↑ ↓). */
export function flattenGroups(groups: SearchGroups) {
  return SEARCH_GROUP_ORDER.flatMap((k) => groups[k]);
}
