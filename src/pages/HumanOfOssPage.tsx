import { PiQuotesFill } from "react-icons/pi";
import Photo from "../components/Photo";
import { humans } from "../lib/data";

export default function HumanOfOssPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="section-title">Human of OSS</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">Những con người và câu chuyện phía sau Olympia Sóc Sơn.</p>

      <ul className="mt-14 space-y-20">
        {humans.map((h) => (
          <li key={h.slug} id={h.slug} className="grid items-start gap-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-14">
            <div className="flex items-center gap-5 md:flex-col md:items-start">
              <div className="rounded-full bg-gradient-to-br from-cube-blue via-oss to-cube-pink p-[3px]">
                <div className="rounded-full bg-mist p-1.5">
                  <Photo src={h.photo} alt={`Chân dung ${h.name}`} className="size-28 rounded-full md:size-40" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-oss">{h.name}</p>
                <p className="text-sm text-ink-soft">{h.title}</p>
              </div>
            </div>

            <figure className="relative pt-12">
              <PiQuotesFill className="absolute top-0 -left-1 size-10 text-oss/25" aria-hidden />
              <blockquote className="relative max-w-[44ch] text-xl leading-relaxed text-ink md:text-2xl md:leading-relaxed">
                {h.quote}
              </blockquote>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
