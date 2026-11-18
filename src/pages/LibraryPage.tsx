import { PiImagesBold } from "react-icons/pi";
import { site } from "../lib/data";

export default function LibraryPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="section-title">Thư viện</h1>
      <div className="mt-10 rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-14 text-center">
        <PiImagesBold className="mx-auto size-10 text-oss" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-ink">Thư viện ảnh và tư liệu đang được xây dựng</p>
        <p className="mx-auto mt-2 max-w-[52ch] text-ink-soft">
          Trong lúc chờ, bạn có thể xem ảnh và video các mùa thi trên fanpage của Olympia Sóc Sơn.
        </p>
        <a href={site.facebook} target="_blank" rel="noreferrer" className="btn-primary mt-7">
          Mở fanpage Olympia Sóc Sơn
        </a>
      </div>
    </section>
  );
}
