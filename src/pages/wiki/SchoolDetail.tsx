import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
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
    <article className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb
        items={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/truong", label: "Trường" },
          { label: school.name },
        ]}
      />
      <div className="mt-4 flex items-center gap-4">
        <SchoolBadge school={school} className="size-16" textClass="text-lg" />
        <h1 className="text-3xl font-bold text-ink md:text-4xl">{school.name}</h1>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {numbers.map((n) => (
          <li key={n.label} className="rounded-xl border border-oss/15 bg-white/75 p-4 text-center">
            <span className="block text-3xl font-extrabold text-oss tabular-nums">{n.value}</span>
            <span className="mt-1 block text-sm text-ink-soft">{n.label}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-xl font-bold text-ink">Thí sinh</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="data-table min-w-[36rem]">
          <thead>
            <tr>
              <th scope="col">Thí sinh</th>
              <th scope="col">Mùa (hạng vòng loại)</th>
              <th scope="col">Danh hiệu OSS</th>
            </tr>
          </thead>
          <tbody>
            {stat.people.map((p) => {
              const titles = describeTitles(titlesOf(p.id));
              return (
                <tr key={p.id}>
                  <td>
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
  );
}
