import { useState } from "react";
import { Link } from "react-router";
import PageHeader from "../../components/PageHeader";
import PersonLink from "../../components/PersonLink";
import SeasonCard from "../../components/SeasonCard";
import {
  championCards,
  championsList,
  people,
  seasonPath,
  seasons,
} from "../../lib/data";
import { formatDate, formatSchoolYear } from "../../lib/format";
import { usePageTitle } from "../../lib/hooks";

type View = "cards" | "table";
const VIEW_KEY = "oss-season-view";

function loadView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
}

export default function SeasonList() {
  usePageTitle("Mùa giải · OSSPEDIA");
  const [view, setView] = useState<View>(loadView);
  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* bỏ qua: chế độ riêng tư / chặn dữ liệu trang */
    }
  };
  const list = championsList();
  return (
    <>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { label: "Các mùa giải" },
        ]}
        title="Các mùa Olympia Sóc Sơn"
        description={`Quán quân, Á quân và Quý quân của ${seasons.length} mùa Olympia Sóc Sơn.`}
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-oss tabular-nums">
            {seasons.length} mùa · {people.length} thí sinh ·{" "}
            {championCards().length} Quán quân
          </p>
          <div className="inline-flex rounded-full border border-oss/25 bg-white/70 p-1 text-sm font-semibold">
            {(["cards", "table"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => choose(v)}
                className="min-h-9 rounded-full px-4 text-oss aria-pressed:bg-oss aria-pressed:text-white"
              >
                {v === "cards" ? "Thẻ" : "Bảng"}
              </button>
            ))}
          </div>
        </div>
        {view === "cards" ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...list]
              .sort((a, b) => a.season.season - b.season.season)
              .map(({ season }) => (
                <li key={season.season} className="flex">
                  <SeasonCard season={season} />
                </li>
              ))}
          </ul>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[48rem]">
              <thead>
                <tr>
                  <th scope="col" className="sticky-start">
                    Mùa
                  </th>
                  <th scope="col">Năm học</th>
                  <th scope="col">Chung kết</th>
                  <th scope="col">Quán quân</th>
                  <th scope="col">Á quân</th>
                  <th scope="col">Quý quân</th>
                </tr>
              </thead>
              <tbody>
                {list.map(({ season: s, champions, runnersUp, thirds }) => (
                  <tr key={s.season}>
                    <td className="sticky-start">
                      <Link
                        to={seasonPath(s.season)}
                        className="font-semibold text-oss hover:underline"
                      >
                        Mùa {s.season}
                      </Link>
                    </td>
                    <td className="tabular-nums">{formatSchoolYear(s.schoolYear)}</td>
                    <td className="tabular-nums">{formatDate(s.finalDate)}</td>
                    <td>
                      {champions.length
                        ? champions.map((c) => (
                            <PersonLink
                              key={c.person.id}
                              id={c.person.id}
                              className="block font-semibold"
                            />
                          ))
                        : "Đang cập nhật"}
                    </td>
                    <td>
                      {runnersUp.length
                        ? runnersUp.map((c) => (
                            <PersonLink
                              key={c.person.id}
                              id={c.person.id}
                              className="block"
                            />
                          ))
                        : "–"}
                    </td>
                    <td>
                      {thirds.length
                        ? thirds.map((c) => (
                            <PersonLink
                              key={c.person.id}
                              id={c.person.id}
                              className="block"
                            />
                          ))
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
