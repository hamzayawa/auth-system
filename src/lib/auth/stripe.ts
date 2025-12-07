import { StripePlan } from "@better-auth/stripe"
import { env } from "@/lib/env";

export const STRIPE_PLANS = [
  {
    name: "basic",
    priceId: env.STRIPE_BASIC_PRICE_ID,
    limits: {
      projects: 10,
    },
  },
  {
    name: "pro",
    priceId: env.STRIPE_PRO_PRICE_ID,
    limits: {
      projects: 50,
    },
  },
] as const satisfies StripePlan[]

export const PLAN_TO_PRICE: Record<string, number> = {
  basic: 19,
  pro: 49,
}
