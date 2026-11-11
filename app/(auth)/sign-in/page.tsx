import type { Metadata } from "next"
import Link from "next/link"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In · HireLoop",
  description: "Sign in to HireLoop to continue your job hunt.",
}

const SignInPage = () => {
  return (
    <div className="w-full rounded-[24px] border border-white/10 bg-[#151516] p-6 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-manrope text-2xl leading-[1.2] font-bold tracking-[-0.01em] text-white sm:text-[28px]">
          Welcome back
        </h1>
        <p className="font-inter-tight text-[15px] text-[#A0A0AB]">
          Sign in to continue your job hunt.
        </p>
      </div>

      <div className="mt-8">
        <SignInForm />
      </div>

      <p className="mt-8 text-center font-inter text-sm text-[#A0A0AB]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-[#8F88FF] transition-colors hover:text-[#AA9EFF]"
        >
          Create a free account
        </Link>
      </p>
    </div>
  )
}

export default SignInPage
