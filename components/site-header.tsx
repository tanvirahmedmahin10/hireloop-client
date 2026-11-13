'use client'
import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/logo.png"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"



 

export function SiteHeader() {
const { data: session,isPending } = authClient.useSession()
const navLinks = [
  { label: "Browse Jobs", href: "/browse-jobs", active: true },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  {label: "Dashboard", href: `/dashboard/${session?.user.role}` }
]
 const router=useRouter() 
 const handleSignOut = async () => {
  
  await authClient.signOut();
  router.push("/sign-in");
};

  return (
    <header className="w-full bg-[#08080A] px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="HireLoop home">
          <Image
            src={logo}
            alt="HireLoop"
            priority
            className="h-auto w-[118px] sm:w-[154px]"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex h-12 items-center rounded-lg border border-white/[0.07] bg-[#1A1A1F] pl-4 pr-1.5 lg:h-[68px] lg:py-2 lg:pl-6 lg:pr-2"
        >
          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base whitespace-nowrap text-[#EDEDEF] transition-colors hover:text-white",
                  link.active && "font-bold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <span
            aria-hidden
            className="mx-6 hidden h-6 w-px bg-[#A8A8A8]/40 lg:block"
          />
         {
         isPending ? (
  <div className="h-9 w-24" />
):
         session?.user ? (
  <div className="flex items-center gap-2 lg:gap-4">
    <span className="text-white">
      Welcome {session.user.name}
    </span>

    <button
      onClick={handleSignOut}
      className="hidden h-9 items-center rounded-lg px-3 font-inter text-base font-semibold text-[#645BFF] transition-colors hover:text-white sm:flex lg:h-[38px] lg:px-4 lg:text-lg"
    >
      Sign out
    </button>
  </div>
) : (
  <div className="flex items-center gap-2 lg:gap-4">
    <Link
      href="/sign-in"
      className="hidden h-9 items-center rounded-lg px-3 font-inter text-base font-semibold text-[#645BFF] transition-colors hover:text-white sm:flex lg:h-[38px] lg:px-4 lg:text-lg"
    >
      Sign In
    </Link>

    <Link
      href="/sign-up"
      className="flex h-9 items-center justify-center rounded-lg bg-[#5C53FE] px-3 font-instrument text-sm font-medium text-[#EDEDEF] transition-colors hover:bg-[#6B63FF] lg:h-[52px] lg:w-[143px] lg:px-4 lg:text-lg"
    >
      Get Started
    </Link>
  </div>
)}
          
        </nav>
      </div>
    </header>
  )
}
