import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { PiBookOpenTextBold, PiGearSixBold, PiMegaphoneBold, PiUsersThreeBold } from "react-icons/pi";
import Logo from "../../components/Logo";
import Photo from "../../components/Photo";
import { departments, site } from "../../lib/data";
import type { Department } from "../../types";

const ICONS: Record<Department["icon"], ComponentType<{ className?: string }>> = {
  book: PiBookOpenTextBold,
  gear: PiGearSixBold,
  megaphone: PiMegaphoneBold,
  people: PiUsersThreeBold,
};

export default function StructurePage() {
  const [activeId, setActiveId] = useState(departments[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = departments.find((d) => d.id === activeId) ?? departments[0];

  // Phím mũi tên lên/xuống để chuyển ban (chuẩn truy cập của tablist)
  function onKeyDown(e: KeyboardEvent, index: number) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowDown" ? 1 : -1) + departments.length) % departments.length;
    setActiveId(departments[next].id);
    tabRefs.current[next]?.focus();
  }

  if (!active) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="section-title">Cơ cấu tổ chức</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">Olympia Sóc Sơn vận hành với bốn ban. Chọn từng ban để xem nhiệm vụ.</p>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] md:gap-14">
        <div className="flex items-center gap-7">
          <div className="hidden size-36 shrink-0 place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(109,40,217,0.55)] ring-8 ring-white/60 sm:grid">
            <Logo className="w-20" />
          </div>
          <div role="tablist" aria-label="Các ban" aria-orientation="vertical" className="flex w-full max-w-72 flex-col gap-3">
            {departments.map((d, i) => {
              const Icon = ICONS[d.icon];
              const selected = d.id === active.id;
              return (
                <button
                  key={d.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${d.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${d.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(d.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="dept-pill"
                >
                  <span className="dept-icon">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`}>
          <Photo
            key={active.id}
            src={active.photo ?? site.images.aboutTop}
            alt={`Thành viên ${active.name}`}
            className="aspect-[16/10] w-full rounded-2xl"
          />
          <div className="relative mx-4 -mt-10 rounded-xl border-l-4 border-oss bg-white p-5 shadow-[0_16px_40px_-20px_rgba(31,27,46,0.45)]">
            <h2 className="font-semibold text-oss">{active.name}</h2>
            {active.duties.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink marker:text-oss">
                {active.duties.map((duty) => (
                  <li key={duty}>{duty}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">Nhiệm vụ của ban đang được cập nhật.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
