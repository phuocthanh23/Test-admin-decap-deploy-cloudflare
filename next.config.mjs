/** Static export: Cloudflare Pages chỉ việc phát file trong thư mục out/ */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
