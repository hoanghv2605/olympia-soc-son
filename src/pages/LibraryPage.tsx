import { PiImagesBold } from "react-icons/pi";
import PageHeader from "../components/PageHeader";
import { site } from "../lib/data";

export default function LibraryPage() {
  return (
    <>
      <PageHeader title="Thư viện" description="Ảnh và tư liệu qua các mùa Olympia Sóc Sơn." />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-14 text-center">
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
    </>
  );
}
