import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password · HireLoop",
  description: "Set a new password for your HireLoop account.",
}

const ResetPasswordPage = () => {
  return (
    <div className="w-full rounded-[24px] border border-white/10 bg-[#151516] p-6 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-manrope text-2xl leading-[1.2] font-bold tracking-[-0.01em] text-white sm:text-[28px]">
          Update your password
        </h1>
        <p className="font-inter-tight text-[15px] text-[#A0A0AB]">
          Choose a new password for your HireLoop account.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <p className="mt-8 text-center font-inter text-sm text-[#A0A0AB]">
        Back to{" "}
        <Link
          href="/sign-in"
          className="font-medium text-[#8F88FF] transition-colors hover:text-[#AA9EFF]"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default ResetPasswordPage
