import { Link } from "react-router";
import PersonPhoto from "../components/PersonPhoto";
import { humanPath, humanPhoto, humans } from "../lib/data";

export default function HumanOfOssPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="section-title">Human of OSS</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">Những con người và câu chuyện phía sau Olympia Sóc Sơn.</p>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {humans.map((h) => (
          <li key={h.slug}>
            <Link
              to={humanPath(h.slug)}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-oss/15 bg-white/80 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(109,40,217,0.5)]"
            >
              <PersonPhoto src={humanPhoto(h.slug)} name={h.name} className="aspect-[4/3] w-full" textClass="text-6xl" />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-lg font-bold text-ink group-hover:text-oss">{h.name}</span>
                <span className="text-sm text-ink-soft">{h.title}</span>
                <span className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink">“{h.quote}”</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
