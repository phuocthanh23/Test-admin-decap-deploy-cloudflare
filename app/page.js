import Link from "next/link";
import { getSite, getProjects } from "../lib/content";

export default function Home() {
  const site = getSite();
  const projects = getProjects();

  return (
    <main>
      <h1>{site.title}</h1>
      <p className="intro">{site.intro}</p>

      <div className="grid">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}/`} className="card">
            {p.cover ? <img src={p.cover} alt={p.title} /> : <div className="cover" />}
            <h2>{p.title}</h2>
            <span className="meta">{p.year}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
