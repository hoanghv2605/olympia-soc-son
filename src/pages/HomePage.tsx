import { Link } from "react-router";
import { championsList, seasonPath, site } from "../lib/data";
import { CUBE_GRADIENT, HERO_GRADIENT, bgWithFallback, yearOf } from "../lib/format";

const LETTERS = ["O", "S", "S"];

export default function HomePage() {
  return (
    <>
      {/* ===== Hero: chữ O-S-S lồng ảnh + ảnh lớn + khẩu hiệu ===== */}
      <section className="mx-auto max-w-6xl px-5 pt-6 md:pt-10">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 md:gap-5">
          <div className="flex flex-col justify-between py-1" aria-hidden>
            {LETTERS.map((letter, i) => (
              <span
                key={i}
                className="photo-letter"
                style={{
                  backgroundImage: bgWithFallback(site.images.heroLetters[i], CUBE_GRADIENT),
                  animationDelay: `${i * 110}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          <div
            className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-cover bg-center md:min-h-[30rem]"
            style={{ backgroundImage: bgWithFallback(site.images.heroMain, HERO_GRADIENT) }}
            role="img"
            aria-label={site.images.heroCaption}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-black/55 via-black/10 to-black/25" />
            <h1 className="hero-slogan absolute top-5 right-5 max-w-[13ch] text-right text-3xl leading-[1.05] font-extrabold text-white uppercase drop-shadow-sm md:top-8 md:right-9 md:text-[3.25rem]">
              <span className="sr-only">{site.name}: </span>“{site.slogan}”
            </h1>
            <p className="absolute bottom-4 left-5 text-xs text-white/85 md:text-sm">{site.images.heroCaption}</p>
          </div>
        </div>
      </section>

      {/* ===== Giới thiệu ngắn ===== */}
      <section className="mx-auto mt-20 grid max-w-6xl gap-8 px-5 md:mt-28 md:grid-cols-[1fr_1.25fr] md:gap-16">
        <h2 className="text-3xl leading-tight font-bold text-oss md:text-[2.5rem]">
          Sân chơi kiến thức của học sinh Sóc Sơn từ năm {yearOf(site.foundedDate)}
        </h2>
        <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-ink-soft">
          <p>{site.intro[0]}</p>
          <Link to="/ve-chung-toi" className="link-strong">
            Tìm hiểu về Olympia Sóc Sơn
          </Link>
        </div>
      </section>

      {/* ===== Quán quân qua các mùa ===== */}
      <section className="mx-auto mt-20 mb-24 max-w-6xl px-5 md:mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">Quán quân qua các mùa</h2>
          <Link to="/wiki/cuoc-thi" className="link-strong text-sm">
            Xem trong OSSPEDIA
          </Link>
        </div>

        <ol className="mt-8 grid border-t border-oss/15 sm:grid-cols-2 lg:grid-cols-3">
          {championsList().map(({ season: s, champions }) => (
            <li key={s.season} className="border-b border-oss/15">
              <Link to={seasonPath(s.season)} className="group flex items-center gap-5 px-1 py-5 hover:bg-white/50">
                <span className="w-14 shrink-0 text-right text-5xl leading-none font-extrabold text-oss/20 tabular-nums group-hover:text-oss/40">
                  {s.season}
                </span>
                <span>
                  <span className="block text-lg font-semibold text-ink">
                    {champions.length ? champions.map((c) => c.person.name).join(", ") : "Đang cập nhật"}
                  </span>
                  <span className="block text-sm text-ink-soft">
                    Mùa {s.season}, {yearOf(s.finalDate)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
