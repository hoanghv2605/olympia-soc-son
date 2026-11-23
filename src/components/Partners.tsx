import { useLayoutEffect, useRef, useState } from "react";
import { partnerLogoCandidates, partners } from "../lib/data";
import { asset } from "../lib/format";
import { prefersReducedMotion } from "../lib/hooks";
import { pickImage } from "../lib/images";
import type { Partner, PartnerTier } from "../types";

/**
 * 3 hạng đối tác, từ trên xuống: Vàng → Bạc → Đồng hành. Mỗi hàng trôi ngang, chiều xen kẽ
 * (Vàng sang trái, Bạc sang phải, Đồng hành sang trái); Vàng chậm hơn (20px/giây, 2 hàng kia 30px/giây).
 * `tile` = cỡ ô + viền (máy tính / điện thoại); chuỗi class viết đầy đủ để Tailwind nhận ra.
 */
const TIERS: { tier: PartnerTier; label: string; speed: number; reverse: boolean; tile: string }[] = [
  {
    tier: "vang",
    label: "Đối tác Vàng",
    speed: 20,
    reverse: false,
    tile: "h-[110px] w-[176px] md:h-[150px] md:w-[240px] border-2 border-gold shadow-[0_6px_18px_-8px_rgba(201,162,39,0.55)]",
  },
  {
    tier: "bac",
    label: "Đối tác Bạc",
    speed: 30,
    reverse: true,
    tile: "h-[88px] w-[136px] md:h-[112px] md:w-[176px] border-[1.5px] border-silver",
  },
  {
    tier: "dong-hanh",
    label: "Đối tác đồng hành",
    speed: 30,
    reverse: false,
    tile: "h-[76px] w-[120px] md:h-24 md:w-[152px] border border-oss/30",
  },
];

/** Một ô logo. Bản sao (cho vòng lặp liền mạch) thì aria-hidden và không focus được. */
function Tile({ p, tile, clone }: { p: Partner; tile: string; clone: boolean }) {
  const logo = pickImage(partnerLogoCandidates(p.id));
  const inner = logo ? (
    <img src={asset(logo)} alt={clone ? "" : p.name} loading="lazy" className="size-full object-contain p-4" />
  ) : (
    <span className="px-3 text-center text-sm font-semibold text-ink-soft">{p.name}</span>
  );
  const cls = `relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ${tile}`;
  return (
    <li className="mr-4 shrink-0" aria-hidden={clone || undefined}>
      {p.url ? (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={clone ? -1 : undefined}
          className={`${cls} transition-colors hover:border-oss`}
        >
          {inner}
        </a>
      ) : (
        <span className={cls}>
          {inner}
        </span>
      )}
    </li>
  );
}

/**
 * Một hàng logo. Đủ logo để lấp đầy bề ngang thì trôi ngang liên tục với tốc độ `speed` (px/giây), dừng khi rê chuột / focus.
 * Ít logo (cả danh sách ngắn hơn khung) thì hiện tĩnh, căn giữa, không nhân đôi danh sách, không chạy.
 */
function MarqueeRow({ items, tile, speed, reverse }: { items: Partner[]; tile: string; speed: number; reverse: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLUListElement>(null);
  const [reps, setReps] = useState(1);
  const [duration, setDuration] = useState(40);
  const [fits, setFits] = useState(false);

  // Đo tổng bề ngang 1 lượt danh sách (mỗi ô + lề phải 16px). Vừa trong khung → tĩnh; không thì lặp đủ phủ khung
  // (thời lượng = bề rộng 1 nửa / tốc độ)
  useLayoutEffect(() => {
    const box = boxRef.current;
    const half = halfRef.current;
    if (!box || !half) return;
    const measure = () => {
      const single = [...half.children].slice(0, items.length).reduce((sum, el) => sum + (el as HTMLElement).offsetWidth + 16, 0);
      if (!single) return;
      const fit = single <= box.clientWidth;
      setFits(fit);
      if (fit) return;
      const need = Math.max(1, Math.ceil(box.clientWidth / single));
      if (need !== reps) setReps(need);
      setDuration((single * need) / speed);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [reps, speed, items.length, fits]);

  const half = (copy: number) => (
    <ul ref={copy === 0 ? halfRef : undefined} className="flex shrink-0" aria-hidden={copy > 0 || undefined}>
      {Array.from({ length: reps }, (_, r) =>
        items.map((p) => <Tile key={`${r}-${p.id}`} p={p} tile={tile} clone={copy > 0 || r > 0} />),
      )}
    </ul>
  );

  if (fits) {
    return (
      <div ref={boxRef} className="py-3">
        <ul ref={halfRef} className="flex flex-wrap justify-center gap-y-4">
          {items.map((p) => (
            <Tile key={p.id} p={p} tile={tile} clone={false} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={boxRef} className={`marquee py-3 ${reverse ? "is-reverse" : ""}`}>
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {half(0)}
        {half(1)}
      </div>
    </div>
  );
}

/** Đối tác đồng hành theo 3 hạng; hạng nào không có đối tác thì ẩn cả hàng. Giảm chuyển động: lưới tĩnh căn giữa. */
export default function Partners() {
  const [reduced] = useState(prefersReducedMotion);
  const rows = TIERS.map((t) => ({ ...t, items: partners.filter((p) => p.tier === t.tier) })).filter((r) => r.items.length > 0);
  if (!rows.length) return null;

  return (
    <div className="space-y-6">
      {rows.map((r) => (
        <section key={r.tier} aria-label={r.label}>
          <h3 className="text-sm font-semibold text-ink-soft">{r.label}</h3>
          {reduced ? (
            <ul className="mt-3 flex flex-wrap justify-center gap-y-4">
              {r.items.map((p) => (
                <Tile key={p.id} p={p} tile={r.tile} clone={false} />
              ))}
            </ul>
          ) : (
            <MarqueeRow items={r.items} tile={r.tile} speed={r.speed} reverse={r.reverse} />
          )}
        </section>
      ))}
    </div>
  );
}
