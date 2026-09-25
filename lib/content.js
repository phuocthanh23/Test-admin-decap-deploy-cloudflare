import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "content");

// Nội dung trang chủ (Decap: collection "Trang chủ", file content/site.json)
export function getSite() {
  return JSON.parse(fs.readFileSync(path.join(root, "site.json"), "utf8"));
}

// Danh sách project (Decap: folder collection, mỗi project là một file JSON)
export function getProjects() {
  const dir = path.join(root, "projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      slug: f.replace(/\.json$/, ""),
      ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")),
    }))
    .sort((a, b) => (b.year || 0) - (a.year || 0));
}

export function getProject(slug) {
  return getProjects().find((p) => p.slug === slug);
}
