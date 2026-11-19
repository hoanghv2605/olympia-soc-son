import { useId } from "react";

const SIZE = 220; // viền SVG; ảnh tròn nằm giữa, rộng 68% khung (bán kính ~75)
const C = SIZE / 2;
const R = 93; // bán kính cuống: lá trong chạm ~81, lá ngoài chạm ~105, không đè lên ảnh
const LEAVES = 11; // mỗi nhành
const FROM = 165; // góc (độ, tính từ đỉnh theo chiều kim đồng hồ) của lá gần đáy
const TO = 40; // lá cuối cách đỉnh 40°; cùng lá chóp ở 30° → hở ~60° phía trên
const TIP = 30;

const rad = (d: number) => (d * Math.PI) / 180;
/** Điểm trên vòng bán kính R theo góc θ (từ đỉnh, theo chiều kim đồng hồ), nhành bên phải. */
const onCircle = (deg: number, r = R) => ({ x: C + r * Math.sin(rad(deg)), y: C - r * Math.cos(rad(deg)) });

/**
 * Một lá bầu dục nhọn: gốc ở `p`, mọc theo hướng `angle` (rad), dài `len`, rộng `wid`.
 * Toạ độ tính sẵn tuyệt đối (không dùng transform) để dải màu chuyển theo toàn vòng, không theo từng lá.
 */
function leaf(p: { x: number; y: number }, angle: number, len: number, wid: number, mirror: boolean) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // điểm theo hệ toạ độ lá (u dọc theo lá, v ngang lá) → toạ độ SVG
  const pt = (u: number, v: number) => {
    const x = p.x + u * cos - v * sin;
    const y = p.y + u * sin + v * cos;
    return `${(mirror ? SIZE - x : x).toFixed(1)} ${y.toFixed(1)}`;
  };
  return `M ${pt(0, 0)} C ${pt(len * 0.25, -wid)} ${pt(len * 0.7, -wid * 0.6)} ${pt(len, 0)} C ${pt(len * 0.7, wid * 0.6)} ${pt(len * 0.25, wid)} ${pt(0, 0)} Z`;
}

/** Các lá của một nhành (bên phải, mirror = bên trái): xếp so le trong / ngoài dọc cung, hướng lên đỉnh. */
function branchLeaves(mirror: boolean) {
  const out: string[] = [];
  for (let i = 0; i <= LEAVES; i++) {
    const last = i === LEAVES; // lá chóp, mọc thẳng theo cuống
    const deg = last ? TIP : FROM - (i * (FROM - TO)) / (LEAVES - 1);
    const p = onCircle(deg);
    // hướng cuống khi đi lên (θ giảm): t = (-cosθ, -sinθ); pháp tuyến hướng ra ngoài n = (sinθ, -cosθ)
    const t = { x: -Math.cos(rad(deg)), y: -Math.sin(rad(deg)) };
    const n = { x: Math.sin(rad(deg)), y: -Math.cos(rad(deg)) };
    const outer = i % 2 === 0;
    const tilt = last ? 0 : rad(38) * (outer ? 1 : -1);
    const dx = t.x * Math.cos(tilt) + n.x * Math.sin(tilt);
    const dy = t.y * Math.cos(tilt) + n.y * Math.sin(tilt);
    out.push(leaf(p, Math.atan2(dy, dx), last ? 20 : outer ? 19 : 17, 7.5, mirror));
  }
  return out;
}

/** Cuống: cung tròn từ gần đáy lên tới 30° cách đỉnh. */
function stem(mirror: boolean) {
  const a = onCircle(172);
  const b = onCircle(TIP);
  const fx = (x: number) => (mirror ? SIZE - x : x).toFixed(1);
  return `M ${fx(a.x)} ${a.y.toFixed(1)} A ${R} ${R} 0 0 ${mirror ? 1 : 0} ${fx(b.x)} ${b.y.toFixed(1)}`;
}

const BRANCHES = [false, true].map((mirror) => ({ stem: stem(mirror), leaves: branchLeaves(mirror) }));

/**
 * Vòng nguyệt quế tự vẽ bằng SVG: 2 nhành đối xứng mọc từ dưới giữa, uốn quanh ảnh, để hở phía trên (~60°).
 * Mỗi nhành ~12 lá bầu dục nhọn xếp so le, cuống mảnh, tô chuyển màu vàng #F2D27A → #B8860B. Không ruy băng.
 * Phủ kín khung vuông cha (absolute), ảnh tròn đặt chồng ở giữa. Trang trí (aria-hidden).
 */
export default function Laurel({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden focusable="false" className={className}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={SIZE}>
          <stop offset="0" stopColor="#F2D27A" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {BRANCHES.map((b, i) => (
        <g key={i}>
          <path d={b.stem} fill="none" stroke={`url(#${id})`} strokeWidth={1.5} strokeLinecap="round" />
          {b.leaves.map((d, j) => (
            <path key={j} d={d} fill={`url(#${id})`} />
          ))}
        </g>
      ))}
    </svg>
  );
}
