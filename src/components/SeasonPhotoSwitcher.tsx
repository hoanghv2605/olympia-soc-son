import { useEffect, useState } from "react";
import PersonPhoto from "./PersonPhoto";
import { personSeasonPhoto } from "../lib/data";

/**
 * Ảnh ở hồ sơ thí sinh. Người có từ 2 mùa OSS: hàng nút "Mùa n" dưới ảnh (bật/tắt, mặc định mùa mới nhất).
 * Chỉ lấy ảnh đúng mùa đó (mùa chưa có ảnh thì hiện ảnh giữ chỗ, không lấy mùa khác). Đổi ảnh mờ chéo 200ms.
 */
export default function SeasonPhotoSwitcher({ personId, name, seasons }: { personId: string; name: string; seasons: number[] }) {
  const sorted = [...seasons].sort((a, b) => a - b);
  const [season, setSeason] = useState(sorted[sorted.length - 1]);
  const [prev, setPrev] = useState<number | null>(null);

  // Lớp ảnh cũ nằm dưới trong lúc ảnh mới mờ dần hiện lên, xong thì gỡ
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), 200);
    return () => window.clearTimeout(t);
  }, [prev]);

  function pick(n: number) {
    if (n === season) return;
    setPrev(season);
    setSeason(n);
  }

  const layer = (s: number, cls: string) => (
    <div key={s} className={`absolute inset-0 ${cls}`}>
      <PersonPhoto src={personSeasonPhoto(personId, s)} seed={personId} name={name} className="size-full" />
    </div>
  );

  return (
    <div className="mb-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        {prev !== null && layer(prev, "")}
        {layer(season, prev !== null ? "photo-swap-in" : "")}
      </div>
      {sorted.length >= 2 && (
        <div role="group" aria-label="Ảnh theo mùa" className="mt-3 flex flex-wrap gap-2">
          {sorted.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={n === season}
              onClick={() => pick(n)}
              className="min-h-9 rounded-full border border-oss/25 bg-white/70 px-3.5 text-sm font-semibold text-oss hover:border-oss aria-pressed:border-oss aria-pressed:bg-oss aria-pressed:text-white"
            >
              Mùa {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
