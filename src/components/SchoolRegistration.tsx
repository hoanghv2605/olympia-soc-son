import SeasonBarList from "./SeasonBarList";
import { schoolRegistration } from "../lib/data";
import { formatDecimalVi } from "../lib/format";
import { schoolColor } from "../lib/ratio";
import type { School } from "../types";

/** Mục "Đăng kí dự thi" ở trang trường: câu tóm tắt và số lượt theo từng mùa. */
export default function SchoolRegistration({ school }: { school: School }) {
  const { rows, registered, top12, max } = schoolRegistration(school.id);
  if (!rows.length) return null;
  return (
    <section className="mt-12">
      <h2 className="h2 text-ink">Đăng kí dự thi</h2>
      <p className="mt-2 max-w-[70ch] text-ink-soft">
        Qua {rows.length} mùa, {school.name} có {registered} lượt đăng kí dự thi và{" "}
        {top12 > 0
          ? `${top12} lượt vào top 12: cứ khoảng ${formatDecimalVi(registered / top12)} lượt đăng kí thì có 1 lượt vào top 12.`
          : "chưa có lượt nào vào top 12."}
      </p>
      <SeasonBarList
        max={max}
        color={schoolColor(school.id)}
        rows={rows.map((r) => ({
          season: r.season,
          count: r.registered,
          text: r.registered ? `${r.registered} đăng kí · ${r.top12} vào top 12` : "Không có đơn đăng kí",
        }))}
      />
    </section>
  );
}
