import { Link } from "react-router";
import { cubeOutlineDataUrl } from "../components/CubeOutline";
import DidYouKnow from "../components/DidYouKnow";
import HeroTiles from "../components/HeroTiles";
import HomeEntrances from "../components/HomeEntrances";
import LatestSeason from "../components/LatestSeason";
import MapSection from "../components/MapSection";
import Section from "../components/Section";
import Partners from "../components/Partners";
import Testimonials from "../components/Testimonials";
import { finalPhoto, heroSeason, latestFinalSeason, partners, seasonPath, site, testimonials } from "../lib/data";
import { hasImage, imageFocus } from "../lib/images";
import { CUBE_GRADIENT, HERO_GRADIENT, asset, yearOf } from "../lib/format";
import { usePageTitle } from "../lib/hooks";

const LETTERS = ["O", "S", "S"];
/** Lớp tím chồng lên ảnh trong chữ: vùng sáng của ảnh (áo trắng, tường) không làm chữ chìm, 3 chữ đồng bộ màu OSS. */
const LETTER_TINT = "linear-gradient(rgba(109, 40, 217, 0.35), rgba(109, 40, 217, 0.35))";

/** Nền dự phòng (khi chưa có ảnh): họa tiết khối lập phương trên nền tím chuyển màu (HERO_GRADIENT gồm 2 lớp). */
const HERO_LAYERS = [
  { image: cubeOutlineDataUrl("#ffffff", 0.22), size: "min(60%, 26rem) auto", position: "right -6% bottom -24%" },
  ...HERO_GRADIENT.split(/,\s*(?=(?:radial|linear)-gradient)/).map((image) => ({ image, size: "cover", position: "center" })),
];
const HERO_BG = {
  backgroundImage: HERO_LAYERS.map((l) => l.image).join(", "),
  backgroundSize: HERO_LAYERS.map((l) => l.size).join(", "),
  backgroundPosition: HERO_LAYERS.map((l) => l.position).join(", "),
  backgroundRepeat: "no-repeat",
};

/** Lớp phủ tối trên ảnh Chung kết: đậm ở góc trên phải (chỗ khẩu hiệu, ~85% nhờ lớp radial cộng lớp 75%), nhạt dần về trái, thêm dải tối mỏng mép dưới cho chú thích. */
const HERO_SCRIM = {
  backgroundImage:
    "radial-gradient(ellipse at top right, rgba(30, 10, 60, 0.4), transparent 55%), linear-gradient(to top, rgba(30, 10, 60, 0.55), transparent 22%), linear-gradient(to bottom left, rgba(30, 10, 60, 0.75), rgba(30, 10, 60, 0.15))",
};

/** Nút trên ảnh lớn: viền focus trắng để thấy được trên ảnh tối. */
const HERO_BUTTON =
  "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold focus-visible:outline-white md:min-h-11 md:px-5 md:text-sm";

export default function HomePage() {
  usePageTitle("Olympia Sóc Sơn");
  // Ảnh lớn = ảnh Chung kết của mùa lớn nhất có ảnh; O, S, S = 3 mùa liền trước (cũ → mới)
  const heroN = heroSeason();
  const finalImage = heroN ? finalPhoto(heroN) : undefined;
  const mainImage = finalImage ?? (hasImage(site.images.heroMain) ? site.images.heroMain : undefined);
  const caption = heroN ? `Chung kết Olympia Sóc Sơn mùa ${heroN}` : site.images.heroCaption;
  // Ảnh lớn và 2 nút dẫn tới mùa mới nhất đã có Chung kết (cùng cách khối "Chung kết mùa n")
  const latest = latestFinalSeason()?.season;
  const letters = LETTERS.map((letter, i) => {
    const n = heroN ? heroN - 3 + i : 0;
    return { letter, n, photo: n >= 1 ? finalPhoto(n) : undefined };
  });

  return (
    <>
      {/* ===== Hero: chữ O-S-S lồng ảnh + ảnh lớn + khẩu hiệu ===== */}
      <section className="mx-auto max-w-6xl px-5 pt-6 md:pt-10">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 md:gap-5">
          <div className="flex flex-col justify-between py-1">
            {letters.map(({ letter, n, photo }, i) =>
              photo ? (
                <div key={i} className="letter-wrap relative">
                  <Link
                    to={seasonPath(n)}
                    aria-label={`Chung kết mùa ${n}`}
                    className="photo-letter letter-link"
                    style={{
                      backgroundImage: `${LETTER_TINT}, url("${asset(photo)}")`,
                      backgroundSize: "cover",
                      backgroundPosition: imageFocus(photo),
                      animationDelay: `${i * 110}ms`,
                    }}
                  >
                    {letter}
                  </Link>
                  <span className="letter-tip" aria-hidden>
                    Chung kết mùa {n}
                  </span>
                </div>
              ) : (
                <span
                  key={i}
                  aria-hidden
                  className="photo-letter"
                  style={{ backgroundImage: CUBE_GRADIENT, animationDelay: `${i * 110}ms` }}
                >
                  {letter}
                </span>
              ),
            )}
          </div>

          <div className="relative min-h-[24rem] overflow-hidden rounded-2xl md:min-h-[30rem]" style={HERO_BG}>
            {mainImage && (
              <img
                src={asset(mainImage)}
                alt={caption}
                className="absolute inset-0 size-full object-cover"
                style={{ filter: "saturate(0.85)", objectPosition: imageFocus(mainImage) }}
              />
            )}
            {finalImage ? (
              <div className="absolute inset-0" style={HERO_SCRIM} aria-hidden />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-bl from-black/55 via-black/10 to-black/25" aria-hidden />
            )}
            {/* Thứ tự lớp: ảnh < các ô lật (z-10) < chữ trên ảnh (z-20) */}
            <HeroTiles />
            {/* Bấm vào ảnh mở mùa mới nhất; bàn phím và trình đọc màn hình dùng nút "Xem kết quả" bên dưới (không lặp link) */}
            {latest && <Link to={seasonPath(latest)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[15]" />}
            <h1 className="hero-slogan font-display pointer-events-none absolute top-5 right-5 z-20 max-w-[13ch] text-right text-3xl leading-[1.25] font-extrabold text-white drop-shadow-sm md:top-8 md:right-9 md:text-[3.25rem]">
              <span className="sr-only">{site.name}: </span>“{site.slogan}”
            </h1>
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col items-start gap-2 md:inset-x-5 md:bottom-4 md:flex-row-reverse md:items-end md:justify-between md:gap-4">
              {latest && (
                <div className="pointer-events-auto flex flex-wrap gap-2">
                  <Link to={seasonPath(latest)} className={`${HERO_BUTTON} border-white bg-white text-oss hover:bg-oss-soft`}>
                    Xem kết quả mùa {latest}
                  </Link>
                  <Link to="/wiki/thi-sinh" className={`${HERO_BUTTON} border-white/80 bg-black/55 text-white hover:bg-black/75`}>
                    Tra cứu thí sinh
                  </Link>
                </div>
              )}
              <p className="text-xs text-white/90 md:text-sm">{caption}</p>
            </div>
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

      {/* ===== Mùa gần nhất ===== */}
      <section className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
        <LatestSeason />
      </section>

      {/* ===== Bạn có biết? ===== */}
      <section aria-label="Bạn có biết?" className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
        <DidYouKnow />
      </section>

      {/* ===== Cảm nhận về Olympia Sóc Sơn ===== */}
      {testimonials.length > 0 && (
        <Section tone="dark" labelledBy="cam-nhan">
          <h2 id="cam-nhan" className="h2">
            Cảm nhận về Olympia Sóc Sơn
          </h2>
          <div className="mt-8">
            <Testimonials />
          </div>
        </Section>
      )}

      {/* ===== Đồng hành cùng Olympia Sóc Sơn ===== */}
      {partners.length > 0 && (
        <Section labelledBy="doi-tac" className="!pt-12 md:!pt-16">
          <h2 id="doi-tac" className="section-title">
            Đồng hành cùng Olympia Sóc Sơn
          </h2>
          <p className="mt-2 text-ink-soft">{partners.length} đơn vị đã đồng hành cùng Olympia Sóc Sơn.</p>
          <div className="mt-8">
            <Partners />
          </div>
        </Section>
      )}

      {/* ===== Bản đồ ===== */}
      <section aria-labelledby="ban-do" className="section mx-auto max-w-6xl px-5 pt-0 md:pt-0">
        <h2 id="ban-do" className="section-title">
          Tìm đến Olympia Sóc Sơn
        </h2>
        <div className="mt-8">
          <MapSection />
        </div>
      </section>
    </>
  );
}
