import { Link } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import { schoolPath, schoolStats } from "../../lib/data";

export default function SchoolList() {
  const stats = schoolStats();
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb items={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Trường" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Các trường</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">Thống kê thí sinh và thành tích của từng trường qua các mùa Olympia Sóc Sơn.</p>

      <div className="mt-8 overflow-x-auto">
        <table className="data-table min-w-[40rem]">
          <thead>
            <tr>
              <th scope="col">Trường</th>
              <th scope="col" className="text-right">Thí sinh</th>
              <th scope="col" className="text-right">Lượt top 12</th>
              <th scope="col" className="text-right">Vô địch</th>
              <th scope="col" className="text-right">Á quân</th>
              <th scope="col" className="text-right">Giải Ba</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.school.id}>
                <td>
                  <Link to={schoolPath(s.school.id)} className="font-semibold text-oss hover:underline">
                    {s.school.name}
                  </Link>
                </td>
                <td className="text-right tabular-nums">{s.people.length}</td>
                <td className="text-right tabular-nums">{s.top12}</td>
                <td className="text-right tabular-nums">{s.champions}</td>
                <td className="text-right tabular-nums">{s.runnersUp}</td>
                <td className="text-right tabular-nums">{s.thirds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
