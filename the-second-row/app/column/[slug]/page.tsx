import Link from "next/link";
import Comments from "@/components/Comments";
import SiteHeader from "@/components/SiteHeader";
import { getPost } from "@/lib/records";

export const dynamic = "force-dynamic";

// Renders the desk's markdown-lite: paragraphs, with inline certainty tags
// like [FACT] [OPINION] [QUESTION] [POLICY] [THINKING] turned into chips.
function renderBody(body: string) {
  const TAGS: Record<string, string> = {
    FACT: "tag tag--fact",
    POLICY: "tag",
    OPINION: "tag tag--opinion",
    QUESTION: "tag tag--pulse",
    THINKING: "tag",
  };
  return body.split(/\n\s*\n/).map((para, i) => {
    const m = para.match(/^\[(FACT|POLICY|OPINION|QUESTION|THINKING)\]\s*/);
    if (m) {
      const tag = m[1];
      return (
        <p key={i}>
          <span className={TAGS[tag]} style={{ marginRight: 8 }}>{tag === "THINKING" ? "THINKING OUT LOUD" : tag}</span>
          {para.slice(m[0].length)}
        </p>
      );
    }
    if (para.startsWith("## ")) return <h2 key={i}>{para.slice(3)}</h2>;
    return <p key={i}>{para}</p>;
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <>
        <SiteHeader current="/column" />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">From the Second Row</div>
          <h1>No such piece.</h1>
          <p><Link href="/column">Back to the column →</Link></p>
        </div>
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader current="/column" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">
          {post.kind === "steelman" ? "Steelman Saturday" : post.kind === "note" ? "Desk note" : "From the Second Row"} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
          {post.updatedAt && <> · updated {new Date(post.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })} (logged — no quiet edits)</>}
        </div>
        <h1>{post.title}</h1>
        {post.dek && <p className="lede">{post.dek}</p>}
        {renderBody(post.body)}
        <Comments target={`post:${post.slug}`} resolved={true} />
        <p style={{ marginTop: 26 }}><Link href="/column">← The column</Link></p>
      </div>
    </>
  );
}
