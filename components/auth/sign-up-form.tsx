"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { cn } from "@/lib/utils"

import { AuthCheckbox, AuthEmailInput, AuthNameInput, AuthPasswordInput } from "@/components/auth/form-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { authClient } from "@/lib/auth-client"

const accountRoles = [
  { value: "seeker", label: "Job Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
] as const

export function SignUpForm() {
  const router = useRouter()
  const [role, setRole] = React.useState<(typeof accountRoles)[number]["value"]>("seeker")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    const { data: resData, error: authError } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as (typeof accountRoles)[number]["value"],
      callbackURL: "/sign-in",
    })

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.")
      setIsSubmitting(false)
      return
    }

    console.log(resData)
    // TODO: don't allow public sign-ups to self-assign `admin` before going live.
    router.push("/sign-in")
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
      <fieldset>
        <legend className="font-inter text-sm text-[#A0A0AB]">I want to</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#0C0C0F] p-1">
          {accountRoles.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={role === option.value}
                onChange={() => setRole(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-10 items-center justify-center rounded-lg px-2 text-center font-inter text-[13px] leading-none text-[#A0A0AB] transition-colors hover:text-[#EDEDEF] peer-checked:bg-[#5C53FE] peer-checked:text-white peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#5C53FE]/40 sm:text-sm"
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4">
        <AuthNameInput name="name" placeholder="Jane Cooper" required />

        <AuthEmailInput name="email" placeholder="email@example.com" required />

        <AuthPasswordInput
          name="password"
          isNew
          placeholder="8+ characters"
          required
          inputClassName="min-w-0"
        />
      </div>

      <AuthCheckbox
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="text-[#8F88FF] transition-colors hover:text-[#AA9EFF]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#8F88FF] transition-colors hover:text-[#AA9EFF]">
              Privacy Policy
            </Link>
          </>
        }
        name="terms"
        required
      />

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
          {isSubmitting ? "Creating account..." : "Create Account"}
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
