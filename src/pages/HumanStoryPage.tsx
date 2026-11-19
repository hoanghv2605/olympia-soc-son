import Markdown from "react-markdown";
import { Link, useParams } from "react-router";
import { PiArrowLeftBold, PiQuotesFill } from "react-icons/pi";
import PageHeader from "../components/PageHeader";
import PersonPhoto from "../components/PersonPhoto";
import NotFound from "./NotFound";
import { getHuman, humanPhoto } from "../lib/data";
import { asset } from "../lib/format";

/** Ảnh trong markdown: đường dẫn tương đối (vd images/...) tính từ thư mục public. */
function resolveSrc(src: string | undefined) {
  if (!src) return src;
  return /^(https?:)?\/\//.test(src) || src.startsWith("data:") ? src : asset(src);
}

export default function HumanStoryPage() {
  const { slug } = useParams();
  const story = getHuman(slug);
  if (!story) return <NotFound />;

  return (
    <>
      <PageHeader
        breadcrumb={[{ to: "/human-of-oss", label: "Human of OSS" }, { label: story.name }]}
        title={story.name}
        description={story.title}
      />
      <article className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="grid items-center gap-8 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12">
          <PersonPhoto
            src={humanPhoto(story.stt)}
            seed={story.slug}
            name={story.name}
            className="aspect-[3/4] w-48 rounded-2xl md:w-full"
          />
          <figure className="relative pt-10">
            <PiQuotesFill className="absolute top-0 -left-1 size-9 text-oss/25" aria-hidden />
            <blockquote className="max-w-[44ch] text-xl leading-relaxed font-medium text-oss md:text-2xl md:leading-relaxed">
              {story.quote}
            </blockquote>
          </figure>
        </div>

        {story.body.trim() && (
          <div className="prose-oss mt-12">
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

        <Link to="/human-of-oss" className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-oss hover:underline">
          <PiArrowLeftBold aria-hidden /> Tất cả bài Human of OSS
        </Link>
      </article>
    </>
  );
}
