import { Link } from "react-router";
import EventCover from "./EventCover";
import EventTypeChip from "./EventTypeChip";
import { eventImage, eventLibraryCount, eventLibraryPath, eventPath, eventTimeLabel } from "../lib/data";
import type { SiteEvent } from "../types";

/** Thẻ một sự kiện ở trang Sự kiện khác: cả thẻ là 1 link; link thư viện là phần tử riêng, không lồng link trong link. */
export default function EventCard({ event }: { event: SiteEvent }) {
  const photos = eventLibraryCount(event.id);
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-oss/15 bg-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-within:-translate-y-0.5 focus-within:border-oss motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <EventCover type={event.type} index={event.stt} src={eventImage(event.id)} />
      <div className="flex flex-1 flex-col p-5">
        <div>
          <EventTypeChip type={event.type} />
        </div>
        <h2 className="h3 mt-3 text-ink">{event.name}</h2>
        <p className="mt-2 text-sm text-ink-soft tabular-nums">{eventTimeLabel(event)}</p>
        {event.scope && <p className="mt-1 text-sm text-ink-soft">{event.scope}</p>}
        {photos > 0 && (
          <Link to={eventLibraryPath(event.id)} className="link-strong relative z-20 mt-auto inline-block self-start pt-3 text-sm">
            Thư viện ảnh ({photos})
          </Link>
        )}
      </div>
      <Link to={eventPath(event.id)} aria-label={event.name} className="absolute inset-0 z-10 rounded-2xl" />
    </article>
  );
}
