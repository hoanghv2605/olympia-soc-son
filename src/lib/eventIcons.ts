import type { IconType } from "react-icons";
import { PiBell, PiChatsCircle, PiHandshake, PiStar, PiTrophy } from "react-icons/pi";
import type { EventType } from "../types";

/** Icon theo loại sự kiện (Phosphor nét thường). */
export const EVENT_ICON: Record<EventType, IconType> = {
  "rung-chuong-vang": PiBell,
  "toa-dam": PiChatsCircle,
  "giao-luu": PiHandshake,
  "dac-biet": PiStar,
  "cuoc-thi": PiTrophy,
};
