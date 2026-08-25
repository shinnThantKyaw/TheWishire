export interface PlanFeature {
  name: string;
  free: boolean;
  pro: boolean;
}

export const PLAN_FEATURES: PlanFeature[] = [
  { name: "Create wishes", free: true, pro: true },
  { name: "Preview as recipient", free: true, pro: true },
  { name: "All template styles", free: true, pro: true },
  { name: "Letter & photos", free: true, pro: true },
  { name: "Video embedding", free: true, pro: true },
  { name: "Publish & share link", free: false, pro: true },
  { name: "Voice messages", free: false, pro: true },
  { name: "Background music", free: false, pro: true },
  { name: "Memory timeline", free: false, pro: true },
  { name: "Gift challenges", free: false, pro: true },
  { name: "Unlimited wishes", free: false, pro: true },
];

export const FREE_WISH_LIMIT = 1;
