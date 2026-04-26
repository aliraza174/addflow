import type { Ad, PackageDef } from "@/lib/domain/types";

const freshWindowHours = 72;

function freshnessPoints(createdAtIso: string) {
  const created = new Date(createdAtIso).getTime();
  const ageHours = Math.max(0, (Date.now() - created) / (1000 * 60 * 60));
  if (ageHours >= freshWindowHours) return 0;
  return Math.round(((freshWindowHours - ageHours) / freshWindowHours) * 25);
}

export function rankScore(ad: Ad, pkg: PackageDef) {
  const verifiedSellerPoints = ad.seller.isVerified ? 8 : 0;
  return (
    (ad.featured ? 50 : 0) +
    pkg.weight * 10 +
    freshnessPoints(ad.createdAt) +
    ad.adminBoost +
    verifiedSellerPoints
  );
}

