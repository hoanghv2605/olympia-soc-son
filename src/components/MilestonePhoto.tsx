import Logo from "./Logo";
import Photo from "./Photo";
import { CUBE_GRADIENT } from "../lib/format";

/** Ảnh cột mốc (images/cot-moc/<date>.jpg); chưa có thì hiện logo OSS trên nền gradient tím. */
export default function MilestonePhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <Photo
      key={src}
      src={src}
      alt={alt}
      className={className}
      fallback={
        <span aria-hidden className="absolute inset-0 grid place-items-center" style={{ backgroundImage: CUBE_GRADIENT }}>
          <Logo className="w-2/5 opacity-90" />
        </span>
      }
    />
  );
}
