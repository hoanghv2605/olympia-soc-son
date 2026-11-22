import type { ReactNode } from "react";
import { Link } from "react-router";
import type { IconType } from "react-icons";
import { PiCalendarBlank, PiConfetti, PiGraduationCap, PiUsersThree } from "react-icons/pi";
import Figure from "../../components/Figure";
import PageHeader from "../../components/PageHeader";
import PersonPhoto from "../../components/PersonPhoto";
import SchoolBadge from "../../components/SchoolBadge";
import SearchTrigger from "../../components/SearchTrigger";
import { EVENT_TYPE_LABEL, championsList, events, people, personPhoto, schools, seasons } from "../../lib/data";
import { yearOf } from "../../lib/format";
import { usePageTitle } from "../../lib/hooks";

const SHOWN = 5;

function Tile({
  to,
  icon: Icon,
  title,
  description,
  figure,
  preview,
}: {
  to: string;
  icon: IconType;
  title: string;
  description: string;
  figure: string;
  preview: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-2xl border border-oss/15 bg-white/80 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-visible:-translate-y-0.5 focus-visible:border-oss motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7"
    >
      <span aria-hidden className="grid size-14 place-items-center rounded-full bg-oss-soft text-oss">
        <Icon className="size-10" />
      </span>
      <h2 className="h2 mt-5 text-ink group-hover:text-oss">{title}</h2>
      <p className="mt-2 text-ink-soft">{description}</p>
      <Figure text={figure} className="mt-4 text-lg font-bold text-oss tabular-nums" />
      <div aria-hidden className="mt-auto pt-5">
        {preview}
      </div>
    </Link>
  );
}

export default function WikiHome() {
  usePageTitle("OSSPEDIA · Olympia Sóc Sơn");
  const first = seasons[0];
  const last = seasons[seasons.length - 1];
  const years = `${yearOf(first.startDate)}–${yearOf(last.startDate)}`;
  // Quán quân 5 mùa gần nhất (ảnh mùa của họ); người vô địch nhiều mùa chỉ tính 1 lần
  const seen = new Set<string>();
  const recent = championsList()
    .slice()
    .reverse()
    .flatMap(({ season, champions }) => champions.map((c) => ({ id: c.person.id, name: c.person.name, season: season.season })))
    .filter((c) => !seen.has(c.id) && !!seen.add(c.id))
    .slice(0, SHOWN);

  // 3 loại sự kiện đầu tiên khác nhau theo stt
  const eventTypes = [...new Set(events.map((e) => e.type))].slice(0, 3);

  return (
    <>
      <PageHeader
        title="OSSPEDIA"
        description="Bách khoa thư về Olympia Sóc Sơn: các mùa giải, thí sinh, trường, sự kiện và thành tích tại Đường lên đỉnh Olympia."
        wideDescription
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <SearchTrigger label="Tìm trong OSSPEDIA: thí sinh, mùa giải, trường, sự kiện" shortLabel="Tìm trong OSSPEDIA" className="max-w-xl" />

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          <Tile
            to="/wiki/cuoc-thi"
            icon={PiCalendarBlank}
            title="Mùa giải"
            description="Kết quả từng vòng, bảng điểm và diễn biến các trận Chung kết."
            figure={`${seasons.length} mùa · ${years}`}
            preview={
              <span className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-oss tabular-nums">
                {seasons.slice(0, 3).map((s) => (
                  <span key={s.season} className="grid h-7 min-w-7 place-items-center rounded-full bg-oss-soft px-2">
                    {s.season}
                  </span>
                ))}
                <span>…</span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-oss-soft px-2">{last.season}</span>
              </span>
            }
          />
          <Tile
            to="/wiki/thi-sinh"
            icon={PiUsersThree}
            title="Thí sinh"
            description="Hồ sơ, điểm số và danh hiệu của các thí sinh từng vào top 12."
            figure={`${people.length} thí sinh`}
            preview={
              <span className="flex flex-wrap items-center gap-y-2">
                {recent.map((c, i) => (
                  <PersonPhoto
                    key={c.id}
                    decorative
                    src={personPhoto(c.id, { season: c.season })}
                    seed={c.id}
                    name={c.name}
                    className={`size-10 shrink-0 rounded-full ring-2 ring-white ${i > 0 ? "-ml-3" : ""}`}
                  />
                ))}
                <span className="ml-3 text-sm font-semibold text-oss tabular-nums">+{Math.max(people.length - recent.length, 0)}</span>
              </span>
            }
          />
          <Tile
            to="/wiki/truong"
            icon={PiGraduationCap}
            title="Trường"
            description="Thành tích của các trường có thí sinh vào top 12."
            figure={`${schools.length} trường`}
            preview={
              <span className="flex flex-wrap items-center gap-y-2">
                {schools.slice(0, SHOWN).map((s, i) => (
                  <span key={s.id} className={`rounded-full bg-white ring-2 ring-white ${i > 0 ? "-ml-2" : ""}`}>
                    <SchoolBadge school={s} className="size-8" textClass="text-[10px]" />
                  </span>
                ))}
              </span>
            }
          />
          <Tile
            to="/wiki/su-kien"
            icon={PiConfetti}
            title="Sự kiện khác"
            description="Rung chuông vàng, tọa đàm giao lưu và các sự kiện OSS tổ chức hoặc phối hợp tổ chức."
            figure={`${events.length} sự kiện · ${Math.min(...events.map((e) => e.year))}–${Math.max(...events.map((e) => e.year))}`}
            preview={
              <span className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-oss">
                {eventTypes.map((t) => (
                  <span key={t} className="rounded-full bg-oss-soft px-2.5 py-1">
                    {EVENT_TYPE_LABEL[t]}
                  </span>
                ))}
              </span>
            }
          />
        </div>
      </section>
    </>
  );
}
