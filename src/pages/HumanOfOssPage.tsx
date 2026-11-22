import { Link } from "react-router";
import { PiPenNib } from "react-icons/pi";
import PageHeader from "../components/PageHeader";
import PersonPhoto from "../components/PersonPhoto";
import { HUMAN_SLOTS, humanImage, humanPath, humans } from "../lib/data";
import { formatDate } from "../lib/format";
import { placeholderTone } from "../lib/placeholder";
import { usePageTitle } from "../lib/hooks";

const RING = "size-20 shrink-0 rounded-full ring-2 ring-oss ring-offset-[3px] ring-offset-white md:size-32";

/** Khung thẻ ngang: thẻ lẻ ảnh trái / sát trái, thẻ chẵn ảnh phải / sát phải (máy tính rộng ~80%). */
function cardShell(even: boolean, extra: string) {
  return `flex w-full items-center gap-4 rounded-3xl bg-white p-4 md:w-4/5 md:gap-6 md:p-6 ${
    even ? "flex-row-reverse md:ml-auto" : "md:mr-auto"
  } ${extra}`;
}

/** Khối chữ dùng chung cho thẻ thật và ô chờ; thẻ chẵn căn phải. */
function TextBlock({
  even,
  name,
  title,
  quote,
  footer,
  muted = false,
}: {
  even: boolean;
  name: string;
  title: string;
  quote: string;
  footer?: string;
  muted?: boolean;
}) {
  return (
    <span className={`block min-w-0 flex-1 ${even ? "text-right" : "text-left"}`}>
      <span className={`block text-xl leading-[1.35] font-bold ${muted ? "text-ink-soft" : "text-oss"}`}>{name}</span>
      <span className="block text-sm text-ink-soft">{title}</span>
      <span
        className={`mt-2 block text-base leading-[1.7] text-ink italic [text-align:justify] ${
          even ? "[text-align-last:right]" : "[text-align-last:left]"
        }`}
      >
        “{quote}”
      </span>
      {footer && <span className="mt-2 block text-sm text-ink-soft tabular-nums">{footer}</span>}
    </span>
  );
}

/** Ô chờ "Câu chuyện sắp ra mắt": không phải link, không focus được, ẩn với trình đọc màn hình. */
function ComingSoon({ index, number }: { index: number; number: number }) {
  const tone = placeholderTone(`human-slot-${index}`);
  const even = number % 2 === 0;
  return (
    <div aria-hidden="true" className={cardShell(even, "border border-dashed border-oss/30 bg-white/40")}>
      <span
        className={`grid place-items-center opacity-70 ${RING}`}
        style={{ backgroundColor: tone.bg, color: tone.ink }}
      >
        <PiPenNib className="size-8 opacity-50 md:size-12" />
      </span>
      <TextBlock
        even={even}
        muted
        name="Câu chuyện sắp ra mắt"
        title={`Tập ${number}`}
        quote="Một gương mặt của Olympia Sóc Sơn sẽ xuất hiện tại đây."
      />
    </div>
  );
}

export default function HumanOfOssPage() {
  usePageTitle("Human of OSS · Olympia Sóc Sơn");
  // Câu chuyện thật trước, còn thiếu thì thêm ô giữ chỗ cho đủ HUMAN_SLOTS
  const comingSoon = Math.max(0, HUMAN_SLOTS - humans.length);
  return (
    <>
      <PageHeader title="Human of OSS" description="Những con người và câu chuyện phía sau Olympia Sóc Sơn." />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <ul className="flex flex-col gap-5 md:gap-6">
          {humans.map((h, i) => {
            const even = (i + 1) % 2 === 0;
            return (
              <li key={h.slug}>
                <Link
                  to={humanPath(h.slug)}
                  className={cardShell(
                    even,
                    "border border-transparent shadow-[0_6px_24px_-12px_rgba(109,40,217,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-oss/30 focus-visible:-translate-y-0.5 focus-visible:border-oss/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
                  )}
                >
                  <PersonPhoto decorative src={humanImage(h)} seed={h.slug} name={h.name} className={RING} />
                  <TextBlock
                    even={even}
                    name={h.name}
                    title={h.title}
                    quote={h.quote}
                    footer={h.date ? `Tập ${h.stt} · ${formatDate(h.date)}` : `Tập ${h.stt}`}
                  />
                </Link>
              </li>
            );
          })}
          {Array.from({ length: comingSoon }, (_, i) => (
            <li key={`slot-${i}`} aria-hidden="true">
              <ComingSoon index={i} number={humans.length + i + 1} />
            </li>
          ))}
        </ul>
        {comingSoon > 0 && <p className="sr-only">Còn {comingSoon} câu chuyện sắp ra mắt.</p>}
      </section>
    </>
  );
}
