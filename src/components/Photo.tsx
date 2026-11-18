import { useState } from "react";
import { PiImageBold } from "react-icons/pi";
import { asset } from "../lib/format";

interface PhotoProps {
  src?: string; // đường dẫn trong public/, vd "images/about/tap-the-1.jpg"
  alt: string;
  className?: string;
}

/** Ảnh có ô thay thế: chưa bỏ ảnh vào public/ thì hiện ô màu nhạt thay vì ảnh vỡ. */
export default function Photo({ src, alt, className = "" }: PhotoProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`photo-fallback ${className}`}>
        <PiImageBold aria-hidden className="size-7 opacity-50" />
        {import.meta.env.DEV && src && <span className="mt-2 px-3 text-[11px] opacity-70">public/{src}</span>}
      </div>
    );
  }

  return (
    <img
      src={asset(src!)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
