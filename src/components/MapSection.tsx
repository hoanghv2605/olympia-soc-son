import { PiMapPinBold } from "react-icons/pi";
import { site } from "../lib/data";

/** Khối bản đồ cuối trang chủ (bản đồ chỉ có ở đây, không có ở footer). */
export default function MapSection() {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr] md:gap-10">
      <div className="aspect-video overflow-hidden rounded-3xl border border-oss/15 bg-oss-soft">
        <iframe
          title="Bản đồ đường đến Olympia Sóc Sơn"
          src={site.mapEmbedUrl}
          className="size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div>
        <p className="flex items-start gap-2 text-[17px] text-ink">
          <PiMapPinBold className="mt-1 size-5 shrink-0 text-oss" aria-hidden />
          {site.address}
        </p>
        <a
          href={site.mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-oss px-5 text-sm font-semibold text-white hover:bg-oss/90"
        >
          Mở trong Google Maps
        </a>
      </div>
    </div>
  );
}
