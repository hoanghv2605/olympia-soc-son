import { useEffect, useRef, useState, type ReactNode } from "react";
import { PiImageBold } from "react-icons/pi";
import { asset } from "../lib/format";
import { hasImage } from "../lib/images";

interface PhotoProps {
  src?: string; // đường dẫn trong public/, vd "images/about/tap-the-1.jpg"
  alt: string;
  className?: string;
  /** Lớp giữ chỗ (phủ kín khung). Không truyền thì hiện ô icon mặc định. */
  fallback?: ReactNode;
  /** Ảnh chỉ để trang trí (tên đã nằm cạnh): alt rỗng, không đặt role/aria-label, ẩn khỏi trình đọc màn hình. */
  decorative?: boolean;
}

/**
 * Ảnh có lớp giữ chỗ: luôn hiện lớp giữ chỗ trước (không có trạng thái trống/xám khi đang tải);
 * ảnh thật tải xong thì mờ dần đè lên (200ms); ảnh lỗi thì giữ lớp giữ chỗ.
 * Chỉ gọi tải ảnh có trong danh sách ảnh có sẵn (src/lib/images.ts); `onError` là phương án dự phòng.
 */
export default function Photo({ src, alt, className = "", fallback, decorative = false }: PhotoProps) {
  const [failed, setFailed] = useState(!hasImage(src));
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Ảnh đã có trong bộ nhớ đệm có thể tải xong trước khi React gắn onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      {...(decorative ? { "aria-hidden": true } : failed || !loaded ? { role: "img", "aria-label": alt } : {})}
    >
      {fallback ?? (
        <div aria-hidden className="photo-fallback absolute inset-0">
          <PiImageBold className="size-7 opacity-50" />
          {import.meta.env.DEV && src && <span className="mt-2 px-3 text-[11px] opacity-70">public/{src}</span>}
        </div>
      )}
      {!failed && (
        <img
          ref={imgRef}
          src={asset(src!)}
          alt={loaded && !decorative ? alt : ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`photo-img absolute inset-0 size-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
