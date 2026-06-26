/** Types image acceptés dans tous les uploads admin (input accept + API). */
export const ADMIN_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

export const ADMIN_IMAGE_FORMATS_LABEL = "JPEG, PNG, WebP, GIF, SVG";

export const ADMIN_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ADMIN_SVG_MIME = "image/svg+xml";

export const ADMIN_MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const ADMIN_MAX_SVG_BYTES = 512 * 1024;
export const ADMIN_MAX_HERO_IMAGE_BYTES = 16 * 1024 * 1024;
