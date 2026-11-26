import Markdown from "react-markdown";
import { Link, useParams } from "react-router";
import PageHeader from "../components/PageHeader";
import PersonPhoto from "../components/PersonPhoto";
import NotFound from "./NotFound";
import { getHuman, getPerson, humanImage, humanNeighbors, humanPath, personPath, storyMatches } from "../lib/data";
import { asset, formatDate } from "../lib/format";
import { usePageTitle } from "../lib/hooks";

/** Ảnh trong markdown: đường dẫn tương đối (vd images/...) tính từ thư mục public. */
function resolveSrc(src: string | undefined) {
  if (!src) return src;
  return /^(https?:)?\/\//.test(src) || src.startsWith("data:") ? src : asset(src);
}

export default function HumanStoryPage() {
  const { slug } = useParams();
  const story = getHuman(slug);
  usePageTitle(story && `${story.name} · Human of OSS`);
  if (!story) return <NotFound />;

  const { prev, next } = humanNeighbors(story.slug);
  const related = storyMatches(story);
  const owner = story.person ? getPerson(story.person) : undefined;

  return (
    <>
      <PageHeader breadcrumb={[{ to: "/human-of-oss", label: "Human of OSS" }, { label: story.name }]} title={story.name} />
      <article className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <header className="flex flex-col items-center gap-3 text-center">
          <PersonPhoto
            decorative
            src={humanImage(story)}
            seed={story.slug}
            name={story.name}
            className="size-40 rounded-full ring-2 ring-oss ring-offset-[3px] ring-offset-white"
          />
          <p className="text-ink-soft">{story.title}</p>
          <p className="font-display max-w-[32ch] text-xl leading-[1.4] font-semibold text-oss italic md:text-2xl">“{story.headline}”</p>
          <p className="text-sm text-ink-soft tabular-nums">
            Tập {story.stt}
            {story.date && ` · ${formatDate(story.date)}`}
          </p>
        </header>

        {story.body.trim() && (
          <div className="prose-oss mx-auto mt-12">
            {/* react-markdown mặc định KHÔNG hiển thị HTML thô trong markdown */}
            <Markdown
              components={{
                img: ({ src, alt }) => (
                  <img src={resolveSrc(typeof src === "string" ? src : undefined)} alt={alt ?? ""} loading="lazy" />
                ),
              }}
            >
              {story.body}
            </Markdown>
          </div>
        )}

        {related.length > 0 && (
          <section aria-labelledby="tran-lien-quan" className="mx-auto mt-10 max-w-[68ch] rounded-2xl border border-oss/15 bg-white/70 px-5 py-4">
            <h2 id="tran-lien-quan" className="h3 text-ink">
              Trận đấu được nhắc tới trong bài
            </h2>
            <ul className="mt-2 space-y-1.5">
              {related.map((m) => (
                <li key={m.to}>
                  <Link to={m.to} className="link-strong">
                    Xem diễn biến {m.label} mùa {m.season}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {owner && (
          <p className="mx-auto mt-10 max-w-[68ch]">
            <Link to={personPath(owner.id)} className="font-semibold text-oss underline decoration-oss/30 underline-offset-4 hover:decoration-oss">
              Xem hồ sơ OSSPEDIA của {owner.name}
            </Link>
          </p>
        )}

        <nav aria-label="Các tập Human of OSS" className="mx-auto mt-10 flex max-w-[68ch] flex-wrap items-center justify-between gap-3 text-sm font-semibold text-oss">
          {prev ? (
            <Link to={humanPath(prev.slug)} className="hover:underline">
              ‹ Tập trước
            </Link>
          ) : (
            <span />
          )}
          <Link to="/human-of-oss" className="hover:underline">
            Tất cả bài Human of OSS
          </Link>
          {next ? (
            <Link to={humanPath(next.slug)} className="hover:underline">
              Tập sau ›
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </>
  );
}
