import { Link, useParams } from "react-router";
import PageHeader from "../../components/PageHeader";
import PersonLink from "../../components/PersonLink";
import SchoolBadge from "../../components/SchoolBadge";
import NotFound from "../NotFound";
import { describeTitles, getSchool, participationsOf, schoolStat, seasonPath, titlesOf } from "../../lib/data";

export default function SchoolDetail() {
  const { id } = useParams();
  const school = getSchool(id);
  if (!school) return <NotFound />;

  const stat = schoolStat(school);
  const numbers = [
    { label: "thí sinh", value: stat.people.length },
    { label: "lượt top 12", value: stat.top12 },
    { label: "Quán quân", value: stat.champions },
    { label: "Á quân", value: stat.runnersUp },
    { label: "Quý quân", value: stat.thirds },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/truong", label: "Trường" },
          { label: school.name },
        ]}
        leading={<SchoolBadge school={school} className="size-16" textClass="text-lg" />}
        title={school.name}
        description={`Thí sinh và thành tích của ${school.name} tại Olympia Sóc Sơn.`}
      />
      <article className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {numbers.map((n) => (
            <li key={n.label} className="rounded-xl border border-oss/15 bg-white/75 p-4 text-center">
              <span className="block text-3xl font-extrabold text-oss tabular-nums">{n.value}</span>
              <span className="mt-1 block text-sm text-ink-soft">{n.label}</span>
            </li>
          ))}
        </ul>

        <h2 className="h2 mt-12 text-ink">Thí sinh</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table min-w-[36rem]">
            <thead>
              <tr>
                <th scope="col" className="sticky-start">
                  Thí sinh
                </th>
                <th scope="col">Mùa (hạng vòng loại)</th>
                <th scope="col">Danh hiệu OSS</th>
              </tr>
            </thead>
            <tbody>
              {stat.people.map((p) => {
                const titles = describeTitles(titlesOf(p.id));
                return (
                  <tr key={p.id}>
                    <td className="sticky-start">
                      <PersonLink id={p.id} className="font-semibold" />
                    </td>
                    <td>
                      {participationsOf(p.id).map((s, i) => (
                        <span key={s.season}>
                          {i > 0 && ", "}
                          <Link to={seasonPath(s.season)} className="hover:text-oss hover:underline">
                            Mùa {s.season}
                          </Link>
                          {s.qualifying && <span className="text-ink-soft"> ({s.qualifying.rank})</span>}
                        </span>
                      ))}
                    </td>
                    <td>{titles.length ? titles.join("; ") : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
