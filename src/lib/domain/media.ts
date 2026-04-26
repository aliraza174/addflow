import type { SourceType } from "@/lib/domain/types";

const YOUTUBE_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i;

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function hasAllowedImageExtension(url: string) {
  const normalized = url.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some((ext) => normalized.includes(ext));
}

export function extractYoutubeId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match?.[1] ?? null;
}

export function normalizeMediaUrl(input: string): {
  sourceType: SourceType;
  originalUrl: string;
  thumbnailUrl: string;
  validationStatus: "ok" | "invalid" | "fallback";
} {
  const url = input.trim();
  const safeFallback = "/images/media-placeholder.svg";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return {
      sourceType: "unknown",
      originalUrl: url,
      thumbnailUrl: safeFallback,
      validationStatus: "invalid",
    };
  }

  const ytId = extractYoutubeId(url);
  if (ytId) {
    return {
      sourceType: "youtube",
      originalUrl: url,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      validationStatus: "ok",
    };
  }

  if (hasAllowedImageExtension(url)) {
    return {
      sourceType: "image",
      originalUrl: url,
      thumbnailUrl: url,
      validationStatus: "ok",
    };
  }

  return {
    sourceType: "unknown",
    originalUrl: url,
    thumbnailUrl: safeFallback,
    validationStatus: "fallback",
  };
}

