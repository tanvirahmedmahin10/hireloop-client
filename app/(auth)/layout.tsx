import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/logo.png"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#08080A] px-4 py-12 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-[#5C53FE]/12 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#010102]/80 to-transparent"
      />

      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="mb-8 transition-opacity hover:opacity-80"
        >
          <Image src={logo} alt="HireLoop" priority className="h-auto w-[140px]" />
        </Link>

        {children}
      </div>
    </main>
  )
}
