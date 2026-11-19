// Một cửa duy nhất để lấy dữ liệu. Các trang chỉ import từ đây,
// sau này đổi nguồn dữ liệu (JSON → Google Sheets/Supabase) chỉ cần sửa file này.
// Mọi số liệu tính được (quán quân, kỷ lục, thống kê...) đều TÍNH ở đây, không gõ tay.
import { hasImage } from "./images";
import { departmentPhotoFile, humanPhotoFile, personPhotoFiles } from "./photo-names";
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
import testimonialsJson from "../data/testimonials.json";
import partnersJson from "../data/partners.json";
import type {
  ContactPerson,
  Department,
  HumanStory,
  Match,
  MatchResult,
  Milestone,
  OlympiaPeriod,
  OlympiaRecord,
  Partner,
  Person,
  Placement,
  QualifyingEntry,
  School,
  Season,
  Stat,
  StatEntry,
  StatGroup,
  StatScope,
  Testimonial,
  TimelineItem,
} from "../types";

// ===== Dữ liệu gốc =====

export const site = siteJson;
export const schools = schoolsJson as School[];
/** Mở rộng chữ viết tắt tên vòng trong chữ nhập tay: "BK" → "Bán kết", "CK" → "Chung kết". */
function expandRoundAbbr(text: string) {
  return text.replace(/\bBK\b/g, "Bán kết").replace(/\bCK\b/g, "Chung kết");
}

export const seasons: Season[] = (seasonsJson as Season[])
  .map((s) => ({ ...s, hosts: s.hosts.map(expandRoundAbbr) }))
  .sort((a, b) => a.season - b.season);
export const qualifying = (qualifyingJson as QualifyingEntry[])
  .slice()
  .sort((a, b) => a.season - b.season || a.rank - b.rank);
export const matches = (matchesJson as Match[])
  .slice()
  .sort((a, b) => a.season - b.season || roundOrder(a) - roundOrder(b));
export const olympia = olympiaJson as OlympiaRecord[];
export const departments = departmentsJson as Department[];
export const contacts = contactsJson as ContactPerson[];
/** Câu chuyện Human of OSS, xếp theo `stt` tăng dần (stt trùng nhau thì build báo lỗi, xem scripts/gen-image-manifest.mjs). */
export const humans = (humansJson as HumanStory[]).slice().sort((a, b) => a.stt - b.stt);
/** Nhận xét (trang chủ), theo thứ tự trong file */
export const testimonials = testimonialsJson as Testimonial[];
/** Đối tác đồng hành (trang chủ) */
export const partners = partnersJson as Partner[];

/** Số ô ở trang Human of OSS (định nghĩa ở photo-names.js để script Node dùng chung). */
export { HUMAN_SLOTS } from "./photo-names";

/** Tên gọi (từ cuối) để xếp theo thứ tự ABC kiểu Việt Nam. */
function lastNameKey(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return `${parts[parts.length - 1]} ${fullName}`;
}

export function byVietnameseName(a: Person, b: Person) {
  return lastNameKey(a.name).localeCompare(lastNameKey(b.name), "vi");
}

/** Mọi người trong people.json (gồm cả người chỉ thi Đường lên đỉnh Olympia, không thi OSS). Chỉ dùng nội bộ. */
const allPeople: Person[] = (peopleJson as Person[]).slice().sort(byVietnameseName);

/** Thí sinh OSS = người có ít nhất 1 dòng trong qualifying.json. */
const ossIds = new Set(qualifying.map((q) => q.person));

export function isOssContestant(id: string) {
  return ossIds.has(id);
}

/** Thí sinh OSS (OSSPEDIA chỉ dùng danh sách này). */
export const people: Person[] = allPeople.filter((p) => ossIds.has(p.id));

function roundOrder(m: Match) {
  return m.round === "chung-ket" ? 100 : m.number;
}

// ===== Tra cứu =====

const peopleById = new Map(people.map((p) => [p.id, p]));
const allPeopleById = new Map(allPeople.map((p) => [p.id, p]));
const schoolsById = new Map(schools.map((s) => [s.id, s]));

/** Thí sinh OSS theo mã (người không thi OSS → undefined, nên hồ sơ ra 404). */
export function getPerson(id: string | undefined) {
  return id ? peopleById.get(id) : undefined;
}

export function personName(id: string) {
  return allPeopleById.get(id)?.name ?? id;
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

export const PLACEMENT_LABEL: Record<Placement, string> = {
  "vo-dich": "Quán quân",
  "a-quan": "Á quân",
  "giai-ba": "Quý quân",
};

/** Tên vòng đầy đủ (không viết tắt): không truyền trận = "Vòng loại"; "Bán kết 3"; "Chung kết". */
export function roundLabel(match?: Match) {
  if (!match) return "Vòng loại";
  return match.round === "chung-ket" ? "Chung kết" : `Bán kết ${match.number}`;
}

const SEMI_RESULT = ["Giải Nhất", "Giải Nhì", "Giải Ba", "Giải Ba"];

/**
 * Kết quả của một thí sinh ở một vòng:
 * - Vòng loại (không truyền trận): "Hạng {rank}";
 * - Bán kết: theo `rank` (đã tính sẵn đồng hạng, câu hỏi phụ): 1 → Giải Nhất, 2 → Giải Nhì, 3 hoặc 4 → Giải Ba;
 * - Chung kết: theo `placement` → Quán quân / Á quân / Quý quân.
 */
export function resultLabel(match: Match | undefined, entry: { rank: number; placement?: Placement }) {
  if (!match) return `Hạng ${entry.rank}`;
  if (match.round === "chung-ket") return entry.placement ? PLACEMENT_LABEL[entry.placement] : `Hạng ${entry.rank}`;
  return SEMI_RESULT[entry.rank - 1] ?? "Giải Ba";
}

// ===== Human of OSS: thông tin trong humans.json, nội dung trong src/content/human-of-oss/<slug>.md =====

// File bắt đầu bằng "_" (vd _mau.md) là file mẫu, không nạp
const humanBodies = import.meta.glob(["../content/human-of-oss/*.md", "!../content/human-of-oss/_*.md"], {
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

/**
 * Ảnh thí sinh theo quy ước `thi-sinh/s{mùa}-{slug họ tên}-{mã trường}.jpg` (mỗi lượt vào top 12 một ảnh;
 * người chỉ thi Đường lên đỉnh Olympia: `o{năm}-...`). Tên file tính ở photo-names.js (dùng chung với script Node).
 */
const photoFilesByPerson = new Map<string, ReturnType<typeof personPhotoFiles>>();
for (const f of personPhotoFiles({
  people: peopleJson as Person[],
  qualifying: qualifyingJson as QualifyingEntry[],
  olympia: olympiaJson as OlympiaRecord[],
  schools: schoolsJson as School[],
})) {
  photoFilesByPerson.set(f.personId, [...(photoFilesByPerson.get(f.personId) ?? []), f]);
}

/**
 * Danh sách ảnh ứng viên của một người, theo thứ tự ưu tiên, chỉ lấy ảnh có thật (ảnh mẫu không tính):
 * có `season` → ảnh đúng mùa đó, rồi các mùa khác (mới trước); không có → mùa mới nhất, rồi cũ hơn.
 * Người chỉ thi Đường lên đỉnh Olympia → ảnh `o…`. Không có ảnh nào → mảng rỗng (dùng ảnh giữ chỗ).
 */
export function personPhotos(personId: string, season?: number): string[] {
  const files = (photoFilesByPerson.get(personId) ?? []).slice().sort((a, b) => (b.season ?? 0) - (a.season ?? 0));
  if (season !== undefined) files.sort((a, b) => Number(b.season === season) - Number(a.season === season));
  return files.map((f) => `images/thi-sinh/${f.file}`).filter((p) => hasImage(p));
}

/** Ảnh đầu tiên có thật (xem `personPhotos`), hoặc undefined nếu chưa có ảnh. */
export function personPhoto(personId: string, season?: number): string | undefined {
  return personPhotos(personId, season)[0];
}

/** Ảnh đúng mùa đó (không lùi về mùa khác); dùng ở hồ sơ thí sinh khi chọn mùa. */
export function personSeasonPhoto(personId: string, season: number): string | undefined {
  const f = photoFilesByPerson.get(personId)?.find((x) => x.season === season);
  const path = f && `images/thi-sinh/${f.file}`;
  return path && hasImage(path) ? path : undefined;
}

export function milestonePhoto(date: string) {
  return `images/cot-moc/${date}.jpg`;
}

/** Ảnh ban: images/ban/ban-<id>.jpg (ngang 4:3), suy ra từ `id` ban. */
export function departmentPhoto(d: Department) {
  return `images/${departmentPhotoFile(d.id)}`;
}

/** Ảnh trận đấu: images/tran-dau/<id trận>.jpg (ngang 3:2). Trả về đường dẫn nếu có trong danh sách ảnh. */
export function matchPhoto(matchId: string) {
  const path = `images/tran-dau/${matchId}.jpg`;
  return hasImage(path) ? path : undefined;
}

/** Ảnh Chung kết của mùa n (images/tran-dau/oss{n}-ck.jpg) nếu có thật. */
export function finalPhoto(season: number) {
  const f = finalOf(season);
  return f ? matchPhoto(f.id) : undefined;
}

/** Mùa lớn nhất có ảnh Chung kết thật: lấy ảnh lớn trang chủ (undefined nếu chưa mùa nào có). */
export function heroSeason() {
  return seasons
    .map((x) => x.season)
    .sort((a, b) => b - a)
    .find((n) => !!finalPhoto(n));
}

/** Ảnh Human of OSS: images/human-of-oss/{stt 2 chữ số}.jpg */
export function humanPhoto(stt: number) {
  return `images/${humanPhotoFile(stt)}`;
}

export function testimonialPhoto(id: string) {
  return `images/nhan-xet/${id}.jpg`;
}

/** Logo đối tác: .svg rồi .png trong public/images/doi-tac/. */
export function partnerLogoCandidates(id: string) {
  return [`images/doi-tac/${id}.svg`, `images/doi-tac/${id}.png`];
}

/** Logo trường: thử lần lượt .svg rồi .png trong public/images/truong/. */
export function schoolLogoCandidates(id: string) {
  return [`images/truong/${id}.svg`, `images/truong/${id}.png`];
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

/** Mùa lớn nhất đã có trận Chung kết (khối "Mùa gần nhất" ở trang chủ). */
export function latestFinalSeason() {
  const n = Math.max(...matches.filter((m) => m.round === "chung-ket").map((m) => m.season));
  return Number.isFinite(n) ? getSeason(n) : undefined;
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

/** Thông tin cho thẻ xem nhanh thí sinh (rê chuột vào tên). Chỉ thí sinh OSS. */
export function personPreview(id: string) {
  const person = getPerson(id);
  if (!person) return undefined;
  const years = [...new Set(olympiaOf(id).map((r) => r.year))].sort((a, b) => a - b);
  return {
    person,
    school: schoolName(person.school),
    seasons: participationsOf(id).map((p) => p.season),
    /** Danh hiệu OSS cao nhất, vd "Quán quân mùa 9" (thứ tự Quán quân > Á quân > Quý quân) */
    topTitle: describeTitles(titlesOf(id))[0],
    olympiaYears: years,
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
  /** Tổng lượt vào top 12 của mọi trường (= số dòng qualifying.json). */
  totalTop12: number;
  /** Phần trăm lượt top 12 của trường trên tổng, làm tròn số nguyên. */
  share: number;
}

export function schoolStat(school: School): SchoolStat {
  const finals = matches.filter((m) => m.round === "chung-ket").flatMap((m) => m.results);
  const count = (p: Placement) => finals.filter((r) => r.school === school.id && r.placement === p).length;
  const top12 = qualifying.filter((q) => q.school === school.id).length;
  return {
    school,
    top12,
    totalTop12: qualifying.length,
    share: qualifying.length ? Math.round((top12 / qualifying.length) * 100) : 0,
    champions: count("vo-dich"),
    runnersUp: count("a-quan"),
    thirds: count("giai-ba"),
    people: people.filter((p) => p.school === school.id),
  };
}

/** Thống kê các trường: lượt top 12 giảm dần → số thí sinh giảm dần → tên trường. */
export function schoolStats() {
  return schools
    .map(schoolStat)
    .sort(
      (a, b) =>
        b.top12 - a.top12 || b.people.length - a.people.length || a.school.name.localeCompare(b.school.name, "vi"),
    );
}

/** Câu tổng quan trang Các trường: số thí sinh OSS, số trường có thí sinh, số mùa. */
export function schoolsOverview() {
  return {
    people: people.length,
    schools: new Set(people.map((p) => p.school)).size,
    seasons: seasons.length,
  };
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

/** Thí sinh có mặt ở Chung kết mùa n và mùa n+1 (kèm danh hiệu 2 mùa đó). */
export function consecutiveFinalists() {
  const finals = matches.filter((m) => m.round === "chung-ket");
  const out: { person: Person; entries: { season: number; placement?: Placement }[] }[] = [];
  finals.forEach((m) => {
    const next = finals.find((x) => x.season === m.season + 1);
    if (!next) return;
    m.results.forEach((r) => {
      const r2 = next.results.find((x) => x.person === r.person);
      if (!r2) return;
      out.push({
        person: getPerson(r.person)!,
        entries: [
          { season: m.season, placement: r.placement },
          { season: next.season, placement: r2.placement },
        ],
      });
    });
  });
  return out.sort((a, b) => a.entries[0].season - b.entries[0].season || byVietnameseName(a.person, b.person));
}

/** Quán quân gộp theo người (mỗi người 1 thẻ), xếp theo mùa vô địch đầu tiên. */
export function championCards() {
  const map = new Map<string, { person: Person; wins: { season: number; total: number | null }[] }>();
  championsList().forEach(({ season, champions }) =>
    champions.forEach((c) => {
      const e = map.get(c.person.id) ?? { person: c.person, wins: [] };
      e.wins.push({ season: season.season, total: c.result.total });
      map.set(c.person.id, e);
    }),
  );
  return [...map.values()];
}

/** Mốc của biểu đồ "Diễn biến điểm số" (trục ngang). */
export const CLIMB_STEPS = ["Xuất phát", "Khởi động", "Vượt chướng ngại vật", "Tăng tốc", "Về đích"] as const;

export interface ClimbLine {
  person: string;
  name: string;
  placement?: Placement;
  /** 5 điểm cộng dồn: 0 → kd → kd+vcnv → kd+vcnv+tt → total (null nếu thiếu dữ liệu) */
  points: (number | null)[];
  total: number | null;
}

/**
 * Điểm cộng dồn của từng thí sinh trong trận (dùng cho trận Chung kết).
 * Điểm cuối lấy đúng `total` trong dữ liệu (đã áp quy tắc tổng không âm). Ô null → mốc đó null.
 */
export function climbSeries(match: Match): ClimbLine[] {
  return match.results.map((r) => {
    const after = (vals: (number | null)[]) => (vals.some((v) => v === null) ? null : (vals as number[]).reduce((a, b) => a + b, 0));
    return {
      person: r.person,
      name: personName(r.person),
      placement: r.placement,
      points: [0, after([r.kd]), after([r.kd, r.vcnv]), after([r.kd, r.vcnv, r.tt]), r.total],
      total: r.total,
    };
  });
}

/** Câu hỏi phụ của trận: người thắng và những người bằng điểm với người đó. */
export function tiebreakInfo(match: Match) {
  const winner = match.results.find((r) => r.person === match.tiebreakWinner);
  if (!winner) return undefined;
  return {
    winner: winner.person,
    tiedWith: match.results.filter((r) => r.person !== winner.person && r.total === winner.total).map((r) => r.person),
  };
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

// ===== Đường lên đỉnh Olympia =====

/**
 * Dòng Đường lên đỉnh Olympia trong phạm vi:
 * - trường: "soc-son" = chỉ thí sinh THPT Sóc Sơn, "all" = mọi trường;
 * - thời gian: "oss" = từ OSS (ossSeason khác null, không beforeOss), "all" = toàn bộ.
 */
export function olympiaRows(school: StatScope = "all", period: OlympiaPeriod = "all") {
  return olympia.filter(
    (o) =>
      (school === "all" || allPeopleById.get(o.person)?.school === school) &&
      (period === "all" || (o.ossSeason !== null && !o.beforeOss)),
  );
}

/** Thí sinh Đường lên đỉnh Olympia trong phạm vi, xếp theo năm Olympia đầu tiên. `records` chỉ gồm các dòng trong phạm vi. */
export function olympiaPeople(school: StatScope = "all", period: OlympiaPeriod = "all") {
  const rows = olympiaRows(school, period);
  const ids = [...new Set(rows.map((o) => o.person))];
  return ids
    .map((id) => {
      const records = rows.filter((o) => o.person === id);
      const ossSeasons = olympiaOf(id).flatMap((r) => (r.ossSeason === null ? [] : [r.ossSeason]));
      const person = allPeopleById.get(id) ?? { id, name: id, school: "" };
      return {
        person,
        records,
        /** Các năm Olympia (năm thứ ...) trong phạm vi, tăng dần: thẻ ghi "Olympia năm thứ 17, 18". */
        years: [...new Set(records.map((r) => r.year))].sort((a, b) => a - b),
        ossSeason: ossSeasons.length ? Math.min(...ossSeasons) : null,
        isOss: ossIds.has(id),
      };
    })
    .sort((a, b) => a.years[0] - b.years[0] || (a.ossSeason ?? 0) - (b.ossSeason ?? 0) || byVietnameseName(a.person, b.person));
}

/** Các mùa OSS mà thí sinh dự thi (theo qualifying.json), tăng dần. Người không thi OSS → []. */
export function ossSeasonsOf(personId: string) {
  return [...new Set(qualifying.filter((q) => q.person === personId).map((q) => q.season))].sort((a, b) => a - b);
}

export function olympiaContestantCount(school: StatScope = "all", period: OlympiaPeriod = "all") {
  return new Set(olympiaRows(school, period).map((o) => o.person)).size;
}

/** Vòng nguyệt quế = số lần đạt "Giải Nhất". */
export function olympiaLaurelCount(school: StatScope = "all", period: OlympiaPeriod = "all") {
  return olympiaRows(school, period).filter((o) => o.result === "Giải Nhất").length;
}

/** Cầu truyền hình = số lần đạt "Giải Nhất" cuộc thi Quý. */
export function olympiaTvBridgeCount(school: StatScope = "all", period: OlympiaPeriod = "all") {
  return olympiaRows(school, period).filter((o) => o.stage === "quy" && o.result === "Giải Nhất").length;
}

// ===== Con số ấn tượng =====

// Con số Đường lên đỉnh Olympia ở trang Giới thiệu tính theo phạm vi "từ OSS".
const COMPUTED_STATS: Record<string, (scope: StatScope) => number> = {
  seasons: () => seasons.length,
  olympiaContestants: (scope) => olympiaContestantCount(scope, "oss"),
  olympiaLaurels: (scope) => olympiaLaurelCount(scope, "oss"),
  tvBridges: (scope) => olympiaTvBridgeCount(scope, "oss"),
};

export const stats: Stat[] = (statsJson as StatEntry[]).map((s) => {
  const compute = COMPUTED_STATS[s.key];
  const value = s.manual || !compute ? (s.value ?? "–") : String(compute(s.scope ?? "all"));
  return { key: s.key, value, label: s.label, icon: s.icon, group: s.group };
});

export const STAT_GROUPS: { id: StatGroup; label: string }[] = [
  { id: "oss", label: "Olympia Sóc Sơn" },
  { id: "soc-son-olympia", label: "Thí sinh OSS của THPT Sóc Sơn tại Đường lên đỉnh Olympia" },
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
