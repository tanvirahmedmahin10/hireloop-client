"use client"

import * as React from "react"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Plan info — wire these to the real plan/pricing data when Stripe is implemented.
const plan = {
  name: "Hireloop Pro Plan",
  description: "Access to all features",
  usd: 20,
  rate: 127.6665, // 1 USD = 127.6665 BDT
}

const currencies = [
  { code: "BDT", amount: plan.usd * plan.rate },
  { code: "USD", amount: plan.usd },
] as const

type CurrencyCode = (typeof currencies)[number]["code"]

const formatAmount = (code: CurrencyCode, amount: number) =>
  code === "USD"
    ? `$${amount.toFixed(2)}`
    : `BDT ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function PaymentCheckout() {
  const route = useRouter()
  const [currency, setCurrency] = React.useState<CurrencyCode>("BDT")
  const selected = currencies.find((c) => c.code === currency)!

  return (
    <div className="mx-auto w-full max-w-[1152px] px-5 pb-16 sm:px-8">
      {/* Checkout top bar */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Go back"
            onClick={() => route.back()}
            className="flex size-8 items-center justify-center rounded-[8px] text-[#a1a1aa] transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="flex size-8 items-center justify-center rounded-[4px] bg-[#27272a] text-sm font-bold text-white">
            H
          </span>
        </div>
        <span className="rounded-[4px] bg-[#1e2329] px-2 py-1 text-[11px] font-bold tracking-wide text-white">
          SANDBOX
        </span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Order summary */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#a1a1aa]">
            Choose a currency:
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {currencies.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setCurrency(option.code)}
                className={cn(
                  "flex h-[60px] items-center justify-center gap-3 rounded-[8px] text-base font-semibold transition-colors",
                  option.code === currency
                    ? "bg-[#27272a] text-white"
                    : "border border-[#2e2e33] text-[#a1a1aa] hover:text-white"
                )}
              >
                <span aria-hidden className="text-lg">
                  {option.code === "BDT" ? "🇧🇩" : "🇺🇸"}
                </span>
                {formatAmount(option.code, option.amount)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs italic text-[#808089]">1 USD = {plan.rate} BDT</p>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#2e2e33] pt-8">
            <div>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#a1a1aa]">{plan.description}</p>
            </div>
            <p className="text-lg font-semibold text-white">
              {formatAmount(currency, selected.amount)}
            </p>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-sm font-semibold text-white">Contact information</h2>
          <label htmlFor="payment-email" className="mt-3 block text-xs text-[#a1a1aa]">
            Email
          </label>
          <input
            id="payment-email"
            type="email"
            required
            placeholder="email@example.com"
            className="mt-1 h-[49px] w-full rounded-[8px] border border-[#2e2e33] bg-[#1b1b1c] px-4 text-base text-white outline-none placeholder:text-[#888891] focus-visible:border-[#5c53fe]"
          />

          <h2 className="mt-8 text-sm font-semibold text-white">Payment method</h2>
          <div className="mt-3 overflow-hidden rounded-[8px] border border-[#2e2e33]">
            <div className="flex items-center gap-3 bg-[#27272a] px-4 py-4">
              <CreditCard className="size-5 text-[#a1a1aa]" />
              <span className="text-sm font-medium text-white">Card</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-5">
              <Lock className="size-4 shrink-0 text-[#71717a]" />
              <p className="text-[13px] text-[#a1a1aa]">
                You&apos;ll enter your card details on the secure Stripe checkout page after you
                pay.
              </p>
            </div>
          </div>

          <button
            type="button"
            // TODO: redirect to the Stripe Checkout page here.
            className="mt-8 h-[60px] w-full rounded-[8px] bg-[#0070e0] text-lg font-bold text-white transition-colors hover:bg-[#0a86f2]"
          >
            Pay {formatAmount(currency, selected.amount)}
          </button>

          <p className="mt-4 text-center text-xs text-[#808089]">
            Powered by Stripe · <span className="hover:text-white">Terms</span> ·{" "}
            <span className="hover:text-white">Privacy</span>
          </p>
        </section>
      </div>
    </div>
  )
}
