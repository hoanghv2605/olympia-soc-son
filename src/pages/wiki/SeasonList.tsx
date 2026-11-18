import { Link } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import PersonLink from "../../components/PersonLink";
import { championsList, seasonPath } from "../../lib/data";
import { formatDate } from "../../lib/format";

export default function SeasonList() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb items={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Các mùa giải" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Các mùa Olympia Sóc Sơn</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="data-table min-w-[48rem]">
          <thead>
            <tr>
              <th scope="col">Mùa</th>
              <th scope="col">Năm học</th>
              <th scope="col">Chung kết</th>
              <th scope="col">Quán quân</th>
              <th scope="col">Á quân</th>
              <th scope="col">Quý quân</th>
            </tr>
          </thead>
          <tbody>
            {championsList().map(({ season: s, champions, runnersUp, thirds }) => (
              <tr key={s.season}>
                <td>
                  <Link to={seasonPath(s.season)} className="font-semibold text-oss hover:underline">
                    Mùa {s.season}
                  </Link>
                </td>
                <td className="tabular-nums">{s.schoolYear}</td>
                <td className="tabular-nums">{formatDate(s.finalDate)}</td>
                <td>
                  {champions.length
                    ? champions.map((c) => <PersonLink key={c.person.id} id={c.person.id} className="block font-semibold" />)
                    : "Đang cập nhật"}
                </td>
                <td>
                  {runnersUp.length
                    ? runnersUp.map((c) => <PersonLink key={c.person.id} id={c.person.id} className="block" />)
                    : "–"}
                </td>
                <td>
                  {thirds.length
                    ? thirds.map((c) => <PersonLink key={c.person.id} id={c.person.id} className="block" />)
                    : "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
