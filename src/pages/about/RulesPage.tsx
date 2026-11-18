import { rules } from "../../lib/data";

function seasonRange(seasons: number[]) {
  const [a, b] = seasons;
  return b === undefined || a === b ? `Mùa ${a}` : `Mùa ${a}–${b}`;
}

export default function RulesPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="section-title">Thể lệ</h1>
      <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed text-ink-soft">{rules.summary}</p>

      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {rules.rounds.map((r, i) => (
          <li key={r.id} className="rounded-xl border border-oss/15 bg-white/75 p-5">
            <span className="text-4xl leading-none font-extrabold text-oss/20 tabular-nums">{i + 1}</span>
            <h2 className="mt-2 text-lg font-bold text-oss">{r.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{r.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-ink">Các phần thi</h2>
          <ol className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
            {rules.parts.map((p, i) => (
              <li key={p} className="flex gap-4 px-1 py-2.5">
                <span className="w-5 font-semibold text-oss tabular-nums">{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">Ghi chú luật</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed marker:text-oss">
            {rules.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mt-14 text-xl font-bold text-ink">Đối tượng dự thi qua các giai đoạn</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="data-table min-w-[32rem]">
          <thead>
            <tr>
              <th scope="col">Giai đoạn</th>
              <th scope="col">Đối tượng</th>
            </tr>
          </thead>
          <tbody>
            {rules.eligibilityHistory.map((e) => (
              <tr key={e.seasons.join("-")}>
                <td className="font-semibold whitespace-nowrap text-oss">{seasonRange(e.seasons)}</td>
                <td>{e.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-xl font-bold text-ink">Thuật ngữ</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="data-table min-w-[28rem]">
          <thead>
            <tr>
              <th scope="col">Thuật ngữ</th>
              <th scope="col">Ý nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {rules.glossary.map((g) => (
              <tr key={g.term}>
                <td className="font-semibold whitespace-nowrap">{g.term}</td>
                <td>{g.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
