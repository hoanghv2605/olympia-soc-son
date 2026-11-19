import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import PersonPhoto from "../components/PersonPhoto";
import { humanPath, humanPhoto, humans } from "../lib/data";

export default function HumanOfOssPage() {
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
        </ul>
      </section>
    </>
  );
}
