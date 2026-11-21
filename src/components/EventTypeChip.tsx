import { EVENT_ICON } from "../lib/eventIcons";
import { EVENT_TYPE_LABEL } from "../lib/data";
import type { EventType } from "../types";

/** Chip loại sự kiện: icon + nhãn. */
export default function EventTypeChip({ type }: { type: EventType }) {
  const Icon = EVENT_ICON[type];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-oss-soft px-3 py-1 text-sm font-semibold text-oss">
      <Icon className="size-4" aria-hidden />
      {EVENT_TYPE_LABEL[type]}
    </span>
  );
}
