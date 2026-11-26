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
  date?: string; // YYYY-MM-DD, ngày thi đấu của trận
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
  round: string | null; // "Tuần 3 - Tháng 1 - Quý 3"; phần chưa biết thì bỏ, không biết gì thì null (không lưu "?")
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
export interface TimelineItem extends Omit<Milestone, "person" | "kind"> {
  kind: MilestoneKind | "event" | "round"; // "event" = sự kiện khác (events.json, chấm xanh); "round" = vòng thi OSS (chấm tím)
  /** Thứ tự khi cùng ngày: vòng loại 0 → bán kết 1 → chung kết 2 → còn lại 3 (mặc định) */
  order?: number;
  personId?: string;
  personName?: string;
  /** Dòng ở hồ sơ thí sinh: đường dẫn của dòng phụ (trang sự kiện hoặc đúng trận) */
  detailTo?: string;
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
  leaderTitle?: string; // "Anh" / "Chị"
  leader: string | null; // Trưởng ban (null / rỗng = ẩn dòng "Trưởng ban")
  leaderPerson?: string; // id hồ sơ OSSPEDIA (tuỳ chọn)
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
  /** Ngày đăng, YYYY-MM-DD; `null` = chưa có (chỉ ghi "Tập {stt}", không có ngày) */
  date: string | null;
  /** Tuỳ chọn: id người trong people.json (dùng ảnh mặc định của người đó khi chưa có ảnh riêng; link hồ sơ OSSPEDIA chỉ hiện khi người đó có hồ sơ) */
  person?: string | null;
  /** Tuỳ chọn: các trận được kể trong bài (`tran`: "vl" | "bk1" | "bk2" | "bk3" | "ck") */
  tranLienQuan?: { mua: number; tran: string }[];
  /** Số thứ tự câu chuyện (duy nhất): xếp trang Human of OSS và đặt tên ảnh human-of-oss/{stt 2 chữ số}.jpg */
  stt: number;
}

/** Nhận xét trên trang chủ, trích từ bài Human of OSS. Chỉ đăng khi người đó đồng ý. */
export interface Testimonial {
  id: string;
  name: string; // gồm cả cách xưng hô, vd "Chị Nguyễn Văn A"
  role?: string; // vai trò với Olympia Sóc Sơn
  position?: string; // chức danh hiện tại
  quote: string; // nhiều đoạn ngăn bằng "\n\n"; để trống thì mục không hiện
  humanSlug?: string; // bài Human of OSS gốc (humans.json): link "Đọc bài phỏng vấn" và ảnh hồ sơ
}

/** Nhóm đơn vị đồng hành (thứ tự hiển thị: phối hợp tổ chức → tài trợ → đồng hành). */
export type PartnerGroup = "phoi-hop" | "tai-tro" | "dong-hanh";

/** Đơn vị đồng hành. Logo: public/images/doi-tac/<id>.svg hoặc .png. Chỉ đăng khi đơn vị đồng ý. */
export interface Partner {
  id: string; // vd "tai-tro-1"; tên file logo = id
  group: PartnerGroup;
  name: string;
  role?: string; // dòng chữ nhỏ dưới logo, vd "Bảo trợ truyền thông"
  url?: string; // có thì logo là link mở tab mới
}

// ===== Sự kiện khác (src/data/events.json) =====

export type EventType = "rung-chuong-vang" | "toa-dam" | "giao-luu" | "dac-biet" | "cuoc-thi";
export type EventRole = "to-chuc" | "dong-to-chuc" | "tham-gia";
export type EventFormat = "xep-hang" | "doi" | "nguoi-choi" | "mua-thi";

/** Kết quả ở sự kiện khác. Màu: Nhất / Quán quân vàng, Nhì / Á quân bạc, Ba / Quý quân đồng; còn lại không tô màu. */
export type EventResult =
  | "giai-nhat"
  | "giai-nhi"
  | "giai-ba"
  | "giai-khuyen-khich"
  | "quan-quan"
  | "a-quan"
  | "quy-quan"
  | "tham-du"
  | "khach-moi";

export interface EventParticipant {
  name: string;
  person?: string; // People.id (có thể không có hồ sơ OSSPEDIA)
  class?: string;
  school?: string; // School.id
  schoolName?: string; // trường ngoài schools.json, chỉ hiện chữ
  result?: EventResult;
  note?: string;
}

/** Một trận của sự kiện dạng "xep-hang"; `participants` theo vị trí đứng. */
export interface EventMatch {
  title: string; // "Trận 1"
  participants: EventParticipant[];
}

/** Một đội (sự kiện dạng "doi"). */
export interface EventTeam {
  name: string;
  result: EventResult;
  members?: EventParticipant[];
}

export interface EventAwardPhoto {
  src: string; // đường dẫn từ images/, vd "tran-dau/rcv2024-ck.jpg"
  caption: string;
}

export interface SiteEvent {
  id: string;
  stt: number;
  name: string;
  aka?: string; // tên khác, vd "GNDN 2024"
  type: EventType;
  year: number;
  schoolYear: string | null; // "2023-2024"
  date: string | null; // YYYY-MM-DD, ngày bắt đầu
  endDate?: string; // ngày kết thúc
  scope?: string | null;
  organizer?: string | null;
  role: EventRole | null;
  occasion?: string; // dòng "Sự kiện" trong khung thông tin
  hosts?: string[]; // dẫn chương trình
  winner?: { label: string; name: string; person?: string };
  intro: string | null; // markdown
  format: EventFormat | null;
  photoKey?: string;
  photoLabel?: string;
  sectionTitle?: string;
  awardPhoto?: EventAwardPhoto;
  matches?: EventMatch[];
  teams?: EventTeam[];
  participants?: EventParticipant[];
  dataFile?: string; // dạng "mua-thi": file dữ liệu trong src/data (vd "su-kien/doc3.json")
}

// ===== Sự kiện dạng mùa thi (src/data/su-kien/doc3.json, doc4.json): tách riêng khỏi thống kê OSS =====

export interface DocQualifying {
  rank: number;
  name: string;
  class: string;
  school: string; // School.id
  score: number;
  ossPerson?: string; // mã hồ sơ OSSPEDIA nếu người này cũng thi OSS
}

export interface DocResult {
  name: string;
  class: string;
  school: string;
  result: EventResult;
  ossPerson?: string;
}

export interface DocData {
  id: string;
  qualifyingDate?: string; // ngày Vòng loại
  qualifying: DocQualifying[];
  semifinals: { no: number; date?: string; results: DocResult[] }[]; // results theo vị trí đứng
  final: { date?: string; results: DocResult[] };
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
