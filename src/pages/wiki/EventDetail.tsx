import { Fragment, type ReactNode } from "react";
import Markdown from "react-markdown";
import { Link, useParams } from "react-router";
import { PiImages } from "react-icons/pi";
import CompetitionSections, { SeasonInfobox } from "../../components/CompetitionSections";
import { CompetitionContext } from "../../lib/competitionContext";
import { PiHourglass } from "react-icons/pi";
import PageHeader from "../../components/PageHeader";
import EventTypeChip from "../../components/EventTypeChip";
import LegendPopover from "../../components/LegendPopover";
import PersonPhoto from "../../components/PersonPhoto";
import PersonLink from "../../components/PersonLink";
import NotFound from "../NotFound";
import {
  EVENT_ROLE_LABEL,
  doc3,
  doc3Competition,
  EVENT_TYPE_LABEL,
  eventImage,
  eventLibraryCount,
  eventLibraryPath,
  eventNeighbors,
  eventParticipantPhoto,
  eventPath,
  eventRankLabel,
  eventShortName,
  eventTimeLabel,
  getEvent,
  getPerson,
  getSchool,
} from "../../lib/data";
import { formatDate } from "../../lib/format";
import { MEDAL_BADGE, MEDAL_ROW, medalOf } from "../../lib/medal";
import type { EventParticipant, SiteEvent } from "../../types";

const pillLink =
  "rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 font-semibold text-oss hover:border-oss";

function Pending() {
  return <span className="font-normal text-ink-soft">Đang cập nhật</span>;
}

/** Tên người chơi: link hồ sơ nếu có hồ sơ OSSPEDIA, còn lại là chữ thường. */
function ParticipantName({ p, className = "" }: { p: EventParticipant; className?: string }) {
  return p.person && getPerson(p.person) ? <PersonLink id={p.person} className={className} /> : <span className={className}>{p.name}</span>;
}

function schoolOf(p: EventParticipant) {
  return (p.school ? getSchool(p.school)?.name : undefined) ?? p.schoolName ?? "";
}

function EventNav({ id, spread = false, className = "" }: { id: string; spread?: boolean; className?: string }) {
  const { prev, next } = eventNeighbors(id);
  return (
    <nav aria-label="Chuyển sự kiện" className={`flex items-center gap-2 text-sm ${className}`}>
      {spread && !prev && <span />}
      {prev && (
        <Link to={eventPath(prev.id)} title={prev.name} className={pillLink}>
          ‹ Sự kiện trước
        </Link>
      )}
      {next && (
        <Link to={eventPath(next.id)} title={next.name} className={pillLink}>
          Sự kiện sau ›
        </Link>
      )}
    </nav>
  );
}

/** Phần riêng "xep-hang": bảng thí sinh tô màu vàng / bạc / đồng theo `rank`. */
function RankingSection({ event }: { event: SiteEvent }) {
  const list = event.participants ?? [];
  const legend = [
    { medal: "gold", label: eventRankLabel(1) },
    { medal: "silver", label: eventRankLabel(2) },
    { medal: "bronze", label: eventRankLabel(3) },
  ] as const;
  return (
    <section className="mt-12 md:mt-16">
      <div className="relative flex items-center gap-1">
        <h2 className="h2 text-ink">{event.sectionTitle ?? "Kết quả"}</h2>
        <LegendPopover label="Chú thích bảng kết quả">
          <ul className="space-y-2">
            {legend.map((it) => (
              <li key={it.medal} className="flex items-center gap-2">
                <span className={`size-4 shrink-0 rounded-sm border ${MEDAL_BADGE[it.medal]}`} aria-hidden />
                {it.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-soft">Thứ tự theo vị trí đứng của thí sinh trong trận.</p>
        </LegendPopover>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="data-table min-w-[30rem]">
          <thead>
            <tr>
              <th scope="col" className="sticky-start">
                Thí sinh
              </th>
              <th scope="col">Lớp</th>
              <th scope="col">Trường</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => {
              const medal = p.rank ? medalOf(p.rank) : null;
              return (
                <tr key={p.name} className={medal ? MEDAL_ROW[medal] : undefined} data-tone={medal ? "medal" : undefined}>
                  <td className="sticky-start">
                    <div className="flex items-center gap-2.5">
                      <PersonPhoto
                        decorative
                        src={eventParticipantPhoto(event, i)}
                        seed={p.person ?? p.name}
                        name={p.name}
                        className="size-8 shrink-0 rounded-full"
                      />
                      <div className="min-w-[7.5rem]">
                        <ParticipantName p={p} />
                        {p.rank && <span className="sr-only">. {eventRankLabel(p.rank)}</span>}
                      </div>
                    </div>
                  </td>
                  <td>{p.class ?? "–"}</td>
                  <td>{schoolOf(p) || "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Phần riêng "nguoi-choi": lưới thẻ gọn (ảnh 3:4, tên, ghi chú). */
function PlayersSection({ event }: { event: SiteEvent }) {
  const list = event.participants ?? [];
  return (
    <section className="mt-12 md:mt-16">
      <h2 className="h2 text-ink">{event.sectionTitle ?? "Người chơi"}</h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {list.map((p, i) => (
          <li key={p.name} className="overflow-hidden rounded-2xl border border-oss/15 bg-white/80">
            <PersonPhoto
              src={eventParticipantPhoto(event, i)}
              seed={p.person ?? p.name}
              name={p.name}
              className="aspect-[3/4] w-full"
            />
            <div className="p-3.5">
              <ParticipantName p={p} className="font-semibold" />
              {p.note && <p className="mt-1 text-sm text-ink-soft">{p.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const event = getEvent(id);
  if (!event) return <NotFound />;

  const photos = eventLibraryCount(event.id);
  const doc3Final = doc3.matches.find((m) => m.round === "chung-ket");
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Loại", value: EVENT_TYPE_LABEL[event.type] },
    { label: "Năm học", value: event.schoolYear ? event.schoolYear.replace("-", "–") : <Pending /> },
    { label: "Thời gian", value: event.date ? <span className="tabular-nums">{formatDate(event.date)}</span> : <Pending /> },
    { label: "Phạm vi", value: event.scope ?? <Pending /> },
    ...(event.organizer ? [{ label: "Đơn vị tổ chức", value: event.organizer as ReactNode }] : []),
    { label: "Vai trò của OSS", value: event.role ? EVENT_ROLE_LABEL[event.role] : <Pending /> },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/su-kien", label: "Sự kiện khác" },
          { label: eventShortName(event) },
        ]}
        title={event.name}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <EventTypeChip type={event.type} />
            <span>{eventTimeLabel(event)}</span>
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {photos > 0 && (
              <Link
                to={eventLibraryPath(event.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-oss hover:border-oss"
              >
                <PiImages className="size-4" aria-hidden />
                Thư viện ảnh
              </Link>
            )}
            <EventNav id={event.id} />
          </div>
        }
        backdrop={eventImage(event.id)}
      />
      <article className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 text-[17px] leading-relaxed">
            <h2 className="h2 text-ink">Giới thiệu</h2>
            {event.intro ? (
              <div className="mt-3 space-y-4">
                <Markdown>{event.intro}</Markdown>
              </div>
            ) : (
              <p className="mt-3 text-ink-soft">Thông tin về sự kiện đang được cập nhật.</p>
            )}
          </div>

          {/* Điện thoại: khung thông tin ở trên; máy tính: bên phải */}
          {event.format === "mua-thi" ? (
            // DOC3: infobox của trang mùa (dữ liệu doc3.json) + Đơn vị tổ chức, Vai trò của OSS
            <CompetitionContext.Provider value={doc3Competition}>
              <SeasonInfobox
                className="order-first md:order-last"
                code={doc3.season.code}
                schoolYear={doc3.season.schoolYear}
                startDate={doc3.season.startDate}
                finalDate={doc3.season.finalDate}
                hosts={doc3.season.hosts}
                champions={doc3Final?.results
                  .filter((r) => r.placement === "vo-dich")
                  .map((r) => ({ id: r.person, class: r.class, school: r.school })) ?? []}
                extraRows={[
                  ...(event.organizer ? [{ label: "Đơn vị tổ chức", value: event.organizer as ReactNode }] : []),
                  { label: "Vai trò của OSS", value: event.role ? EVENT_ROLE_LABEL[event.role] : <Pending /> },
                ]}
              />
            </CompetitionContext.Provider>
          ) : (
            <aside className="infobox order-first md:order-last" aria-label="Thông tin nhanh">
              <dl>
                {rows.map((r) => (
                  <Fragment key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </Fragment>
                ))}
              </dl>
            </aside>
          )}
        </div>

        {event.format === "xep-hang" && <RankingSection event={event} />}
        {event.format === "nguoi-choi" && <PlayersSection event={event} />}
        {event.format === "mua-thi" &&
          (doc3.qualifying.length === 0 && doc3.matches.length === 0 ? (
            <section className="mt-12 md:mt-16">
              <p className="flex items-center gap-2 rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-8 text-ink-soft">
                <PiHourglass className="size-5 shrink-0 text-oss" aria-hidden />
                Dữ liệu DOC3 đang được cập nhật.
              </p>
            </section>
          ) : (
            <CompetitionContext.Provider value={doc3Competition}>
              <CompetitionSections
                quals={doc3.qualifying}
                semis={doc3.matches.filter((m) => m.round === "ban-ket").sort((a, b) => a.number - b.number)}
                final={doc3Final}
                seededDraw={doc3.season.seededDraw}
                finalCaption={`Các thí sinh trận Chung kết ${doc3.season.code}`}
              />
            </CompetitionContext.Provider>
          ))}

        <EventNav id={event.id} spread className="mt-12 justify-between border-t border-oss/15 pt-6 md:mt-16" />
      </article>
    </>
  );
}
