import { Fragment, type ReactNode } from "react";
import Markdown from "react-markdown";
import { Link, useParams } from "react-router";
import { PiImages } from "react-icons/pi";
import AwardPhoto from "../../components/AwardPhoto";
import DocSections, { DocToc } from "../../components/DocSections";
import PageHeader from "../../components/PageHeader";
import EventTypeChip from "../../components/EventTypeChip";
import LegendPopover from "../../components/LegendPopover";
import PersonPhoto from "../../components/PersonPhoto";
import PersonLink from "../../components/PersonLink";
import ResultBadge from "../../components/ResultBadge";
import NotFound from "../NotFound";
import {
  EVENT_RESULT_LABEL,
  EVENT_ROLE_LABEL,
  EVENT_TYPE_LABEL,
  docChampions,
  eventAwardPhoto,
  eventDateLabel,
  eventImage,
  eventLibraryCount,
  eventLibraryPath,
  eventNeighbors,
  eventParticipantPhoto,
  eventPath,
  eventResultMedal,
  eventTimeLabel,
  getDoc,
  getEvent,
  getPerson,
  getSchool,
} from "../../lib/data";
import { formatSchoolYear } from "../../lib/format";
import { MEDAL_BADGE, MEDAL_ROW } from "../../lib/medal";
import type { EventParticipant, SiteEvent } from "../../types";
import { usePageTitle } from "../../lib/hooks";

const pillLink =
  "rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 font-semibold text-oss hover:border-oss";

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

/** Chú thích màu dòng (nút ⓘ): Giải Nhất / Nhì / Ba. */
function ResultLegend() {
  const legend = [
    { medal: "gold", label: EVENT_RESULT_LABEL["giai-nhat"] },
    { medal: "silver", label: EVENT_RESULT_LABEL["giai-nhi"] },
    { medal: "bronze", label: EVENT_RESULT_LABEL["giai-ba"] },
  ] as const;
  return (
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
  );
}

/** Bảng một trận: Thí sinh (ảnh tròn), Lớp, Trường; màu dòng theo `result`; thứ tự = vị trí đứng. */
function MatchTableEvent({ event, list }: { event: SiteEvent; list: EventParticipant[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="data-table min-w-[36rem]">
        <thead>
          <tr>
            <th scope="col" className="sticky-start">
              Thí sinh
            </th>
            <th scope="col">Lớp</th>
            <th scope="col">Trường</th>
            <th scope="col">Kết quả</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => {
            const medal = eventResultMedal(p.result);
            return (
              <tr key={p.name} className={medal ? MEDAL_ROW[medal] : undefined} data-tone={medal ? "medal" : undefined}>
                <td className="sticky-start">
                  <div className="flex items-center gap-2.5">
                    <PersonPhoto
                      decorative
                      src={eventParticipantPhoto(event, p)}
                      seed={p.person ?? p.name}
                      name={p.name}
                      className="size-8 shrink-0 rounded-full"
                    />
                    <div className="min-w-[7.5rem]">
                      <ParticipantName p={p} />
                    </div>
                  </div>
                </td>
                <td>{p.class ?? "–"}</td>
                <td>{schoolOf(p) || "–"}</td>
                <td>{p.result ? <ResultBadge medal={medal}>{EVENT_RESULT_LABEL[p.result]}</ResultBadge> : "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Phần riêng "xep-hang": mỗi trận một bảng. 1 trận: h2 = tên trận; nhiều trận: h2 "Các trận giao hữu", mỗi trận một h3. */
function RankingSection({ event }: { event: SiteEvent }) {
  const list = event.matches ?? [];
  if (!list.length) return null;
  const single = list.length === 1;
  return (
    <section className="mt-12 md:mt-16">
      <div className="relative flex items-center gap-1">
        <h2 className="h2 text-ink">{single ? list[0].title : "Các trận giao hữu"}</h2>
        <ResultLegend />
      </div>
      {list.map((m) => (
        <div key={m.title} className={single ? "" : "mt-6"}>
          {!single && <h3 className="h3 text-ink">{m.title}</h3>}
          <MatchTableEvent event={event} list={m.participants} />
        </div>
      ))}
    </section>
  );
}

/** Phần riêng "doi": bảng 2 cột Đội, Kết quả theo thứ tự trong file; không hiện thành viên. */
function TeamsSection({ event }: { event: SiteEvent }) {
  const list = event.teams ?? [];
  if (!list.length) return null;
  return (
    <section className="mt-12 md:mt-16">
      <div className="relative flex items-center gap-1">
        <h2 className="h2 text-ink">{event.sectionTitle ?? "Kết quả"}</h2>
        <ResultLegend />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="data-table min-w-[22rem]">
          <thead>
            <tr>
              <th scope="col" className="sticky-start">
                Đội
              </th>
              <th scope="col">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const medal = eventResultMedal(t.result);
              return (
                <tr key={t.name} className={medal ? MEDAL_ROW[medal] : undefined} data-tone={medal ? "medal" : undefined}>
                  <td className="sticky-start font-semibold">{t.name}</td>
                  <td>{EVENT_RESULT_LABEL[t.result]}</td>
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
        {list.map((p) => (
          <li key={p.name} className="overflow-hidden rounded-2xl border border-oss/15 bg-white/80">
            <PersonPhoto
              src={eventParticipantPhoto(event, p)}
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
  usePageTitle(event && `${event.name} · OSSPEDIA`);
  if (!event) return <NotFound />;

  const photos = eventLibraryCount(event.id);
  const doc = getDoc(event);
  const award = eventAwardPhoto(event);
  const awardEl = award && <AwardPhoto src={award.src} caption={award.caption} />;

  // Quán quân: sự kiện dạng mùa thi lấy từ Chung kết; còn lại là `winner` trong events.json
  const winner =
    event.format === "mua-thi"
      ? docChampions(event).length
        ? {
            label: "Quán quân",
            value: (
              <>
                {docChampions(event).map((c) => (
                  <span key={c.name} className="block">
                    {c.ossPerson && getPerson(c.ossPerson) ? <PersonLink id={c.ossPerson} className="font-semibold" /> : c.name}
                  </span>
                ))}
              </>
            ),
          }
        : undefined
      : event.winner
        ? {
            label: event.winner.label,
            value:
              event.winner.person && getPerson(event.winner.person) ? (
                <PersonLink id={event.winner.person} className="font-semibold" />
              ) : (
                event.winner.name
              ),
          }
        : undefined;

  // Khung thông tin: dòng nào không có dữ liệu thì ẩn
  const time = eventDateLabel(event);
  const rows: { label: string; value: ReactNode }[] = [
    ...(event.aka ? [{ label: "Tên khác", value: event.aka }] : []),
    { label: "Loại", value: EVENT_TYPE_LABEL[event.type] },
    ...(event.occasion ? [{ label: "Sự kiện", value: event.occasion }] : []),
    ...(event.schoolYear ? [{ label: "Năm học", value: formatSchoolYear(event.schoolYear) }] : []),
    ...(time ? [{ label: "Thời gian", value: <span className="tabular-nums">{time}</span> }] : []),
    ...(event.scope ? [{ label: "Phạm vi", value: event.scope }] : []),
    ...(event.organizer ? [{ label: "Đơn vị tổ chức", value: event.organizer }] : []),
    ...(event.role ? [{ label: "Vai trò của OSS", value: EVENT_ROLE_LABEL[event.role] }] : []),
    ...(event.hosts?.length ? [{ label: "Dẫn chương trình", value: event.hosts.join(", ") }] : []),
    ...(winner ? [winner] : []),
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/su-kien", label: "Sự kiện khác" },
          { label: event.name },
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
            {/* Sự kiện dạng mùa thi: phần giới thiệu là lời mở đầu (như trang mùa OSS), không có tiêu đề */}
            {event.format !== "mua-thi" && <h2 className="h2 text-ink">Giới thiệu</h2>}
            {event.intro ? (
              <div className={`${event.format !== "mua-thi" ? "mt-3 " : ""}space-y-4`}>
                <Markdown>{event.intro}</Markdown>
              </div>
            ) : (
              <p className="mt-3 text-ink-soft">Thông tin về sự kiện đang được cập nhật.</p>
            )}
            {event.format === "mua-thi" && doc && <DocToc doc={doc} />}
          </div>

          {/* Điện thoại: khung thông tin ở trên; máy tính: bên phải */}
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
        </div>

        {event.format === "xep-hang" && <RankingSection event={event} />}
        {event.format === "doi" && <TeamsSection event={event} />}
        {event.format === "nguoi-choi" && <PlayersSection event={event} />}
        {event.format === "mua-thi" && doc && <DocSections event={event} doc={doc} award={awardEl} />}

        {/* Ảnh trao giải: sau phần riêng của sự kiện (hoặc sau Giới thiệu nếu không có phần riêng); dạng mùa thi nằm sau bảng Chung kết */}
        {event.format !== "mua-thi" && awardEl && <div className="mt-12 md:mt-16">{awardEl}</div>}

        <EventNav id={event.id} spread className="mt-12 justify-between border-t border-oss/15 pt-6 md:mt-16" />
      </article>
    </>
  );
}
