import CubeOutline from "./CubeOutline";
import { initials } from "../lib/format";
import { placeholderTone } from "../lib/placeholder";

/**
 * Ảnh giữ chỗ cho người (thí sinh, Human of OSS) khi chưa có ảnh thật:
 * nền + chữ theo 1 trong 5 tông (cố định theo `seed`), chữ cái đầu ~28% cạnh ngắn của khung (1.25rem – 6rem),
 * họa tiết khối lập phương chỉ vẽ nét tràn ra góc dưới phải. Phủ kín khung cha (absolute).
 */
export default function Placeholder({ seed, name }: { seed: string; name: string }) {
  const tone = placeholderTone(seed);
  return (
    <span
      aria-hidden="true"
      data-tone-name={tone.name}
      className="absolute inset-0 overflow-hidden"
      // container-type: size → cỡ chữ theo cạnh NGẮN của khung (cqmin), không phình to khi khung rất rộng
      style={{ backgroundColor: tone.bg, color: tone.ink, containerType: "size" }}
    >
      <CubeOutline color={tone.ink} className="absolute -right-[22%] -bottom-[18%] w-[78%]" />
      <span className="font-display absolute inset-0 grid place-items-center text-[clamp(1.25rem,28cqmin,6rem)] leading-none font-bold tracking-wide">
        {initials(name)}
      </span>
    </span>
  );
}
