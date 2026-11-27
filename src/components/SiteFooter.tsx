import { Fragment } from "react";
import { Link } from "react-router";
import { PiEnvelopeSimpleBold, PiFacebookLogoBold, PiMapPinBold } from "react-icons/pi";
import { contacts, site } from "../lib/data";
import { splitSlogan, yearOf } from "../lib/format";
import { NAV } from "../lib/nav";
import Logo from "./Logo";

export default function SiteFooter() {
  const now = new Date().getFullYear();
  return (
    <footer className="paper-dark border-t border-white/10 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1.1fr_0.8fr] lg:gap-6 xl:gap-10">
        <div>
          <div className="flex items-center gap-4">
            <Logo className="size-12" />
            <div>
              <p className="pt-[0.12em] leading-[1.4] font-bold tracking-[0.14em] text-white uppercase">{site.name}</p>
              {/* 1 dòng; chỗ hẹp chỉ được xuống dòng ngay sau dấu phẩy */}
              <p className="mt-1 text-sm text-white/70">
                {splitSlogan(site.slogan).map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 && " "}
                    <span className="inline-block">{part}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>

        <section aria-labelledby="footer-lien-he">
          <h2 id="footer-lien-he" className="font-display text-base font-semibold text-white">Liên hệ</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {contacts.map((c) => (
              <li key={c.name}>
                <p className="font-semibold text-white">{c.name}</p>
                <p className="text-xs text-white/60">{c.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-ket-noi">
          <h2 id="footer-ket-noi" className="font-display text-base font-semibold text-white">Kết nối</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={site.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <PiFacebookLogoBold className="size-4" aria-hidden /> Fanpage Olympia Sóc Sơn
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <PiEnvelopeSimpleBold className="size-4" aria-hidden /> {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <PiMapPinBold className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {site.address}{" "}
                <a href={site.mapLink} target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">
                  Xem bản đồ
                </a>
              </span>
            </li>
          </ul>
        </section>

        <nav aria-labelledby="footer-kham-pha">
          <h2 id="footer-kham-pha" className="font-display text-base font-semibold text-white">Khám phá</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-white/50">
          © {yearOf(site.foundedDate)}–{now} {site.name}
        </p>
      </div>
    </footer>
  );
}
