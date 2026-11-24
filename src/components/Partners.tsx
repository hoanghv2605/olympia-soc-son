import { partnerGroups, partnerLogoCandidates } from "../lib/data";
import { asset } from "../lib/format";
import { pickImage } from "../lib/images";
import type { Partner, PartnerGroup } from "../types";

/**
 * 3 nhóm, từ trên xuống: phối hợp tổ chức (ô lớn nhất) → nhà tài trợ (vừa) → đồng hành (nhỏ hơn).
 * Logo đứng yên, căn giữa, xuống dòng khi hẹp. `box` = cỡ ô logo (điện thoại / máy tính); chuỗi class viết đầy đủ để Tailwind nhận ra.
 * Điện thoại: nhóm 1 hai ô một hàng, nhóm 2 và 3 ba ô một hàng.
 */
const BOX: Record<PartnerGroup, { width: string; height: string }> = {
  "phoi-hop": { width: "w-[calc((100%-0.75rem)/2)] md:w-[240px]", height: "h-[110px] md:h-[150px]" },
  "tai-tro": { width: "w-[calc((100%-1.5rem)/3)] md:w-[176px] xl:w-[168px]", height: "h-[80px] md:h-[112px] xl:h-[108px]" },
  "dong-hanh": { width: "w-[calc((100%-1.5rem)/3)] md:w-[152px]", height: "h-[68px] md:h-24" },
};

/** Ô logo + (nếu có) dòng `role` bên dưới. Có `url` thì logo là link mở tab mới. */
function Tile({ p, box }: { p: Partner; box: { width: string; height: string } }) {
  const logo = pickImage(partnerLogoCandidates(p.id));
  const inner = logo ? (
    <img src={asset(logo)} alt={p.name} loading="lazy" className="size-full object-contain p-3 md:p-4" />
  ) : (
    <span className="px-2 text-center text-xs font-semibold text-ink-soft md:px-3 md:text-sm">{p.name}</span>
  );
  const cls = `grid w-full place-items-center overflow-hidden rounded-2xl border border-oss/25 bg-white ${box.height}`;
  return (
    <li className={`flex flex-col items-center gap-1.5 ${box.width}`}>
      {p.url ? (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className={`${cls} transition-colors hover:border-oss`}>
          {inner}
        </a>
      ) : (
        <span className={cls}>{inner}</span>
      )}
      {p.role && <span className="text-center text-xs leading-snug text-ink-soft">{p.role}</span>}
    </li>
  );
}

/** Đơn vị đồng hành theo 3 nhóm, mỗi nhóm một tiêu đề nhỏ; nhóm trống thì ẩn. */
export default function Partners() {
  if (!partnerGroups.length) return null;
  return (
    <div className="space-y-8">
      {partnerGroups.map((g) => (
        <section key={g.group} aria-label={g.label}>
          <h3 className="text-center text-sm font-semibold text-ink-soft">{g.label}</h3>
          <ul className="mt-3 flex flex-wrap justify-center gap-3 md:gap-4">
            {g.items.map((p) => (
              <Tile key={p.id} p={p} box={BOX[g.group]} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
