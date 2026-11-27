// "Bạn có biết?" ở trang chủ: MỌI câu đều tự sinh từ dữ liệu (không gõ tay số liệu).
// Thêm loại câu mới: viết 1 hàm trả về Fact[] rồi thêm vào danh sách trong buildFacts().
import {
  RECORD_FIELDS,
  RECORD_LABEL,
  climbSeries,
  defendingChampions,
  finalOf,
  genderFunnel,
  getSchool,
  matchPath,
  matches,
  olympiaTvBridgeCount,
  personName,
  personPath,
  qualifying,
  registrationOverview,
  registrations,
  roundLabel,
  schoolStat,
  seasonPath,
  seasons,
  tiebreakInfo,
  topRecords,
  type RecordRow,
} from "./data";
import { formatDecimalVi, joinViText, percent } from "./format";

export interface Fact {
  id: string;
  text: string;
  /** Trang liên quan cho link "Xem chi tiết" */
  to: string;
}

/** "(Mùa 6, Chung kết)" */
function recordContext(r: RecordRow) {
  return `Mùa ${r.season}, ${roundLabel(r.match)}`;
}

/** Kỷ lục: "Kỷ lục điểm Khởi động là 120, thuộc về A (Mùa 6, Chung kết)." (6 câu) */
function recordFacts(): Fact[] {
  return RECORD_FIELDS.flatMap((field) => {
    const holders = topRecords(field, 10).filter((r) => r.rank === 1);
    if (!holders.length) return [];
    const subject = field === "total" ? "Kỷ lục tổng điểm một trận" : `Kỷ lục điểm ${RECORD_LABEL[field]}`;
    const who = joinViText(holders.map((h) => `${h.person.name} (${recordContext(h)})`));
    const owner = holders.length > 1 ? `cùng thuộc về ${who}` : `thuộc về ${who}`;
    return [{ id: `record-${field}`, text: `${subject} là ${holders[0].value}, ${owner}.`, to: "/bang-vang" }];
  });
}

/** Lội ngược dòng: người dẫn đầu sau Tăng tốc không phải Quán quân. */
function comebackFacts(): Fact[] {
  return seasons.flatMap((s) => {
    const final = finalOf(s.season);
    if (!final) return [];
    const lines = climbSeries(final);
    const afterTT = lines.filter((l) => l.points[3] !== null);
    if (!afterTT.length) return [];
    const top = Math.max(...afterTT.map((l) => l.points[3] as number));
    const leaders = afterTT.filter((l) => l.points[3] === top);
    const champions = lines.filter((l) => l.placement === "vo-dich");
    if (!champions.length || champions.some((c) => leaders.includes(c))) return [];
    const lead =
      leaders.length > 1
        ? `${joinViText(leaders.map((l) => l.name))} cùng dẫn đầu sau Tăng tốc với ${top} điểm`
        : `${leaders[0].name} dẫn đầu sau Tăng tốc với ${top} điểm`;
    const champ = champions[0];
    return [
      {
        id: `comeback-${s.season}`,
        text: `Ở Chung kết mùa ${s.season}, ${lead}, nhưng ${joinViText(champions.map((c) => c.name))} vượt lên ở Về đích và vô địch với ${champ.total} điểm.`,
        to: seasonPath(s.season),
      },
    ];
  });
}

/** Câu hỏi phụ: "Ở Bán kết 2 mùa 7, A và B cùng có 140 điểm; A giành chiến thắng ở câu hỏi phụ." */
function tiebreakFacts(): Fact[] {
  return matches.flatMap((m) => {
    const t = tiebreakInfo(m);
    if (!t || !t.tiedWith.length) return [];
    const total = m.results.find((r) => r.person === t.winner)?.total;
    const names = joinViText([t.winner, ...t.tiedWith].map(personName));
    return [
      {
        id: `tiebreak-${m.id}`,
        text: `Ở ${roundLabel(m)} mùa ${m.season}, ${names} cùng có ${total} điểm; ${personName(t.winner)} giành chiến thắng ở câu hỏi phụ.`,
        to: seasonPath(m.season),
      },
    ];
  });
}

/** Vô địch liên tiếp. */
function defendingFacts(): Fact[] {
  return defendingChampions().map((d) => ({
    id: `defend-${d.person.id}-${d.seasons[0]}`,
    text: `${d.person.name} vô địch 2 mùa liên tiếp: Mùa ${d.seasons[0]} và Mùa ${d.seasons[1]}.`,
    to: personPath(d.person.id),
  }));
}

/**
 * Cách biệt Chung kết (điểm Quán quân – điểm cao nhất còn lại): trận hòa điểm (phân định bằng câu hỏi phụ),
 * cách biệt lớn nhất và trận phân định bằng tổng điểm sát nút nhất (chỉ xét trận không hòa).
 */
function marginFacts(): Fact[] {
  const rows = seasons.flatMap((s) => {
    const final = finalOf(s.season);
    if (!final) return [];
    const champ = final.results.find((r) => r.placement === "vo-dich" && r.total !== null);
    const others = final.results.filter((r) => r !== champ && r.total !== null);
    if (!champ || !others.length) return [];
    const best = Math.max(...others.map((r) => r.total as number));
    const seconds = others.filter((r) => r.total === best);
    return [{ season: s.season, champ, best, seconds, margin: (champ.total as number) - best }];
  });
  type Row = (typeof rows)[number];
  const secondNames = (r: Row) => joinViText(r.seconds.map((x) => personName(x.person)));
  const out: Fact[] = [];

  const tied = rows.filter((r) => r.margin === 0);
  const which = tied.length === 1 ? "trận Chung kết duy nhất" : `một trong ${tied.length} trận Chung kết`;
  for (const r of tied) {
    out.push({
      id: `final-tie-${r.season}`,
      text: `Chung kết mùa ${r.season} là ${which} hòa điểm (${r.champ.total}–${r.best}): ${personName(r.champ.person)} thắng ${secondNames(r)} ở câu hỏi phụ.`,
      to: seasonPath(r.season),
    });
  }

  const positive = rows.filter((r) => r.margin > 0);
  if (!positive.length) return out;
  const max = positive.reduce((a, b) => (b.margin > a.margin ? b : a));
  const min = positive.reduce((a, b) => (b.margin < a.margin ? b : a));
  out.push({
    id: "margin-max",
    text: `Cách biệt lớn nhất ở một trận Chung kết là ${max.margin} điểm: ${personName(max.champ.person)} ${max.champ.total} – ${secondNames(max)} ${max.best} (Mùa ${max.season}).`,
    to: seasonPath(max.season),
  });
  if (min !== max) {
    out.push({
      id: "margin-min",
      text: `Trận Chung kết được phân định bằng tổng điểm sát nút nhất là mùa ${min.season}: ${personName(min.champ.person)} hơn ${secondNames(min)} ${min.margin} điểm (${min.champ.total}–${min.best}).`,
      to: seasonPath(min.season),
    });
  }
  return out;
}

/** Trường: THPT Sóc Sơn chiếm bao nhiêu % lượt vào top 12. */
function schoolFacts(): Fact[] {
  const school = getSchool("soc-son");
  if (!school) return [];
  const stat = schoolStat(school);
  const seasonCount = new Set(qualifying.map((q) => q.season)).size;
  return [
    {
      id: "school-share",
      text: `${school.name} chiếm ${stat.share}% số lượt vào top 12 qua ${seasonCount} mùa.`,
      to: "/wiki/truong",
    },
  ];
}

/** Cầu truyền hình Đường lên đỉnh Olympia (phạm vi toàn bộ). */
function olympiaFacts(): Fact[] {
  const school = getSchool("soc-son");
  const n = olympiaTvBridgeCount("soc-son", "all");
  if (!school || !n) return [];
  return [
    {
      id: "olympia-tv",
      text: `${school.name} đã có ${n} cầu truyền hình Chung kết Đường lên đỉnh Olympia.`,
      to: "/bang-vang",
    },
  ];
}

/** [3, 5] → "mùa 3 và mùa 5" */
function seasonsText(list: number[]) {
  return joinViText(list.map((n) => `mùa ${n}`));
}

/** Số liệu đăng kí dự thi: mùa đông nhất, độ cạnh tranh, phễu giới, tỉ lệ nữ qua các mùa (4 câu). */
function registrationFacts(): Fact[] {
  const { rows, total, slots, max } = registrationOverview();
  if (!rows.length) return [];
  const out: Fact[] = [];

  const crowded = rows.filter((r) => r.total === max).map((r) => r.season);
  const crowdedText = seasonsText(crowded);
  out.push({
    id: "reg-most",
    text: `${crowdedText.charAt(0).toUpperCase()}${crowdedText.slice(1)} có nhiều thí sinh đăng kí nhất: ${max} thí sinh.`,
    to: matchPath(crowded[0]),
  });

  const contested = rows.filter((r) => r.slots > 0);
  if (slots > 0) {
    const top = Math.max(...contested.map((r) => r.total / r.slots));
    const hardest = contested.filter((r) => r.total / r.slots === top).map((r) => r.season);
    out.push({
      id: "reg-ratio",
      text: `Qua ${rows.length} mùa có ${total} lượt đăng kí cho ${slots} suất vào Bán kết, trung bình ${formatDecimalVi(total / slots)} lượt cho một suất; cạnh tranh nhất là ${seasonsText(hardest)} với ${formatDecimalVi(top)} lượt cho một suất.`,
      to: "/wiki/cuoc-thi",
    });
  }

  const [applied, top12] = genderFunnel();
  if (top12.nam + top12.nu > 0) {
    const a = percent(applied.nu, applied.nam + applied.nu);
    const b = percent(top12.nu, top12.nam + top12.nu);
    out.push({
      id: "reg-gender-funnel",
      text: `Nữ chiếm ${a}% số lượt đăng kí dự thi ${b >= a ? "và chiếm" : "nhưng chỉ chiếm"} ${b}% số lượt vào top 12.`,
      to: "/wiki/cuoc-thi",
    });
  }

  const shares = registrations.map((r) => ({ season: r.season, share: percent(r.byGender.nu ?? 0, r.total) }));
  const high = Math.max(...shares.map((s) => s.share));
  const low = Math.min(...shares.map((s) => s.share));
  if (high !== low) {
    const at = (v: number) => seasonsText(shares.filter((s) => s.share === v).map((s) => s.season));
    out.push({
      id: "reg-female-share",
      text: `Tỉ lệ nữ trong số thí sinh đăng kí cao nhất ở ${at(high)} (${high}%), thấp nhất ở ${at(low)} (${low}%).`,
      to: "/wiki/cuoc-thi",
    });
  }
  return out;
}

const NOTE_PREFIX = "Đây là";
const NOTE_MAX = 200;

/** Ghi chú mùa: chỉ những câu bắt đầu "Đây là" và dài ≤ 200 ký tự. */
function noteFacts(): Fact[] {
  return seasons.flatMap((s) =>
    s.notes
      .filter((n) => n.startsWith(NOTE_PREFIX) && n.length <= NOTE_MAX)
      .map((n, i) => ({
        id: `note-${s.season}-${i}`,
        text: `Mùa ${s.season}: đây là${n.slice(NOTE_PREFIX.length)}`,
        to: seasonPath(s.season),
      })),
  );
}

/** Toàn bộ câu "Bạn có biết?" sinh được từ dữ liệu hiện tại. */
export function buildFacts(): Fact[] {
  return [
    ...recordFacts(),
    ...comebackFacts(),
    ...tiebreakFacts(),
    ...defendingFacts(),
    ...marginFacts(),
    ...schoolFacts(),
    ...olympiaFacts(),
    ...registrationFacts(),
    ...noteFacts(),
  ];
}
