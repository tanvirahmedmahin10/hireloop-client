import { MapPin, Search, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import heroBackground from "@/app/images/globe.png"

const trendingRoles = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const heroStats = [
  { value: "50K", label: "Active Jobs" },
  { value: "12K", label: "Companies" },
  { value: "2M", label: "Job Seekers" },
  { value: "97%", label: "Satisfaction Rate" },
]

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#010102]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[170px] z-0 flex justify-center"
      >
        <Image
          src={heroBackground}
          alt=""
          priority
          sizes="100vw"
          className="h-auto w-[max(100%,1024px)] max-w-[1600px] select-none"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-linear-to-b from-[#08080A] via-[#08080A]/60 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-[110px] pb-[160px] sm:px-[60px] sm:pt-[174px] sm:pb-[379px]">
        <div className="mx-auto flex w-full max-w-[784px] flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-8">
            <div className="flex h-[50px] items-center gap-1">
              <span
                aria-hidden
                className="hidden h-px w-16 bg-linear-to-r from-[#010123]/70 to-[#A8A8A8]/70 sm:block"
              />
              <div className="flex h-12 items-center gap-4 rounded-full border border-white/10 bg-linear-to-l from-[#474747] to-[#010102] pr-4 pl-6">
                <Trophy
                  className="size-5 shrink-0 text-[#F5C26B]"
                  aria-hidden
                />
                <p className="font-space-mono text-[13px] whitespace-nowrap text-white uppercase sm:text-xl">
                  <span className="font-bold">50,000+</span>{" "}
                  <span className="text-white/50">new jobs this month</span>
                </p>
              </div>
              <span
                aria-hidden
                className="hidden h-px w-16 bg-linear-to-l from-[#010123]/70 to-[#A8A8A8]/70 sm:block"
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center font-manrope text-[40px] leading-[1.15] font-bold tracking-[-0.02em] text-white sm:text-[56px]">
                Find Your Dream Job Today
              </h1>
              <p className="max-w-[784px] text-center font-manrope text-base leading-[1.6] text-white sm:text-xl">
                HireLoop connects top talent with world-class companies. Browse
                thousands of curated opportunities and land your next role —
                faster.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <form
              action="/jobs"
              className="flex w-full flex-col gap-2 rounded-2xl border border-white/20 bg-[#101010] p-2 sm:h-16 sm:flex-row sm:items-center sm:gap-6 sm:pr-2 sm:pl-6"
            >
              <label className="flex min-w-0 flex-1 items-center gap-2">
                <Search className="size-6 shrink-0 text-white" aria-hidden />
                <span className="sr-only">Job title, skill or company</span>
                <input
                  type="search"
                  name="query"
                  placeholder="Job title, skill or company"
                  className="h-9 w-full min-w-0 bg-transparent text-base text-white placeholder:text-white focus:outline-none"
                />
              </label>

              <span
                aria-hidden
                className="hidden h-[23px] w-px shrink-0 bg-white/20 sm:block"
              />

              <label className="flex min-w-0 flex-1 items-center gap-2">
                <MapPin className="size-6 shrink-0 text-white" aria-hidden />
                <span className="sr-only">Location or Remote</span>
                <input
                  type="text"
                  name="location"
                  placeholder="Location or Remote"
                  className="h-9 w-full min-w-0 bg-transparent text-base text-white placeholder:text-white focus:outline-none"
                />
              </label>

              <button
                type="submit"
                aria-label="Search jobs"
                className="flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-[#5C53FE] text-white transition-colors hover:bg-[#6B63FF] sm:w-12"
              >
                <Search className="size-5" aria-hidden />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <span className="font-manrope text-base leading-[1.3] text-white/70">
                Trending Position
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {trendingRoles.map((role) => (
                  <Link
                    key={role}
                    href={`/jobs?query=${encodeURIComponent(role)}`}
                    className="rounded-full border border-white/10 bg-[#1A1A1B] px-3 py-1.5 font-manrope text-sm leading-[1.5] text-white transition-colors hover:border-white/25 hover:bg-[#232326]"
                  >
                    {role}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-28 flex w-full max-w-[1320px] flex-col items-center sm:mt-[286px] sm:pt-[72px]">
          <h2 className="max-w-[700px] text-center font-instrument text-[28px] leading-[1.3] font-medium text-balance text-white/70 sm:text-[40px]">
            Assisting over 15,000 job seekers find their dream positions.
          </h2>

          <div className="mt-8 grid w-full grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex h-[200px] flex-col justify-end rounded-2xl bg-linear-to-t from-[#010102] to-[#313131] p-6 sm:h-[254px]"
              >
                <p className="font-jakarta text-[40px] leading-[1.15] font-semibold text-white sm:text-[56px]">
                  {stat.value}
                </p>
                <p className="mt-4 font-inter-tight text-lg text-white">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
