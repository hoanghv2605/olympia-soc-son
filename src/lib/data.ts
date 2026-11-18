// Một cửa duy nhất để lấy dữ liệu. Các trang chỉ import từ đây,
// sau này đổi nguồn dữ liệu (JSON → Google Sheets/Supabase) chỉ cần sửa file này.
// Mọi số liệu tính được (quán quân, kỷ lục, thống kê...) đều TÍNH ở đây, không gõ tay.
import siteJson from "../data/site.json";
import schoolsJson from "../data/schools.json";
import peopleJson from "../data/people.json";
import seasonsJson from "../data/seasons.json";
import qualifyingJson from "../data/qualifying.json";
import matchesJson from "../data/matches.json";
import olympiaJson from "../data/olympia.json";
import milestonesJson from "../data/milestones.json";
import statsJson from "../data/stats.json";
import departmentsJson from "../data/departments.json";
import contactsJson from "../data/contacts.json";
import humansJson from "../data/humans.json";
import { normalize } from "./format";
import type {
  ContactPerson,
  Department,
  HumanStory,
  Match,
  MatchResult,
  Milestone,
  OlympiaRecord,
  Person,
  Placement,
  QualifyingEntry,
  School,
  Season,
  Stat,
  StatEntry,
  StatGroup,
  StatScope,
  TimelineItem,
} from "../types";

// ===== Dữ liệu gốc =====

export const site = siteJson;
export const schools = schoolsJson as School[];
export const seasons: Season[] = (seasonsJson as Season[]).slice().sort((a, b) => a.season - b.season);
export const qualifying = (qualifyingJson as QualifyingEntry[])
  .slice()
  .sort((a, b) => a.season - b.season || a.rank - b.rank);
export const matches = (matchesJson as Match[])
  .slice()
  .sort((a, b) => a.season - b.season || roundOrder(a) - roundOrder(b));
export const olympia = olympiaJson as OlympiaRecord[];
export const departments = departmentsJson as Department[];
export const contacts = contactsJson as ContactPerson[];
export const humans = humansJson as HumanStory[];

/** Tên gọi (từ cuối) để xếp theo thứ tự ABC kiểu Việt Nam. */
function lastNameKey(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return `${parts[parts.length - 1]} ${fullName}`;
}

export function byVietnameseName(a: Person, b: Person) {
  return lastNameKey(a.name).localeCompare(lastNameKey(b.name), "vi");
}

export const people: Person[] = (peopleJson as Person[]).slice().sort(byVietnameseName);

function roundOrder(m: Match) {
  return m.round === "chung-ket" ? 100 : m.number;
}

// ===== Tra cứu =====

const peopleById = new Map(people.map((p) => [p.id, p]));
const schoolsById = new Map(schools.map((s) => [s.id, s]));

export function getPerson(id: string | undefined) {
  return id ? peopleById.get(id) : undefined;
}

export function personName(id: string) {
  return peopleById.get(id)?.name ?? id;
}

export function getSchool(id: string | undefined) {
  return id ? schoolsById.get(id) : undefined;
}

export function schoolName(id: string) {
  return schoolsById.get(id)?.name ?? id;
}

export function getSeason(n: number) {
  return seasons.find((s) => s.season === n);
}

export function seasonSlug(n: number) {
  return `mua-${n}`;
}

export function seasonPath(n: number) {
  return `/wiki/cuoc-thi/${seasonSlug(n)}`;
}

export function personPath(id: string) {
  return `/wiki/thi-sinh/${id}`;
}

export function schoolPath(id: string) {
  return `/wiki/truong/${id}`;
}

/** Nhóm hạt giống theo hạng vòng loại: 1–3 → 1, 4–6 → 2, 7–9 → 3, 10–12 → 4. */
export function seedGroup(rank: number) {
  return Math.ceil(rank / 3);
}

/** "BK1", "BK2", "CK" */
export function matchShortLabel(m: Match) {
  return m.round === "chung-ket" ? "CK" : `BK${m.number}`;
}

/** "Bán kết 1", "Chung kết" */
export function matchLabel(m: Match) {
  return m.round === "chung-ket" ? "Chung kết" : `Bán kết ${m.number}`;
}

export const PLACEMENT_LABEL: Record<Placement, string> = {
  "vo-dich": "Quán quân",
  "a-quan": "Á quân",
  "giai-ba": "Quý quân",
};

// ===== Human of OSS: thông tin trong humans.json, nội dung trong src/content/human-of-oss/<slug>.md =====

const humanBodies = import.meta.glob("../content/human-of-oss/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Bài viết Human of OSS kèm nội dung markdown (chuỗi rỗng nếu chưa có file .md). */
export function getHuman(slug: string | undefined) {
  const story = humans.find((h) => h.slug === slug);
  if (!story) return undefined;
  return { ...story, body: humanBodies[`../content/human-of-oss/${story.slug}.md`] ?? "" };
}

export function humanPath(slug: string) {
  return `/human-of-oss/${slug}`;
}

// ===== Ảnh theo quy ước tên file (không khai báo trong JSON) =====

export function personPhoto(id: string) {
  return `images/thi-sinh/${id}.jpg`;
}

export function milestonePhoto(date: string) {
  return `images/cot-moc/${date}.jpg`;
}

export function humanPhoto(slug: string) {
  return `images/human-of-oss/${slug}.jpg`;
}

// ===== Theo mùa =====

export function qualifyingOf(season: number) {
  return qualifying.filter((q) => q.season === season);
}

export function semifinalsOf(season: number) {
  return matches.filter((m) => m.season === season && m.round === "ban-ket");
}

export function finalOf(season: number) {
  return matches.find((m) => m.season === season && m.round === "chung-ket");
}

export interface PlacedResult {
  person: Person;
  result: MatchResult;
}

function placed(match: Match | undefined, placement: Placement): PlacedResult[] {
  if (!match) return [];
  return match.results
    .filter((r) => r.placement === placement)
    .sort((a, b) => a.rank - b.rank || (b.total ?? -1) - (a.total ?? -1))
    .map((r) => ({ person: getPerson(r.person) ?? { id: r.person, name: r.person, school: r.school }, result: r }));
}

/** Quán quân / Á quân / Quý quân của một mùa, lấy từ `placement` trận Chung kết (mảng vì có thể đồng hạng). */
export function podium(season: number) {
  const final = finalOf(season);
  return {
    champions: placed(final, "vo-dich"),
    runnersUp: placed(final, "a-quan"),
    thirds: placed(final, "giai-ba"),
  };
}

/** Quán quân từng mùa, dùng cho Trang chủ, Bảng vàng, danh sách mùa. */
export function championsList() {
  return seasons.map((s) => ({ season: s, ...podium(s.season) }));
}

// ===== Thí sinh =====

export interface SeasonParticipation {
  season: number;
  qualifying?: QualifyingEntry;
  matches: { match: Match; result: MatchResult }[];
}

export interface Title {
  season: number;
  placement: Placement;
}

export function participationsOf(personId: string): SeasonParticipation[] {
  const seasonNums = new Set<number>();
  qualifying.forEach((q) => q.person === personId && seasonNums.add(q.season));
  matches.forEach((m) => m.results.some((r) => r.person === personId) && seasonNums.add(m.season));
  return [...seasonNums]
    .sort((a, b) => a - b)
    .map((season) => ({
      season,
      qualifying: qualifying.find((q) => q.season === season && q.person === personId),
      matches: matches
        .filter((m) => m.season === season)
        .flatMap((match) => {
          const result = match.results.find((r) => r.person === personId);
          return result ? [{ match, result }] : [];
        }),
    }));
}

/** Danh hiệu OSS (từ trận Chung kết). */
export function titlesOf(personId: string): Title[] {
  return matches.flatMap((m) => {
    if (m.round !== "chung-ket") return [];
    const r = m.results.find((x) => x.person === personId);
    return r?.placement ? [{ season: m.season, placement: r.placement }] : [];
  });
}

export function olympiaOf(personId: string) {
  return olympia.filter((o) => o.person === personId);
}

export function personProfile(id: string | undefined) {
  const person = getPerson(id);
  if (!person) return undefined;
  return {
    person,
    school: getSchool(person.school),
    participations: participationsOf(person.id),
    titles: titlesOf(person.id),
    olympia: olympiaOf(person.id),
    timeline: toTimeline(milestones.filter((m) => m.person === person.id)),
  };
}

/** "Quán quân mùa 5, 6" ... gộp danh hiệu theo loại. */
export function describeTitles(titles: Title[]) {
  return (Object.keys(PLACEMENT_LABEL) as Placement[]).flatMap((p) => {
    const ss = titles.filter((t) => t.placement === p).map((t) => t.season);
    return ss.length ? [`${PLACEMENT_LABEL[p]} mùa ${ss.join(", ")}`] : [];
  });
}

// ===== Trường =====

export interface SchoolStat {
  school: School;
  top12: number;
  champions: number;
  runnersUp: number;
  thirds: number;
  people: Person[];
}

export function schoolStat(school: School): SchoolStat {
  const finals = matches.filter((m) => m.round === "chung-ket").flatMap((m) => m.results);
  const count = (p: Placement) => finals.filter((r) => r.school === school.id && r.placement === p).length;
  return {
    school,
    top12: qualifying.filter((q) => q.school === school.id).length,
    champions: count("vo-dich"),
    runnersUp: count("a-quan"),
    thirds: count("giai-ba"),
    people: people.filter((p) => p.school === school.id),
  };
}

export function schoolStats() {
  return schools
    .map(schoolStat)
    .sort((a, b) => b.champions - a.champions || b.top12 - a.top12);
}

// ===== Kỷ lục =====

export type RecordField = "vl" | "kd" | "vcnv" | "tt" | "vd" | "total";

export const RECORD_LABEL: Record<RecordField, string> = {
  vl: "Vòng loại",
  kd: "Khởi động",
  vcnv: "Vượt chướng ngại vật",
  tt: "Tăng tốc",
  vd: "Về đích",
  total: "Tổng điểm",
};

export interface RecordRow {
  person: Person;
  season: number;
  match?: Match;
  value: number;
  /** Hạng kiểu Olympic (1-1-3): bằng điểm cùng hạng, người tiếp theo nhảy hạng. */
  rank: number;
}

/**
 * Bảng xếp hạng một chỉ số: lấy mọi dòng có điểm ≥ điểm của dòng thứ n
 * (top n + những người bằng điểm hạng n). Bỏ qua ô null.
 */
export function topRecords(field: RecordField, n = 10): RecordRow[] {
  const rows: Omit<RecordRow, "rank">[] =
    field === "vl"
      ? qualifying.flatMap((q) =>
          q.score === null ? [] : [{ person: getPerson(q.person)!, season: q.season, value: q.score }],
        )
      : matches.flatMap((m) =>
          m.results.flatMap((r) => {
            const value = r[field];
            return value === null ? [] : [{ person: getPerson(r.person)!, season: m.season, match: m, value }];
          }),
        );
  rows.sort((a, b) => b.value - a.value || a.season - b.season);
  const threshold = rows.length > n ? rows[n - 1].value : -Infinity;
  return rows
    .filter((r) => r.value >= threshold)
    .map((r) => ({ ...r, rank: 1 + rows.filter((x) => x.value > r.value).length }));
}

/** Thí sinh vào Chung kết ít nhất `min` lần. */
export function multipleFinalists(min = 2) {
  const map = new Map<string, number[]>();
  matches
    .filter((m) => m.round === "chung-ket")
    .forEach((m) => m.results.forEach((r) => map.set(r.person, [...(map.get(r.person) ?? []), m.season])));
  return [...map.entries()]
    .filter(([, ss]) => ss.length >= min)
    .map(([id, ss]) => ({ person: getPerson(id)!, seasons: ss.sort((a, b) => a - b) }))
    .sort((a, b) => a.seasons[0] - b.seasons[0] || byVietnameseName(a.person, b.person));
}

/** Thí sinh bảo vệ thành công ngôi Quán quân (Quán quân hai mùa liền nhau). */
export function defendingChampions() {
  const list = championsList();
  const out: { person: Person; seasons: [number, number] }[] = [];
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1];
    const cur = list[i];
    if (cur.season.season !== prev.season.season + 1) continue;
    cur.champions.forEach((c) => {
      if (prev.champions.some((p) => p.person.id === c.person.id)) {
        out.push({ person: c.person, seasons: [prev.season.season, cur.season.season] });
      }
    });
  }
  return out;
}

// ===== OSS tại Đường lên đỉnh Olympia =====

function inScope(personId: string, scope: StatScope) {
  return scope === "all" || getPerson(personId)?.school === scope;
}

/** Cựu thí sinh OSS tham gia ĐLĐO, xếp theo mùa OSS. */
export function olympiaPeople(scope: StatScope = "all") {
  const ids: string[] = [];
  olympia.forEach((o) => !ids.includes(o.person) && inScope(o.person, scope) && ids.push(o.person));
  return ids
    .map((id) => {
      const records = olympiaOf(id);
      return { person: getPerson(id)!, records, ossSeason: Math.min(...records.map((r) => r.ossSeason)) };
    })
    .sort((a, b) => a.ossSeason - b.ossSeason);
}

const STAGE_LEVEL: Record<OlympiaRecord["stage"], number> = { tuan: 1, thang: 2, quy: 3, nam: 4 };
const RESULT_LEVEL: Record<string, number> = { "Giải Nhất": 3, "Giải Nhì": 2, "Giải Ba": 1, "Quý quân": 1 };

/** Thành tích cao nhất: vòng cao hơn trước (Chung kết năm > Quý > Tháng > Tuần), cùng vòng thì Nhất > Nhì > Ba/Quý quân. */
export function bestOlympiaRecord(records: OlympiaRecord[]) {
  return records
    .slice()
    .sort(
      (a, b) =>
        STAGE_LEVEL[b.stage] - STAGE_LEVEL[a.stage] || (RESULT_LEVEL[b.result] ?? 0) - (RESULT_LEVEL[a.result] ?? 0),
    )[0];
}

/** "Quý quân Chung kết năm, năm thứ 23" */
export function describeOlympiaRecord(r: OlympiaRecord) {
  return `${r.result} ${r.round}, năm thứ ${r.year}`;
}

export function olympiaContestantCount(scope: StatScope = "all") {
  return olympiaPeople(scope).length;
}

/** Vòng nguyệt quế = số lần đạt "Giải Nhất". */
export function olympiaLaurelCount(scope: StatScope = "all") {
  return olympia.filter((o) => o.result === "Giải Nhất" && inScope(o.person, scope)).length;
}

// ===== Con số ấn tượng =====

const COMPUTED_STATS: Record<string, (scope: StatScope) => number> = {
  seasons: () => seasons.length,
  olympiaContestants: olympiaContestantCount,
  olympiaLaurels: olympiaLaurelCount,
};

export const stats: Stat[] = (statsJson as StatEntry[]).map((s) => {
  const compute = COMPUTED_STATS[s.key];
  const value = s.manual || !compute ? (s.value ?? "–") : String(compute(s.scope ?? "all"));
  return { key: s.key, value, label: s.label, icon: s.icon, group: s.group };
});

export const STAT_GROUPS: { id: StatGroup; label: string }[] = [
  { id: "oss", label: "Olympia Sóc Sơn" },
  { id: "soc-son-olympia", label: "THPT Sóc Sơn tại Đường lên đỉnh Olympia" },
];

/** Con số ấn tượng chia theo nhóm (theo thứ tự STAT_GROUPS). */
export function statGroups() {
  return STAT_GROUPS.map((g) => ({ ...g, stats: stats.filter((s) => s.group === g.id) })).filter((g) => g.stats.length);
}

// ===== Dòng thời gian =====

export const milestones: Milestone[] = (milestonesJson as Milestone[])
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date));

export function toTimeline(list: Milestone[]): TimelineItem[] {
  return list.map(({ person, ...rest }) => ({
    ...rest,
    personId: person && getPerson(person) ? person : undefined,
    personName: person ? personName(person) : undefined,
  }));
}

export const timeline = toTimeline(milestones);

// ===== Tìm kiếm OSSPEDIA =====

export interface SearchEntry {
  to: string;
  title: string;
  subtitle: string;
  kind: "season" | "person" | "school";
  key: string;
}

export const searchIndex: SearchEntry[] = [
  ...championsList().map(({ season: s, champions }) => {
    const champ = champions.map((c) => c.person.name).join(", ");
    return {
      to: seasonPath(s.season),
      title: `Olympia Sóc Sơn mùa ${s.season}`,
      subtitle: `Năm học ${s.schoolYear}${champ ? `. Quán quân: ${champ}` : ""}`,
      kind: "season" as const,
      key: normalize(`mua ${s.season} ${s.code} olympia soc son ${s.schoolYear} ${champ}`),
    };
  }),
  ...people.map((p) => {
    const titles = describeTitles(titlesOf(p.id));
    return {
      to: personPath(p.id),
      title: p.name,
      subtitle: [schoolName(p.school), ...titles].join(" · "),
      kind: "person" as const,
      key: normalize(p.name),
    };
  }),
  ...schools.map((s) => ({
    to: schoolPath(s.id),
    title: s.name,
    subtitle: "Trường",
    kind: "school" as const,
    key: normalize(`truong ${s.name} ${s.short}`),
  })),
];

export function search(query: string) {
  const q = normalize(query);
  return q ? searchIndex.filter((r) => r.key.includes(q)) : [];
}
