"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthCheckbox, AuthEmailInput, AuthPasswordInput } from "@/components/auth/form-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function SignInForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    const { data: resData, error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.remember === "on",
      callbackURL: "/",
    })

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.")
      setIsSubmitting(false)
      return
    }

    console.log(resData)
    router.push("/")
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    // Note: requires a `socialProviders.google` entry in lib/auth.ts to work.
    const { data: resData, error: authError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })

    if (authError) {
      setError(authError.message ?? "Google sign-in isn't available yet.")
      setIsGoogleLoading(false)
      return
    }

    console.log(resData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <AuthEmailInput name="email" placeholder="email@example.com" required />

        <AuthPasswordInput name="password" placeholder="Enter your password" required />
      </div>

      <div className="flex items-center justify-between gap-4">
        <AuthCheckbox label="Remember me" name="remember" defaultChecked />
        <Link
          href="/forgot-password"
          className="font-inter text-sm text-[#8F88FF] transition-colors hover:text-[#AA9EFF]"
        >
          Forgot password?
        </Link>
      </div>

      {error ? (
        <p role="alert" className="font-inter text-sm text-[#F87171]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5C53FE] font-instrument text-[15px] font-medium text-white transition-colors outline-none hover:bg-[#6B63FF] focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40 disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-transparent font-instrument text-[15px] font-medium text-[#EDEDEF] transition-colors outline-none hover:border-white/20 hover:bg-white/5 focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/40",
            isGoogleLoading && "pointer-events-none opacity-60"
          )}
        >
          <GoogleIcon />
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </form>
  )
}
