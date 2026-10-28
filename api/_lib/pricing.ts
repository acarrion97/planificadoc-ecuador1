export type PlanType = "monthly" | "anual";

// Prices in cents
export const PRICING = {
  monthly: 699, // $6.99
  anual: 5871, // $58.71
};

export function getPriceForPlan(plan: PlanType): number {
  return PRICING[plan] || PRICING.monthly;
}

export function getPlanDuration(plan: PlanType): number {
  return plan === "anual" ? 365 : 30;
}
