import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { PiBookOpenTextBold, PiCompassBold, PiGearSixBold, PiMegaphoneBold, PiUserCircle, PiUsersThreeBold } from "react-icons/pi";
import IconLabel from "./IconLabel";
import Logo from "./Logo";
import Photo from "./Photo";
import { Link } from "react-router";
import { departmentPhoto, departments, getPerson, personPath } from "../lib/data";
import { prefersReducedMotion, useInViewOnce, useMediaQuery } from "../lib/hooks";
import type { Department } from "../types";

const ICONS: Record<Department["icon"], ComponentType<{ className?: string }>> = {
  compass: PiCompassBold,
  book: PiBookOpenTextBold,
  gear: PiGearSixBold,
  megaphone: PiMegaphoneBold,
  people: PiUsersThreeBold,
};

const PANEL_ID = "dept-panel";
const FLIP_MS = 450;
const FLIP_EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Cơ cấu tổ chức.
 * Từ lg: sơ đồ tỏa (logo giữa, Ban Tổ chức chính giữa phía trên logo với đường nối thẳng đứng, 4 ban còn lại ở 4 góc,
 * 5 đường nối tự vẽ) → bấm 1 ban thì logo và 5 ô trượt (FLIP bằng element.animate) sang bố cục chi tiết;
 * bấm logo hoặc Esc để quay về. Dưới lg: Ban Tổ chức một hàng, 4 ban còn lại lưới 2×2; chạm để mở / đóng khung, không FLIP.
 * Ban đầu tiên trong departments.json (index 0) là Ban Tổ chức.
 */
export default function OrgDiagram() {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelAnim, setPanelAnim] = useState<"enter" | "swap">("swap");
  const [paths, setPaths] = useState<string[]>([]);
  const [sliding, setSliding] = useState(false); // đang trượt (FLIP): ẩn đường nối

  const orgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevRects = useRef<Map<Element, DOMRect> | null>(null);
  const focusId = useRef<string | null>(null);
  const slideRun = useRef(0);

  const view = activeId ? "detail" : "diagram";
  const active = departments.find((d) => d.id === activeId);
  const drawn = useInViewOnce(orgRef, 0.3);

  /** Chụp vị trí cũ của logo và 5 ô trước khi đổi bố cục (bước "First" của FLIP). */
  function snapshot() {
    if (!isLg || prefersReducedMotion()) return;
    const map = new Map<Element, DOMRect>();
    for (const el of [logoRef.current, ...pillRefs.current]) if (el) map.set(el, el.getBoundingClientRect());
    prevRects.current = map;
  }

  function select(id: string) {
    if (!isLg) {
      setActiveId((cur) => (cur === id ? null : id));
      setPanelAnim("swap");
      return;
    }
    if (id === activeId) return;
    setPanelAnim(activeId ? "swap" : "enter");
    if (!activeId) snapshot();
    setActiveId(id);
  }

  function back() {
    if (!activeId) return;
    focusId.current = activeId;
    snapshot();
    setActiveId(null);
  }

  // Esc: đóng khung / quay về sơ đồ
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Trả focus về ô ban vừa chọn sau khi đóng
  useEffect(() => {
    if (activeId || !focusId.current) return;
    const i = departments.findIndex((d) => d.id === focusId.current);
    focusId.current = null;
    pillRefs.current[i]?.focus();
  }, [activeId]);

  // Đo lại 5 đường nối theo vị trí hiện tại (chỉ khi ở sơ đồ, từ lg). Hàm luôn đọc state mới nhất qua ref
  const measureRef = useRef<() => void>(() => {});
  measureRef.current = () => {
    const org = orgRef.current;
    const logo = logoRef.current;
    if (!org || !logo || !isLg || view !== "diagram") return;
    const o = org.getBoundingClientRect();
    const l = logo.getBoundingClientRect();
    const c = { x: l.left + l.width / 2 - o.left, y: l.top + l.height / 2 - o.top };
    const r = l.width / 2;
    setPaths(
      pillRefs.current.map((pill, i) => {
        if (!pill) return "";
        const p = pill.getBoundingClientRect();
        if (i === 0) {
          // Ban Tổ chức: đường thẳng đứng từ đỉnh vòng tròn logo tới giữa cạnh dưới ô
          const x = p.left + p.width / 2 - o.left;
          return `M ${c.x} ${c.y - r} L ${x} ${p.bottom - o.top}`;
        }
        const e = { x: ((i - 1) % 2 === 0 ? p.right : p.left) - o.left, y: p.top + p.height / 2 - o.top };
        const d = Math.hypot(e.x - c.x, e.y - c.y) || 1;
        const st = { x: c.x + ((e.x - c.x) / d) * r, y: c.y + ((e.y - c.y) / d) * r };
        const mx = (st.x + e.x) / 2;
        return `M ${st.x} ${st.y} C ${mx} ${st.y}, ${mx} ${e.y}, ${e.x} ${e.y}`;
      }),
    );
  };

  // Đo khi đổi bố cục, đổi kích thước (cửa sổ, khung) và khi font tải xong
  useLayoutEffect(() => {
    measureRef.current();
  }, [isLg, view]);
  useEffect(() => {
    const org = orgRef.current;
    if (!org || !isLg) return;
    const again = () => measureRef.current();
    const ro = new ResizeObserver(again);
    ro.observe(org);
    window.addEventListener("resize", again);
    document.fonts?.ready.then(again);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", again);
    };
  }, [isLg]);

  // FLIP: đo vị trí mới, cho logo và các ô trượt từ vị trí cũ sang; ẩn đường nối trong lúc trượt,
  // trượt xong (animation.finished) thì đo lại đường nối rồi hiện
  useLayoutEffect(() => {
    const prev = prevRects.current;
    prevRects.current = null;
    if (!prev || !isLg || prefersReducedMotion()) return;
    const animations: Animation[] = [];
    for (const [el, from] of prev) {
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (!dx && !dy) continue;
      animations.push(
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
          duration: FLIP_MS,
          easing: FLIP_EASE,
        }),
      );
    }
    if (!animations.length) return;
    const run = ++slideRun.current;
    setSliding(true);
    Promise.allSettled(animations.map((a) => a.finished)).then(() => {
      if (run !== slideRun.current) return; // đã có lượt trượt mới hơn
      measureRef.current();
      setSliding(false);
    });
  }, [view, isLg]);

  // Sơ đồ: Ban Tổ chức (i = 0) hàng 1 giữa; 4 ban còn lại ở 4 góc (hàng 3 và 4). Chi tiết: 5 ô dọc ở hàng 2–6 (hàng 1 và 7 là hàng đệm 1fr)
  const pillStyle = (i: number): CSSProperties => {
    const j = i - 1;
    return {
      "--org-col": i === 0 ? 2 : j % 2 === 0 ? 1 : 3,
      "--org-row": view === "detail" ? i + 2 : i === 0 ? 1 : j < 2 ? 3 : 4,
      "--org-align": i === 0 ? "center" : j < 2 ? "start" : "end",
      "--org-justify": i === 0 ? "center" : "normal",
    } as CSSProperties;
  };

  return (
    <div ref={orgRef} className="org" data-view={view}>
      {isLg && (
        <svg
          aria-hidden
          className="org-lines pointer-events-none absolute inset-0 size-full"
          data-view={view}
          data-drawn={drawn}
          style={{ opacity: view === "diagram" && !sliding ? 1 : 0 }}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} pathLength={1} fill="none" stroke="var(--color-oss)" strokeOpacity={0.3} strokeWidth={1.5} />
          ))}
        </svg>
      )}

      <div ref={logoRef} className="org-logo size-[120px] shrink-0 lg:size-[200px]">
        {isLg && activeId ? (
          <button
            type="button"
            onClick={back}
            aria-label="Quay về sơ đồ cơ cấu tổ chức"
            className="grid size-full cursor-pointer place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(109,40,217,0.55)] ring-8 ring-white/60 transition-shadow hover:ring-oss/20"
          >
            <Logo className="w-[56%]" />
          </button>
        ) : (
          <div className="grid size-full place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(109,40,217,0.55)] ring-8 ring-white/60">
            <Logo className="w-[56%]" />
          </div>
        )}
      </div>

      <div className="org-pills">
        {departments.map((d, i) => {
          const Icon = ICONS[d.icon];
          return (
            <button
              key={d.id}
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              type="button"
              aria-expanded={d.id === activeId}
              aria-controls={PANEL_ID}
              onClick={() => select(d.id)}
              className="dept-pill org-pill"
              data-lead={i === 0 ? "true" : undefined}
              style={pillStyle(i)}
            >
              <span className="dept-icon">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              {d.name}
            </button>
          );
        })}
      </div>

      {active && (
        <div id={PANEL_ID} className="org-panel w-full max-w-xl lg:max-w-none" role="region" aria-labelledby={`dept-name-${active.id}`}>
          <div key={active.id} className={panelAnim === "enter" && isLg ? "org-panel-enter" : "org-panel-swap"}>
            <Photo src={departmentPhoto(active)} alt={`Thành viên ${active.name}`} className="aspect-[4/3] w-full rounded-2xl" />
            <div className="relative mx-4 -mt-10 rounded-xl border-l-4 border-oss bg-white p-5 shadow-[0_16px_40px_-20px_rgba(31,27,46,0.45)]">
              <h3 id={`dept-name-${active.id}`} className="h3 text-oss">
                {active.name}
              </h3>
              {active.leader?.trim() && (
                <p className="mt-2 text-[15px] text-ink">
                  <IconLabel icon={PiUserCircle}>
                    <span>
                      Trưởng ban: {active.leaderTitle ? `${active.leaderTitle} ` : ""}
                      {active.leaderPerson && getPerson(active.leaderPerson) ? (
                        <Link to={personPath(active.leaderPerson)} className="font-semibold text-oss hover:underline">
                          {active.leader}
                        </Link>
                      ) : (
                        <strong className="font-semibold">{active.leader}</strong>
                      )}
                    </span>
                  </IconLabel>
                </p>
              )}
              {active.duties.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink marker:text-oss">
                  {active.duties.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">Nhiệm vụ của ban đang được cập nhật.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
