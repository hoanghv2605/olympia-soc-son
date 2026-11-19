import { Link } from "react-router";
import { PiPenNib } from "react-icons/pi";
import PageHeader from "../components/PageHeader";
import PersonPhoto from "../components/PersonPhoto";
import { HUMAN_SLOTS, humanPath, humanPhoto, humans } from "../lib/data";
import { placeholderTone } from "../lib/placeholder";

/** Ô giữ chỗ "Câu chuyện sắp ra mắt": không phải link, không focus được, ẩn với trình đọc màn hình. */
function ComingSoon({ index }: { index: number }) {
  const tone = placeholderTone(`human-slot-${index}`);
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-xl border border-dashed border-oss/30 bg-white/40">
      <div className="grid aspect-[4/3] w-full place-items-center opacity-70" style={{ backgroundColor: tone.bg, color: tone.ink }}>
        <PiPenNib className="size-12 opacity-40" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-lg font-bold text-ink-soft">Câu chuyện sắp ra mắt</p>
        <p className="mt-1 text-sm text-ink-soft">Một gương mặt của Olympia Sóc Sơn sẽ xuất hiện tại đây.</p>
      </div>
    </div>
  );
}

export default function HumanOfOssPage() {
  // Câu chuyện thật trước, còn thiếu thì thêm ô giữ chỗ cho đủ HUMAN_SLOTS
  const comingSoon = Math.max(0, HUMAN_SLOTS - humans.length);
  return (
    <>
      <PageHeader title="Human of OSS" description="Những con người và câu chuyện phía sau Olympia Sóc Sơn." />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {humans.map((h) => (
            <li key={h.slug}>
              <Link
                to={humanPath(h.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-oss/15 bg-white/80 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(109,40,217,0.5)]"
              >
                <PersonPhoto src={humanPhoto(h.slug)} seed={h.slug} name={h.name} className="aspect-[4/3] w-full" />
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-lg font-bold text-ink group-hover:text-oss">{h.name}</span>
                  <span className="text-sm text-ink-soft">{h.title}</span>
                  <span className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink">“{h.quote}”</span>
                </span>
              </Link>
            </li>
          ))}
          {Array.from({ length: comingSoon }, (_, i) => (
            <li key={`slot-${i}`} aria-hidden="true">
              <ComingSoon index={i} />
            </li>
          ))}
        </ul>
        {comingSoon > 0 && <p className="sr-only">Còn {comingSoon} câu chuyện sắp ra mắt.</p>}
      </section>
    </>
  );
}
