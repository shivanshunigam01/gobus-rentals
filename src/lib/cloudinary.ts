/** Apply Cloudinary fetch/transform params when URL is from Cloudinary. */
export function cloudinaryUrl(
  url: string | undefined | null,
  opts: { width?: number; height?: number; quality?: string } = {},
): string {
  if (!url) return "";
  const { width, height, quality = "auto" } = opts;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const transforms = ["f_auto", `q_${quality}`, width ? `w_${width}` : "", height ? `h_${height}` : "", "c_fill"]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${transforms}/`);
}
