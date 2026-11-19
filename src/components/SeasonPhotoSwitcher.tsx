import { useEffect, useState } from "react";
import PersonPhoto from "./PersonPhoto";
import { personOlympiaPhoto, personSeasonPhoto } from "../lib/data";

/** Một lựa chọn ảnh: mùa OSS ("s") hoặc năm Đường lên đỉnh Olympia ("o"). */
type Pick = { kind: "s" | "o"; n: number };
const keyOf = (p: Pick) => `${p.kind}${p.n}`;

/**
 * Ảnh ở hồ sơ thí sinh. Hàng nút dưới ảnh (hiện khi có từ 2 nút): "Mùa n" (tăng dần) rồi "O{năm}" (ảnh Đường lên đỉnh
 * Olympia năm thứ N); nút bật/tắt, mặc định mùa OSS mới nhất. Chỉ lấy ảnh đúng lựa chọn (chưa có ảnh thì hiện ảnh
 * giữ chỗ, không lấy ảnh khác). Đổi ảnh mờ chéo 200ms (giảm chuyển động: tức thì, xem .photo-swap-in).
 */
export default function SeasonPhotoSwitcher({
  personId,
  name,
  seasons,
  olympiaYears = [],
}: {
  personId: string;
  name: string;
  seasons: number[];
  olympiaYears?: number[];
}) {
  const picks: Pick[] = [
    ...[...seasons].sort((a, b) => a - b).map((n): Pick => ({ kind: "s", n })),
    ...[...olympiaYears].sort((a, b) => a - b).map((n): Pick => ({ kind: "o", n })),
  ];
  const lastSeason = picks.filter((p) => p.kind === "s").pop() ?? picks[0];
  const [current, setCurrent] = useState<Pick | undefined>(lastSeason);
  const [prev, setPrev] = useState<Pick | null>(null);

  // Lớp ảnh cũ nằm dưới trong lúc ảnh mới mờ dần hiện lên, xong thì gỡ
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), 200);
    return () => window.clearTimeout(t);
  }, [prev]);

  function pick(p: Pick) {
    if (current && keyOf(p) === keyOf(current)) return;
    setPrev(current ?? null);
    setCurrent(p);
  }

  const srcOf = (p: Pick | undefined) =>
    !p ? undefined : p.kind === "s" ? personSeasonPhoto(personId, p.n) : personOlympiaPhoto(personId, p.n);

  const layer = (p: Pick | undefined, cls: string) => (
    <div key={p ? keyOf(p) : "none"} className={`absolute inset-0 ${cls}`}>
      <PersonPhoto src={srcOf(p)} seed={personId} name={name} className="size-full" />
    </div>
  );

  return (
    <div className="mb-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        {prev !== null && layer(prev, "")}
        {layer(current, prev !== null ? "photo-swap-in" : "")}
      </div>
      {picks.length >= 2 && (
        <div role="group" aria-label="Ảnh theo mùa" className="mt-3 flex flex-wrap gap-2">
          {picks.map((p) => (
            <button
              key={keyOf(p)}
              type="button"
              aria-pressed={!!current && keyOf(p) === keyOf(current)}
              aria-label={p.kind === "o" ? `Đường lên đỉnh Olympia năm thứ ${p.n}` : undefined}
              onClick={() => pick(p)}
              className="min-h-9 rounded-full border border-oss/25 bg-white/70 px-3.5 text-sm font-semibold text-oss hover:border-oss aria-pressed:border-oss aria-pressed:bg-oss aria-pressed:text-white"
            >
              {p.kind === "o" ? `O${p.n}` : `Mùa ${p.n}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
