import CubeOutline from "./CubeOutline";
import Photo from "./Photo";
import { PLACEHOLDER_TONES } from "../lib/placeholder";

/** Ảnh bìa vuông 1:1 của một mùa (bìa mùa là logo vuông, khung vuông để không cắt): có ảnh thì ảnh, chưa có thì nền tông màu với số mùa to (dùng ở thẻ mùa và Thư viện). */
export default function SeasonCover({ season, src, className = "" }: { season: number; src?: string; className?: string }) {
  const tone = PLACEHOLDER_TONES[(season - 1) % PLACEHOLDER_TONES.length];
  return (
    <Photo
      src={src}
      alt=""
      className={`aspect-square w-full ${className}`}
      fallback={
        <span aria-hidden className="absolute inset-0 overflow-hidden" style={{ backgroundColor: tone.bg, color: tone.ink, containerType: "size" }}>
          <CubeOutline color={tone.ink} className="absolute -right-[22%] -bottom-[18%] w-[78%]" />
          <span className="font-display absolute inset-0 grid place-items-center text-[clamp(4rem,52cqmin,9rem)] leading-none font-bold">
            {season}
          </span>
        </span>
      }
    />
  );
}
