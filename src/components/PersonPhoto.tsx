import Photo from "./Photo";
import { CUBE_GRADIENT, initials } from "../lib/format";

interface Props {
  src: string; // vd images/thi-sinh/<id>.jpg
  name: string;
  className?: string;
  /** Cỡ chữ viết tắt khi chưa có ảnh */
  textClass?: string;
}

/** Ảnh người (thí sinh, Human of OSS); chưa có ảnh thì hiện chữ viết tắt trên nền gradient OSS. */
export default function PersonPhoto({ src, name, className = "", textClass = "text-5xl" }: Props) {
  return (
    <Photo
      key={src}
      src={src}
      alt={`Ảnh ${name}`}
      className={className}
      fallback={
        <span
          aria-hidden
          className={`absolute inset-0 grid place-items-center font-extrabold tracking-wide text-white/95 ${textClass}`}
          style={{ backgroundImage: CUBE_GRADIENT }}
        >
          {initials(name)}
        </span>
      }
    />
  );
}
