import CubeOutline from "./CubeOutline";
import Photo from "./Photo";
import { EVENT_ICON } from "../lib/eventIcons";
import { PLACEHOLDER_TONES } from "../lib/placeholder";
import type { EventType } from "../types";

/** Ảnh bìa 3:2 của một sự kiện: có ảnh thì ảnh, chưa có thì nền tông màu với icon loại 48px (thẻ sự kiện và Thư viện). */
export default function EventCover({
  type,
  index,
  src,
  className = "",
}: {
  type: EventType;
  /** Số thứ tự (stt) để chọn tông màu */
  index: number;
  src?: string;
  className?: string;
}) {
  const tone = PLACEHOLDER_TONES[(index - 1) % PLACEHOLDER_TONES.length];
  const Icon = EVENT_ICON[type];
  return (
    <Photo
      src={src}
      alt=""
      className={`aspect-[3/2] w-full ${className}`}
      fallback={
        <span aria-hidden className="absolute inset-0 overflow-hidden" style={{ backgroundColor: tone.bg, color: tone.ink }}>
          <CubeOutline color={tone.ink} className="absolute -right-[22%] -bottom-[18%] w-[78%]" />
          <span className="absolute inset-0 grid place-items-center">
            <Icon className="size-12" />
          </span>
        </span>
      }
    />
  );
}
