export const HUMAN_SLOTS: number;
export function slugify(name: string): string;
export function schoolCode(schools: { id: string; short: string }[], schoolId: string): string;

export interface PersonPhotoFile {
  /** Tên file trong public/images/thi-sinh/ */
  file: string;
  personId: string;
  kind: "oss" | "olympia" | "win";
  season?: number;
  year?: number;
  label: string;
}

export function personPhotoFiles(data: {
  people: { id: string; name: string; school: string }[];
  qualifying: { season: number; person: string; school: string }[];
  olympia: { person: string; year: number }[];
  schools: { id: string; short: string }[];
  matches?: { season: number; round: string; results: { person: string; school: string; placement?: string }[] }[];
}): PersonPhotoFile[];

export interface EventEntry {
  name: string;
  person?: string;
  school?: string;
  class?: string;
}

interface EventLike {
  id: string;
  name: string;
  photoKey?: string;
  matches?: { participants: EventEntry[] }[];
  participants?: EventEntry[];
  teams?: { members?: EventEntry[] }[];
}

/** Dữ liệu file DOC (su-kien/doc3.json…). */
export interface DocLike {
  qualifying?: { name: string; school?: string; ossPerson?: string }[];
  semifinals?: { results: { name: string; school?: string; ossPerson?: string }[] }[];
  final?: { results: { name: string; school?: string; ossPerson?: string }[] };
}

export function eventEntries(event: EventLike, doc?: DocLike): EventEntry[];
export function eventPersonPhotoFile(photoKey: string, name: string, schoolId: string, schools: { id: string; short: string }[]): string;

export interface EventPhotoFile {
  /** Tên file trong public/images/thi-sinh/ */
  file: string;
  personId?: string;
  kind: "event";
  eventId: string;
  name: string;
  label: string;
}

export function eventPhotoFiles(events: EventLike[], schools: { id: string; short: string }[], docs?: Record<string, DocLike>): EventPhotoFile[];

export function findDuplicateFiles<T extends { file: string }>(list: T[]): [T, T][];
export function humanPhotoFile(stt: number): string;
export function departmentPhotoFile(id: string): string;
export function findDuplicateStt<T extends { stt: number }>(humans: T[]): [T, T][];
