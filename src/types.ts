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
  advanced?: boolean; // BK: vào Chung kết
  placement?: Placement; // CK
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
  ossSeason: number;
  year: number; // Olympia năm thứ ...
  stage: OlympiaStage;
  round: string; // "Tuần 3 - Tháng 1 - Quý 3"
  result: string; // giữ nguyên văn: "Giải Nhất", "Quý quân"...
  date?: string;
  note?: string | null;
}

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
  icon: "book" | "gear" | "megaphone" | "people";
  duties: string[];
  photo?: string;
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
  quote: string;
  photo?: string;
}
