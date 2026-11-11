"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthEmailInput } from "@/components/auth/form-fields"
import { authClient } from "@/lib/auth-client"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    const { data: resData, error: authError } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    })

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.")
      setIsSubmitting(false)
      return
    }

    console.log(resData)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-[#0C0C0F]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8F88FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
            aria-hidden
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </div>
        <p className="font-inter text-[15px] leading-[1.5] text-[#A0A0AB]">
          If an account exists for that email, we&apos;ve sent you a link to reset
          your password.
        </p>
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors outline-none hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <AuthEmailInput name="email" placeholder="email@example.com" required />

      {error ? (
        <p role="alert" className="font-inter text-sm text-[#F87171]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors outline-none hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  )
}
