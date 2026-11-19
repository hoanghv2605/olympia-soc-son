import { Link } from "react-router";
import { cubeOutlineDataUrl } from "../components/CubeOutline";
import DidYouKnow from "../components/DidYouKnow";
import HeroTiles from "../components/HeroTiles";
import HomeEntrances from "../components/HomeEntrances";
import { championsList, seasonPath, site } from "../lib/data";
import { CUBE_GRADIENT, HERO_GRADIENT, asset, bgWithFallback, yearOf } from "../lib/format";

const LETTERS = ["O", "S", "S"];

/**
 * Nền ảnh lớn: ảnh thật (nếu có) phủ trên cùng; chưa có ảnh thì lộ ra họa tiết khối lập phương
 * trên nền tím chuyển màu (HERO_GRADIENT gồm 2 lớp).
 */
const HERO_LAYERS = [
  ...(site.images.heroMain ? [{ image: `url("${asset(site.images.heroMain)}")`, size: "cover", position: "center" }] : []),
  { image: cubeOutlineDataUrl("#ffffff", 0.22), size: "min(60%, 26rem) auto", position: "right -6% bottom -24%" },
  ...HERO_GRADIENT.split(/,\s*(?=(?:radial|linear)-gradient)/).map((image) => ({ image, size: "cover", position: "center" })),
];
const HERO_BG = {
  backgroundImage: HERO_LAYERS.map((l) => l.image).join(", "),
  backgroundSize: HERO_LAYERS.map((l) => l.size).join(", "),
  backgroundPosition: HERO_LAYERS.map((l) => l.position).join(", "),
  backgroundRepeat: "no-repeat",
};

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
            className="relative min-h-[22rem] overflow-hidden rounded-2xl md:min-h-[30rem]"
            style={HERO_BG}
            role="img"
            aria-label={site.images.heroCaption}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-black/55 via-black/10 to-black/25" />
            {/* Thứ tự lớp: ảnh < các ô lật (z-10) < chữ trên ảnh (z-20) */}
            <HeroTiles />
            <h1 className="hero-slogan font-display absolute top-5 right-5 z-20 max-w-[13ch] text-right text-3xl leading-[1.25] font-extrabold text-white drop-shadow-sm md:top-8 md:right-9 md:text-[3.25rem]">
              <span className="sr-only">{site.name}: </span>“{site.slogan}”
            </h1>
            <p className="absolute bottom-4 left-5 z-20 text-xs text-white/85 md:text-sm">{site.images.heroCaption}</p>
          </div>
        </div>
      </section>

      {/* ===== Giới thiệu ngắn ===== */}
      <section className="section mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1fr_1.25fr] md:gap-16">
        <h2 className="h1 text-oss">Sân chơi kiến thức của học sinh Sóc Sơn từ năm {yearOf(site.foundedDate)}</h2>
        <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-ink-soft">
          <p>{site.intro[0]}</p>
          <Link to="/ve-chung-toi" className="link-strong">
            Tìm hiểu về Olympia Sóc Sơn
          </Link>
        </div>
      </section>

      {/* ===== Lối vào ===== */}
      <section aria-labelledby="loi-vao" className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
        <h2 id="loi-vao" className="sr-only">
          Lối vào
        </h2>
        <HomeEntrances />
      </section>

      {/* ===== Bạn có biết? ===== */}
      <section aria-label="Bạn có biết?" className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
        <DidYouKnow />
      </section>

      {/* ===== Quán quân qua các mùa ===== */}
      <section className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
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
                <span className="font-display w-14 shrink-0 text-right text-5xl leading-none font-extrabold text-oss/20 tabular-nums group-hover:text-oss/40">
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
