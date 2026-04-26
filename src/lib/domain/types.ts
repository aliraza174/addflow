export type AdStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "payment_pending"
  | "payment_submitted"
  | "payment_verified"
  | "scheduled"
  | "published"
  | "expired"
  | "archived"
  | "rejected";

export type PackageTier = "basic" | "standard" | "premium";

export type SourceType = "image" | "youtube" | "unknown";

export type PackageDef = {
  id: string;
  name: PackageTier;
  durationDays: number;
  weight: number;
  canHomepageFeature: boolean;
  priceUsd: number;
};

export type Seller = {
  id: string;
  displayName: string;
  city: string;
  isVerified: boolean;
  whatsappNumber?: string;
  publicEmail?: string;
  avatarUrl?: string;
  responseRate?: number;
  responseTime?: string;
};

export type AdMedia = {
  sourceType: SourceType;
  originalUrl: string;
  thumbnailUrl: string;
  validationStatus: "ok" | "invalid" | "fallback";
};

export type Ad = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: AdStatus;
  package: PackageTier;
  category: string;
  city: string;
  featured: boolean;
  adminBoost: number;
  publishAt: string | null;
  expireAt: string | null;
  createdAt: string;
  seller: Seller;
  media: AdMedia;
  tags?: string[];
  condition?: string;
  price?: number;
  negotiable?: boolean;
  quantity?: number;
  region?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  attributes?: Record<string, any>;
  viewCount?: number;
  mediaGallery?: string[];
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  isRead: boolean;
  createdAt: string;
  link?: string;
};

