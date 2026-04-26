import type { AdStatus } from "@/lib/domain/types";

const allowedTransitions: Record<AdStatus, AdStatus[]> = {
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["payment_pending", "rejected"],
  payment_pending: ["payment_submitted"],
  payment_submitted: ["payment_verified", "rejected"],
  payment_verified: ["scheduled", "published"],
  scheduled: ["published"],
  published: ["expired", "archived"],
  expired: ["archived", "submitted"],
  archived: [],
  rejected: ["draft"],
};

export function canTransition(from: AdStatus, to: AdStatus) {
  return allowedTransitions[from].includes(to);
}

export function isPublicStatus(status: AdStatus) {
  return status === "published";
}

