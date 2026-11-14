import type { Metadata } from "next"

import { PaymentCheckout } from "@/components/payment/payment-checkout"

export const metadata: Metadata = {
  title: "Payment · HireLoop",
  description: "Complete your HireLoop subscription payment.",
}

const PaymentPage = () => {
  return (
    <div className="min-h-svh bg-[#08080a]">
      <PaymentCheckout />
    </div>
  )
}

export default PaymentPage
