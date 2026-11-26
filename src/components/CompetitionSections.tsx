import type { ReactNode } from "react";
import { PiCalendarBlank, PiCrown, PiMicrophone } from "react-icons/pi";
import ClimbChart from "./ClimbChart";
import IconLabel from "./IconLabel";
import LegendPopover from "./LegendPopover";
import MatchPhoto from "./MatchPhoto";
import MatchTable, { FinalLegendBody, SemiLegendBody } from "./MatchTable";
import PersonLink from "./PersonLink";
import RelatedStories from "./RelatedStories";
import { useCompetition } from "../lib/competitionContext";
import { matchCode, matchPhoto } from "../lib/data";
import { formatDate, formatSchoolYear, formatScore } from "../lib/format";
import type { Match, QualifyingEntry } from "../types";

function Pending() {
  return <span className="font-normal text-ink-soft">Đang cập nhật</span>;
}

/** Quán quân hiển thị ở khung thông tin. */
export interface InfoChampion {
  id: string;
  class: string;
  school: string;
}

/**
 * Khung thông tin nhanh của một mùa / cuộc thi (dùng cho trang mùa OSS và trang DOC3).
 * Trường trống (null, mảng rỗng) hiện "Đang cập nhật". `extraRows`: thêm dòng ở cuối (vd Đơn vị tổ chức).
 */
export function SeasonInfobox({
  code,
  schoolYear,
  startDate,
  finalDate,
  hosts,
  champions,
  extraRows,
  className = "",
}: {
  code: string;
  schoolYear: string;
  startDate: string | null;
  finalDate: string | null;
  hosts: string[];
  champions: InfoChampion[];
  extraRows?: { label: string; value: ReactNode }[];
  /** Lớp thêm (vd "order-first md:order-last": điện thoại ở trên, máy tính bên phải) */
  className?: string;
}) {
  const comp = useCompetition();
  const time =
    startDate && finalDate ? `${formatDate(startDate)} – ${formatDate(finalDate)}` : startDate ? formatDate(startDate) : finalDate ? formatDate(finalDate) : null;
  return (
    <aside className={`infobox ${className}`.trim()} aria-label="Thông tin nhanh">
      <dl>
        <dt>Tên khác</dt>
        <dd>{code}</dd>
        <dt>Năm học</dt>
        <dd>{formatSchoolYear(schoolYear)}</dd>
        <dt>
          <IconLabel icon={PiCalendarBlank}>Thời gian</IconLabel>
        </dt>
        <dd className="tabular-nums">{time ?? <Pending />}</dd>
        <dt>
          <IconLabel icon={PiMicrophone}>Dẫn chương trình</IconLabel>
        </dt>
        <dd>
          {hosts.length ? (
            <ul>
              {hosts.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : (
            <Pending />
          )}
        </dd>
        <dt>
          <IconLabel icon={PiCrown}>Quán quân</IconLabel>
        </dt>
        <dd>
          {champions.length ? (
            champions.map((c) => (
              <span key={c.id} className="block">
                <PersonLink id={c.id} className="font-semibold" />
                <span className="block text-xs font-normal text-ink-soft">
                  Lớp {c.class}, {comp.schoolName(c.school)}
                </span>
              </span>
            ))
          ) : (
            <Pending />
          )}
        </dd>
        {extraRows?.map((r) => (
          <FragmentRow key={r.label} label={r.label}>
            {r.value}
          </FragmentRow>
        ))}
      </dl>
    </aside>
  );
}

function FragmentRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

/**
 * Các phần thi của một mùa / cuộc thi, theo thứ tự: Vòng loại, Vòng Bán kết, Trận Chung kết (kèm biểu đồ, ảnh trận, ⓘ).
 * Phần nào rỗng thì ẩn. Dùng chung cho trang mùa OSS (nguồn mặc định) và trang DOC3 (bọc `CompetitionContext`).
 */
export default function CompetitionSections({
  quals,
  semis,
  final,
  seededDraw,
  finalCaption,
}: {
  quals: QualifyingEntry[];
  semis: Match[];
  final?: Match;
  seededDraw: boolean;
  /** Chú thích ảnh Chung kết, vd "Các thí sinh trận Chung kết mùa 10" */
  finalCaption: string;
}) {
  const comp = useCompetition();
  return (
    <>
      {quals.length > 0 && (
        <section id="vong-loai" className="mt-12 scroll-mt-24 md:mt-16">
          <h2 className="h2 text-ink">Vòng loại</h2>
          <p className="mt-2 max-w-[70ch] text-ink-soft">
            {quals.length} thí sinh có kết quả cao nhất vào vòng Bán kết.
            {seededDraw &&
              " Các thí sinh được chia vào 3 trận Bán kết bằng bốc thăm theo nhóm hạt giống: nhóm 1 gồm hạng 1–3, nhóm 2 hạng 4–6, nhóm 3 hạng 7–9, nhóm 4 hạng 10–12."}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="data-table md:min-w-[36rem]">
              <thead>
                <tr>
                  <th scope="col" className="num">
                    Hạng
                  </th>
                  <th scope="col" className="sticky-start">
                    Thí sinh
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Lớp
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Trường
                  </th>
                  <th scope="col" className="num text-right">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {quals.map((q) => (
                  <tr key={q.person}>
                    <td className="num">{q.rank}</td>
                    <td className="sticky-start">
                      <PersonLink id={q.person} />
                      {/* Điện thoại: "{lớp} - {trường}" thành dòng nhỏ (cột Lớp, Trường bị ẩn) */}
                      <span className="block text-xs text-ink-soft md:hidden">
                        {q.class} - {comp.schoolName(q.school)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell">{q.class}</td>
                    <td className="hidden md:table-cell">{comp.schoolName(q.school)}</td>
                    <td className="num text-right font-semibold">{formatScore(q.score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <RelatedStories season={quals[0].season} code="vl" />
        </section>
      )}

      {semis.length > 0 && (
        <section id="ban-ket" className="mt-12 scroll-mt-24 md:mt-16">
          <div className="relative flex items-center gap-1">
            <h2 className="h2 text-ink">Vòng Bán kết</h2>
            <LegendPopover label="Chú thích bảng Bán kết">
              <SemiLegendBody />
            </LegendPopover>
          </div>
          <div className="mt-6 space-y-12">
            {semis.map((m) => (
              <MatchTable
                key={m.id}
                match={m}
                id={`ban-ket-${m.number}`}
                photo={matchPhoto(m.id) ? <MatchPhoto match={m} caption={`Các thí sinh của trận Bán kết ${m.number}`} /> : undefined}
                footer={<RelatedStories season={m.season} code={matchCode(m)} />}
              />
            ))}
          </div>
        </section>
      )}

      {final && (
        <section id="chung-ket" className="mt-12 scroll-mt-24 md:mt-16">
          <div className="relative flex items-center gap-1">
            <h2 className="h2 text-ink">Trận Chung kết</h2>
            <LegendPopover label="Chú thích bảng Chung kết">
              <FinalLegendBody />
            </LegendPopover>
          </div>
          <div className="mt-6">
            <MatchTable match={final} />
            <ClimbChart match={final} />
            <RelatedStories season={final.season} code={matchCode(final)} />
            {matchPhoto(final.id) && (
              <div className="mt-8">
                <MatchPhoto match={final} caption={finalCaption} />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
