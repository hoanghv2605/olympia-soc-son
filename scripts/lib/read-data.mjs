// Đọc dữ liệu JSON trong src/data cho các script Node.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./scan-images.mjs";

export const read = (name) => JSON.parse(readFileSync(join(root, "src", "data", `${name}.json`), "utf8"));

/** Dữ liệu thi đấu của các sự kiện dạng mùa thi (DOC3, DOC4…): { [id sự kiện]: nội dung file `dataFile` }. */
export function readEventDocs(events) {
  return Object.fromEntries(events.filter((e) => e.dataFile).map((e) => [e.id, read(e.dataFile.replace(/\.json$/, ""))]));
}
