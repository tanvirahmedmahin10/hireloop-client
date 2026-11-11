import type { Metadata } from "next"
import Link from "next/link"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account · HireLoop",
  description: "Create a free HireLoop account and land your next role — faster.",
}

const SignUpPage = () => {
  return (
    <div className="w-full rounded-[24px] border border-white/10 bg-[#151516] p-6 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-manrope text-2xl leading-[1.2] font-bold tracking-[-0.01em] text-white sm:text-[28px]">
          Create your free account
        </h1>
        <p className="font-inter-tight text-[15px] text-[#A0A0AB]">
          Join HireLoop and land your next role — faster.
        </p>
      </div>

      <div className="mt-8">
        <SignUpForm />
      </div>

      <p className="mt-8 text-center font-inter text-sm text-[#A0A0AB]">
        Already have an account?{" "}
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

export default SignUpPage
