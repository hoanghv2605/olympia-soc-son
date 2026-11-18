import { PiEnvelopeSimpleBold, PiFacebookLogoBold } from "react-icons/pi";
import { site } from "../lib/data";
import { yearOf } from "../lib/format";
import Logo from "./Logo";

export default function SiteFooter() {
  const now = new Date().getFullYear();
  return (
    <footer className="paper-dark border-t border-white/10 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-center gap-4">
          <Logo className="size-12" />
          <div>
            <p className="font-bold tracking-[0.14em] text-white uppercase">{site.name}</p>
            <p className="mt-1 text-sm text-white/70">{site.slogan}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
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
        </ul>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-white/50">
          © {yearOf(site.foundedDate)}–{now} {site.name}
        </p>
      </div>
    </footer>
  );
}
