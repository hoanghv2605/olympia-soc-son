/** Họa tiết khối lập phương nhìn nghiêng (3 mặt hình thoi như logo OSS), chỉ vẽ nét. */
export const CUBE_PATHS = [
  "M50 2 L98 28 L50 54 L2 28 Z", // mặt trên
  "M2 28 L50 54 L50 108 L2 82 Z", // mặt trái
  "M98 28 L50 54 L50 108 L98 82 Z", // mặt phải
];

export default function CubeOutline({ color, className = "", opacity = 0.1 }: { color: string; className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" focusable="false" className={className}>
      {CUBE_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={color}
          strokeOpacity={opacity}
          strokeWidth={1.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Data-URL của họa tiết (dùng làm lớp nền CSS, vd ảnh lớn trang chủ khi chưa có ảnh). */
export function cubeOutlineDataUrl(color: string, opacity = 0.18) {
  const paths = CUBE_PATHS.map(
    (d) => `<path d='${d}' fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='1' stroke-linejoin='round'/>`,
  ).join("");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 110'>${paths}</svg>`)}")`;
}
