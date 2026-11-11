"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { AuthPasswordInput } from "@/components/auth/form-fields"
import { authClient } from "@/lib/auth-client"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match. Please try again.")
      return
    }

    setIsSubmitting(true)

    const { data: resData, error: authError } = await authClient.resetPassword({
      newPassword: data.password,
      token: token ?? "",
    })

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.")
      setIsSubmitting(false)
      return
    }

    console.log(resData)
    setIsSuccess(true)
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-inter text-[15px] leading-[1.5] text-[#A0A0AB]">
          This password reset link is invalid or has expired. Request a new one
          to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40"
        >
          Request New Link
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-inter text-[15px] leading-[1.5] text-[#A0A0AB]">
          Your password has been updated. You can now sign in with your new
          password.
        </p>
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors outline-none hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40"
        >
          Continue to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <AuthPasswordInput name="password" isNew label="New password" placeholder="8+ characters" required minLength={8} />

      <AuthPasswordInput name="confirmPassword" label="Confirm password" placeholder="Re-enter your password" required />

      {error ? (
        <p role="alert" className="font-inter text-sm text-[#F87171]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors outline-none hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  )
}
