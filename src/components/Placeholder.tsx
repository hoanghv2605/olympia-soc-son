import CubeOutline from "./CubeOutline";
import { initials } from "../lib/format";
import { placeholderTone } from "../lib/placeholder";

/**
 * Ảnh giữ chỗ cho người (thí sinh, Human of OSS) khi chưa có ảnh thật:
 * nền + chữ theo 1 trong 5 tông (cố định theo `seed`), chữ cái đầu ~28% bề ngang khung,
 * họa tiết khối lập phương chỉ vẽ nét tràn ra góc dưới phải. Phủ kín khung cha (absolute).
 */
export default function Placeholder({ seed, name }: { seed: string; name: string }) {
  const tone = placeholderTone(seed);
  return (
    <span
      aria-hidden="true"
      data-tone-name={tone.name}
      className="@container absolute inset-0 overflow-hidden"
      style={{ backgroundColor: tone.bg, color: tone.ink }}
    >
      <CubeOutline color={tone.ink} className="absolute -right-[22%] -bottom-[18%] w-[78%]" />
      <span className="font-display absolute inset-0 grid place-items-center text-[28cqw] leading-none font-bold tracking-wide">
        {initials(name)}
      </span>
    </span>
  );
}
