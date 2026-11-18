import { Fragment, type ComponentType } from "react";
import { PiTelevisionSimpleBold, PiTrophyBold, PiUsersThreeBold } from "react-icons/pi";
import { TbLaurelWreath, TbPodium } from "react-icons/tb";
import Logo from "../../components/Logo";
import Photo from "../../components/Photo";
import ContactSection from "../../components/ContactSection";
import Timeline from "../../components/Timeline";
import { site, statGroups, timeline } from "../../lib/data";
import type { Stat } from "../../types";

const STAT_ICONS: Record<Stat["icon"], ComponentType<{ className?: string }>> = {
  trophy: PiTrophyBold,
  people: PiUsersThreeBold,
  podium: TbPodium,
  laurel: TbLaurelWreath,
  tv: PiTelevisionSimpleBold,
};

export default function IntroPage() {
  return (
    <>
      {/* ===== Giới thiệu (nền giấy đen) ===== */}
      <section className="paper-dark text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
          <div className="flex flex-col items-center gap-5">
            <Logo className="w-36 md:w-52" />
            <h1 className="text-xl font-bold tracking-[0.16em] uppercase md:text-2xl">
              <span className="bg-gradient-to-r from-cube-blue via-[#a07cf0] to-cube-pink bg-clip-text text-transparent">
                {site.name}
              </span>
            </h1>
          </div>

          <div className="grid items-center gap-6 sm:grid-cols-2">
            <Photo src={site.images.aboutTop} alt="Tập thể Olympia Sóc Sơn" className="aspect-[4/3] w-full rounded-xl" />
            <p className="text-[15px] leading-relaxed text-white/85 md:text-justify">{site.intro[0]}</p>
            <p className="text-[15px] leading-relaxed text-white/85 md:text-justify">{site.intro[1]}</p>
            <Photo src={site.images.aboutBottom} alt="Các thành viên Olympia Sóc Sơn" className="aspect-[4/3] w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* ===== Những cột mốc đáng nhớ ===== */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="section-title text-center">Những cột mốc đáng nhớ</h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-oss" aria-hidden /> Olympia Sóc Sơn
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-cube-pink" aria-hidden /> Đường lên đỉnh Olympia
          </li>
        </ul>
        <div className="mt-10">
          <Timeline items={timeline} />
        </div>
      </section>

      {/* ===== Những con số ấn tượng ===== */}
      <section className="paper-dark text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-[0.06em] uppercase md:text-[2rem]">Những con số ấn tượng</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-[2fr_auto_3fr] md:gap-8">
            {statGroups().map((g, gi) => (
              <Fragment key={g.id}>
                {gi > 0 && <div className="h-px bg-white/20 md:h-auto md:w-px" aria-hidden />}
                <section aria-labelledby={`stat-group-${g.id}`}>
                  <h3
                    id={`stat-group-${g.id}`}
                    className="text-center text-sm font-semibold tracking-[0.08em] text-white/60 uppercase text-balance"
                  >
                    {g.label}
                  </h3>
                  <ul className={`mt-8 grid gap-y-10 ${g.stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {g.stats.map((s) => {
                      const Icon = STAT_ICONS[s.icon];
                      return (
                        <li key={s.key} className="flex flex-col items-center px-2 text-center">
                          <Icon className="size-12 text-white/90 md:size-14" aria-hidden />
                          <span className="mt-4 text-4xl font-extrabold tabular-nums md:text-5xl">{s.value}</span>
                          <span className="mt-2 max-w-[16ch] text-sm text-white/70">{s.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Liên hệ (nền sáng) ===== */}
      <ContactSection />
    </>
  );
}
