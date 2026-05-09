export type PlanType = "monthly" | "annual";

// Prices in cents
export const PRICING = {
  monthly: 699, // $6.99
  annual: 5871, // $58.71
};

export function getPriceForPlan(plan: PlanType): number {
  return PRICING[plan] || PRICING.monthly;
}

export function getPlanDuration(plan: PlanType): number {
  return plan === "annual" ? 365 : 30;
}
