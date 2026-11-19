import { Link } from "react-router";
import { PiCalendarBlank, PiGraduationCap, PiUsersThree } from "react-icons/pi";
import IconLabel from "../../components/IconLabel";
import PageHeader from "../../components/PageHeader";
import SearchTrigger from "../../components/SearchTrigger";
import { championsList, people, schoolPath, schools, seasonPath } from "../../lib/data";

export default function WikiHome() {
  return (
    <>
      <PageHeader
        title="OSSPEDIA"
        description="Bách khoa thư về Olympia Sóc Sơn: các mùa giải, thí sinh, trường và thành tích tại Đường lên đỉnh Olympia."
        wideDescription
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <SearchTrigger label="Tìm trong OSSPEDIA: thí sinh, mùa giải, trường" className="max-w-xl" />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3">
          <div>
            <h2 className="h3 text-ink">
              <IconLabel icon={PiCalendarBlank} iconClass="size-[0.9em] text-oss">
                Các mùa giải
              </IconLabel>
            </h2>
            <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
              {championsList().map(({ season: s, champions }) => (
                <li key={s.season}>
                  <Link to={seasonPath(s.season)} className="flex justify-between gap-4 px-1 py-2.5 hover:bg-white/50">
                    <span className="font-medium text-oss">Mùa {s.season}</span>
                    <span className="text-right text-ink-soft">{champions.map((c) => c.person.name).join(", ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/wiki/cuoc-thi" className="link-strong mt-4 inline-block text-sm">
              Bảng tổng hợp các mùa
            </Link>
          </div>

          <div>
            <h2 className="h3 text-ink">
              <IconLabel icon={PiUsersThree} iconClass="size-[0.9em] text-oss">
                Thí sinh
              </IconLabel>
            </h2>
            <p className="mt-4 text-ink-soft">
              Hồ sơ {people.length} thí sinh lọt vào top 12: điểm từng trận, danh hiệu và hành trình tại Đường lên đỉnh Olympia.
            </p>
            <Link to="/wiki/thi-sinh" className="link-strong mt-4 inline-block text-sm">
              Danh sách thí sinh
            </Link>
          </div>

          <div>
            <h2 className="h3 text-ink">
              <IconLabel icon={PiGraduationCap} iconClass="size-[0.9em] text-oss">
                Trường
              </IconLabel>
            </h2>
            <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
              {schools.map((s) => (
                <li key={s.id}>
                  <Link to={schoolPath(s.id)} className="block px-1 py-2.5 font-medium text-oss hover:bg-white/50">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/wiki/truong" className="link-strong mt-4 inline-block text-sm">
              Thống kê các trường
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
