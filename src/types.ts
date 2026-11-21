// Kiểu dữ liệu dùng chung. Khi thêm trường mới vào file JSON trong src/data,
// khai báo thêm ở đây để TypeScript nhắc lỗi chính tả / thiếu trường.
// Quy ước: null = không có dữ liệu / không thi; 0 = có thi, được 0 điểm.

export interface School {
  id: string;
  name: string; // "THPT Sóc Sơn"
  short: string; // "SS"
}

export interface Person {
  id: string; // mã cố định, dùng làm đường dẫn
  name: string;
  school: string; // School.id
}

export interface Season {
  season: number;
  code: string; // "OSS1"
  schoolYear: string; // "2017-2018"
  startDate: string; // YYYY-MM-DD (vòng loại)
  finalDate: string; // YYYY-MM-DD (chung kết)
  venue: string;
  hosts: string[]; // MC
  rulesBasedOn: number[]; // luật Đường lên đỉnh Olympia năm thứ ...
  eligibility: string; // đối tượng dự thi
  notes: string[]; // sự kiện đáng nhớ
  seededDraw: boolean; // có bốc thăm theo nhóm hạt giống hay không
}

export interface QualifyingEntry {
  season: number;
  rank: number;
  person: string;
  class: string;
  school: string;
  score: number | null;
}

export type MatchRound = "ban-ket" | "chung-ket";
export type Placement = "vo-dich" | "a-quan" | "giai-ba";

export interface MatchResult {
  person: string;
  class: string;
  school: string;
  kd: number | null; // Khởi động
  vcnv: number | null; // Vượt chướng ngại vật
  tt: number | null; // Tăng tốc
  vd: number | null; // Về đích
  total: number | null; // không âm
  rank: number;
  advanced?: boolean; // Bán kết: vào Chung kết
  placement?: Placement; // Chung kết
}

export interface Match {
  id: string; // "oss1-bk1"
  season: number;
  round: MatchRound;
  number: number;
  results: MatchResult[];
  tiebreakWinner?: string; // người thắng câu hỏi phụ
  notes?: string[];
}

export type OlympiaStage = "tuan" | "thang" | "quy" | "nam";

export interface OlympiaRecord {
  person: string;
  ossSeason: number | null; // null = thí sinh không thi OSS
  year: number; // Olympia năm thứ ...
  stage: OlympiaStage;
  round: string; // "Tuần 3 - Tháng 1 - Quý 3"
  result: string; // giữ nguyên văn: "Giải Nhất", "Quý quân"...
  date?: string;
  note?: string | null;
  beforeOss?: boolean; // true = tham gia Đường lên đỉnh Olympia trước khi dự thi OSS
}

/** Phạm vi thời gian khi tính thành tích Đường lên đỉnh Olympia: "oss" = từ OSS (ossSeason khác null, không beforeOss); "all" = toàn bộ. */
export type OlympiaPeriod = "oss" | "all";

export type MilestoneKind = "oss" | "olympia";

export interface Milestone {
  date: string; // YYYY-MM-DD
  kind: MilestoneKind;
  person?: string; // mã thí sinh
  action?: string; // "trở thành", "giành"
  highlight: string;
  detail?: string;
  note?: string;
}

/** Cột mốc đã đổi mã thí sinh thành tên, dùng để hiển thị. */
export interface TimelineItem extends Omit<Milestone, "person"> {
  personId?: string;
  personName?: string;
}

export type StatIcon = "trophy" | "people" | "podium" | "laurel" | "tv";
export type StatGroup = "oss" | "soc-son-olympia";
export type StatScope = "soc-son" | "all";

export interface StatEntry {
  key: string;
  label: string;
  icon: StatIcon;
  group: StatGroup;
  value?: string; // chỉ dùng khi manual
  manual?: boolean;
  scope?: StatScope;
}

export interface Stat {
  key: string;
  value: string;
  label: string;
  icon: StatIcon;
  group: StatGroup;
}

export interface Department {
  id: string;
  name: string;
  icon: "compass" | "book" | "gear" | "megaphone" | "people";
  leader: string; // Trưởng ban
  duties: string[];
}

export interface ContactPerson {
  name: string;
  role: string;
  facebook?: string;
  email?: string;
  phone?: string;
}

export interface HumanStory {
  slug: string;
  name: string;
  title: string;
  /** Tiêu đề bài viết (hiện trong ngoặc kép, in nghiêng) */
  headline: string;
  /** Câu trích ngắn hiện trên thẻ */
  quote: string;
  /** Ngày đăng, YYYY-MM-DD */
  date: string;
  /** Tuỳ chọn: id thí sinh OSSPEDIA (dùng ảnh thí sinh khi chưa có ảnh riêng + link hồ sơ) */
  person?: string;
  /** Số thứ tự câu chuyện (duy nhất): xếp trang Human of OSS và đặt tên ảnh human-of-oss/{stt 2 chữ số}.jpg */
  stt: number;
}

/** Nhận xét trên trang chủ. Ảnh: public/images/nhan-xet/<id>.jpg. Chỉ đăng khi người đó đồng ý. */
export interface Testimonial {
  id: string;
  name: string; // gồm cả cách xưng hô, vd "Chị Nguyễn Văn A"
  role?: string; // vai trò với Olympia Sóc Sơn
  position?: string; // chức danh hiện tại
  quote: string; // nhiều đoạn ngăn bằng "\n\n"
}

/** Hạng đối tác: Vàng, Bạc, Đồng hành (đổi hạng = đổi `tier`, và đổi tên file logo theo `id` mới). */
export type PartnerTier = "vang" | "bac" | "dong-hanh";

/** Đối tác đồng hành. Logo: public/images/doi-tac/<id>.svg hoặc .png. Chỉ đăng khi đơn vị đồng ý. */
export interface Partner {
  id: string;
  name: string;
  url: string; // "" = không có link
  tier: PartnerTier;
}

// ===== Sự kiện khác (src/data/events.json) =====

export type EventType = "rung-chuong-vang" | "toa-dam" | "giao-luu" | "dac-biet" | "cuoc-thi";
export type EventRole = "to-chuc" | "dong-to-chuc" | "tham-gia";
export type EventFormat = "xep-hang" | "nguoi-choi" | "mua-thi";

export interface EventParticipant {
  name: string;
  person?: string; // People.id (có thể không có hồ sơ OSSPEDIA)
  class?: string;
  school?: string; // School.id
  schoolName?: string; // trường ngoài schools.json, chỉ hiện chữ
  rank?: number; // 1 Giải Nhất, 2 Giải Nhì, 3 Giải Ba
  note?: string;
}

export interface SiteEvent {
  id: string;
  stt: number;
  name: string;
  shortName?: string;
  type: EventType;
  year: number;
  schoolYear: string | null; // "2023-2024"
  date: string | null; // YYYY-MM-DD
  scope: string | null;
  organizer: string | null;
  role: EventRole | null;
  intro: string | null; // markdown
  format: EventFormat | null;
  photoKey?: string;
  photoLabel?: string;
  sectionTitle?: string;
  participantLabel?: string;
  participants?: EventParticipant[];
}

// ===== DAPHUC Olympia Championship 3 (src/data/su-kien/doc3.json): cùng hình dạng dữ liệu OSS, tách riêng khỏi thống kê OSS =====

export interface Doc3Person {
  id: string; // mã trong doc3.json (qualifying / matches trỏ tới mã này)
  name: string;
  school: string; // School.id
  ossPerson?: string; // mã hồ sơ OSSPEDIA nếu người này cũng thi OSS
}

export interface Doc3Season {
  season: number;
  code: string;
  schoolYear: string;
  startDate: string | null;
  finalDate: string | null;
  venue: string | null;
  hosts: string[];
  rulesBasedOn: number[];
  eligibility: string | null;
  notes: string[];
  seededDraw: boolean;
}

export interface Doc3Data {
  season: Doc3Season;
  people: Doc3Person[];
  qualifying: QualifyingEntry[];
  matches: Match[];
}

/**
 * Nguồn dữ liệu của một cuộc thi (OSS hoặc DOC3) cho các bảng / biểu đồ dùng chung:
 * tên, link hồ sơ, tên trường, ảnh. Mặc định là OSS (xem CompetitionContext).
 */
export interface Competition {
  personName(id: string): string;
  /** Đường dẫn hồ sơ OSSPEDIA; undefined = không có hồ sơ (hiện chữ thường). */
  personTo(id: string): string | undefined;
  /** Mã thí sinh OSS cho thẻ xem nhanh (rê chuột) */
  previewId(id: string): string | undefined;
  schoolName(id: string): string;
  avatar(id: string, season?: number): string | undefined;
  /** "mùa 10" / "DOC3" (dùng trong mô tả biểu đồ) */
  seasonLabel(match: Match): string;
}
