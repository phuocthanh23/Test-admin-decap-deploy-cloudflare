import Link from "next/link";
import { getProjects, getProject } from "../../../lib/content";

// Static export: build sẵn một trang cho mỗi file trong content/projects
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = getProject(slug);

  return (
    <main>
      <Link href="/" className="back">← Quay lại</Link>
      <h1 style={{ marginTop: 24 }}>{p.title}</h1>
      <span className="meta">{p.year}</span>
      {p.cover && <img src={p.cover} alt={p.title} className="cover" style={{ marginTop: 24 }} />}
      <p className="desc">{p.description}</p>
    </main>
  );
}
