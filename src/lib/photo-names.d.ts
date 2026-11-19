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

export function findDuplicateFiles<T extends { file: string }>(list: T[]): [T, T][];
export function humanPhotoFile(stt: number): string;
export function departmentPhotoFile(id: string): string;
export function findDuplicateStt<T extends { stt: number }>(humans: T[]): [T, T][];
