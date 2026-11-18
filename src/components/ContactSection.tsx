import { PiEnvelopeSimpleBold, PiFacebookLogoBold, PiPhoneBold } from "react-icons/pi";
import Logo from "./Logo";
import { contacts, site } from "../lib/data";

/** Phần Liên hệ (nền sáng) ở cuối trang Giới thiệu. */
export default function ContactSection() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;

  return (
    <section aria-labelledby="lien-he" className="text-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[0.75fr_1.25fr_1fr] md:py-20">
        <div className="flex flex-col items-center gap-8 md:items-start">
          <Logo className="w-32 md:w-40" />
          <ul className="space-y-3 text-sm">
            <li>
              <a href={site.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-ink hover:text-oss">
                <PiFacebookLogoBold className="size-5 text-oss" aria-hidden /> facebook.com/olympiasocson
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 text-ink hover:text-oss">
                <PiEnvelopeSimpleBold className="size-5 text-oss" aria-hidden /> {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 id="lien-he" className="section-title">Liên hệ</h2>
          <ul className="mt-8 space-y-7">
            {contacts.map((c) => {
              const hasDetails = c.facebook || c.email || c.phone;
              return (
                <li key={c.name}>
                  <p className="font-semibold text-ink">{c.name}</p>
                  <p className="text-sm text-ink-soft">{c.role}</p>
                  {hasDetails && (
                    <ul className="mt-2 space-y-1 text-sm text-ink">
                      {c.facebook && (
                        <li>
                          <a href={c.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
                            <PiFacebookLogoBold className="text-oss" aria-hidden /> Facebook
                          </a>
                        </li>
                      )}
                      {c.email && (
                        <li>
                          <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 hover:underline">
                            <PiEnvelopeSimpleBold className="text-oss" aria-hidden /> {c.email}
                          </a>
                        </li>
                      )}
                      {c.phone && (
                        <li>
                          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:underline">
                            <PiPhoneBold className="text-oss" aria-hidden /> {c.phone}
                          </a>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-h-72 overflow-hidden rounded-xl border border-oss/15 bg-oss-soft">
          <iframe
            title="Bản đồ đường đến Trường THPT Sóc Sơn"
            src={mapSrc}
            className="h-full min-h-72 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
