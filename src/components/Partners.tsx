import { useLayoutEffect, useRef, useState } from "react";
import { partnerLogoCandidates, partners } from "../lib/data";
import { asset } from "../lib/format";
import { prefersReducedMotion } from "../lib/hooks";
import { pickImage } from "../lib/images";
import type { Partner } from "../types";

const SPEED = 30; // px mỗi giây
const ONE_ROW_MAX = 6; // ≤ 6 đối tác thì 1 hàng

/**
 * Chia hàng: ≤ 6 → 1 hàng; có đối tác chính (tier "chinh") → hàng 1 đối tác chính (ô to), hàng 2 còn lại;
 * không có thì chia đôi danh sách.
 */
function splitRows(list: Partner[]): { items: Partner[]; big: boolean }[] {
  if (list.length <= ONE_ROW_MAX) return [{ items: list, big: false }];
  const main = list.filter((p) => p.tier === "chinh");
  if (main.length) {
    const rest = list.filter((p) => p.tier !== "chinh");
    return [{ items: main, big: true }, ...(rest.length ? [{ items: rest, big: false }] : [])];
  }
  const half = Math.ceil(list.length / 2);
  return [
    { items: list.slice(0, half), big: false },
    { items: list.slice(half), big: false },
  ];
}

/** Một ô logo. Bản sao (cho vòng lặp liền mạch) thì aria-hidden và không focus được. */
function Tile({ p, big, clone }: { p: Partner; big: boolean; clone: boolean }) {
  const logo = pickImage(partnerLogoCandidates(p.id));
  const size = big ? "h-[132px] w-[204px] md:h-[168px] md:w-[264px]" : "h-[88px] w-[136px] md:h-28 md:w-44";
  const inner = logo ? (
    <img src={asset(logo)} alt={clone ? "" : p.name} loading="lazy" className="size-full object-contain p-4" />
  ) : (
    <span className="px-3 text-center text-sm font-semibold text-ink-soft">{p.name}</span>
  );
  const cls = `grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-oss/15 bg-white ${size}`;
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
        <span className={cls}>{inner}</span>
      )}
    </li>
  );
}

/** Một hàng logo trôi ngang liên tục (~30px/giây); dừng khi rê chuột / focus. */
function MarqueeRow({ items, big, reverse }: { items: Partner[]; big: boolean; reverse: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLUListElement>(null);
  const [reps, setReps] = useState(1);
  const [duration, setDuration] = useState(40);

  // Lặp danh sách đủ phủ bề ngang khung, thời lượng = bề rộng 1 nửa / tốc độ
  useLayoutEffect(() => {
    const box = boxRef.current;
    const half = halfRef.current;
    if (!box || !half) return;
    const measure = () => {
      const single = half.scrollWidth / reps;
      if (!single) return;
      const need = Math.max(1, Math.ceil(box.clientWidth / single));
      if (need !== reps) setReps(need);
      setDuration((single * need) / SPEED);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [reps]);

  const half = (copy: number) => (
    <ul ref={copy === 0 ? halfRef : undefined} className="flex shrink-0" aria-hidden={copy > 0 || undefined}>
      {Array.from({ length: reps }, (_, r) =>
        items.map((p) => <Tile key={`${r}-${p.id}`} p={p} big={big} clone={copy > 0 || r > 0} />),
      )}
    </ul>
  );

  return (
    <div ref={boxRef} className={`marquee py-1 ${reverse ? "is-reverse" : ""}`}>
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {half(0)}
        {half(1)}
      </div>
    </div>
  );
}

/** Đối tác đồng hành: hàng logo trôi (2 hàng ngược chiều); giảm chuyển động thì xếp lưới tĩnh. */
export default function Partners() {
  const [reduced] = useState(prefersReducedMotion);
  if (!partners.length) return null;
  const rows = splitRows(partners);

  if (reduced) {
    return (
      <div className="space-y-4">
        {rows.map((row, i) => (
          <ul key={i} className="flex flex-wrap justify-center gap-y-4">
            {row.items.map((p) => (
              <Tile key={p.id} p={p} big={row.big} clone={false} />
            ))}
          </ul>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <MarqueeRow key={i} items={row.items} big={row.big} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}
