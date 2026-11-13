"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

import type { JobPayload } from "@/components/dashboard/new-job-form"
import { JobCard } from "@/components/jobs/job-card"
import { FilterCheckbox, FilterGroup } from "@/components/jobs/filter-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sortOptions = [
  "Most Recent",
  "Relevance",
  "Salary: High to Low",
  "Salary: Low to High",
]

export function BrowseJobs({ jobs }: { jobs: JobPayload[] }) {
  const jobTypes = [...new Set(jobs.map((job) => job.jobType))]
  const jobCategories = [...new Set(jobs.map((job) => job.category))]
  const remoteCount = jobs.filter((job) => job.isRemote).length

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: set the search query here (e.g. router.push with the form values).
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8">
      {/* Search & quick filters */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-[16px] border border-white/[0.06] bg-[#141418] p-6 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8e9192]" />
          <input
            name="search"
            placeholder="Search by job title, keywords..."
            className="h-[58px] w-full rounded-[8px] border border-transparent bg-[#1a1a1f] pr-4 pl-11 text-sm text-[#ededef] outline-none placeholder:text-[#a0a0ab] focus-visible:border-[#5c53fe]/70"
          />
        </div>
        <button
          type="submit"
          className="h-[58px] rounded-[8px] bg-white px-6 text-base font-semibold text-[#2f3131] transition-colors hover:bg-[#e5e2e3]"
        >
          Search Jobs
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[296px_1fr]">
        {/* Sidebar filters — built from common JobPayload fields */}
        <aside className="h-fit rounded-[16px] border border-white/[0.06] bg-[#141418] p-6">
          <h3 className="text-[22px] font-semibold text-[#ededef]">Filters</h3>
          <div className="mt-6 flex flex-col gap-6">
            <FilterGroup title="Job Type">
              {jobTypes.map((type) => (
                <FilterCheckbox
                  key={type}
                  name="jobType"
                  label={type}
                  type="radio"
                  count={jobs.filter((job) => job.jobType === type).length}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Category">
              {jobCategories.map((category) => (
                <FilterCheckbox
                  key={category}
                  name="category"
                  label={category}
                  type="radio"
                  count={jobs.filter((job) => job.category === category).length}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Work Mode">
              <FilterCheckbox name="isRemote" value="true" label="Remote only" count={remoteCount} />
            </FilterGroup>
          </div>
        </aside>

        {/* Listings */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px] font-semibold text-[#ededef]">
              Found {jobs.length} Professional Jobs
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-[#6e6e78]">Sort by:</span>
              <Select defaultValue="Most Recent">
                <SelectTrigger className="h-9 w-[141px] justify-between rounded-[8px] border border-white/10 bg-[#0c0c0f] px-3 text-[13px] font-medium text-[#ededef] [&_svg]:text-[#a1a4aa]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option} className="focus:bg-[#2c2c31] focus:text-white">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {jobs.map((job) => (
              <JobCard key={`${job.company}-${job.title}`} job={job} />
            ))}
            {jobs.length === 0 ? (
              <p className="rounded-[16px] border border-white/[0.06] bg-[#141418] p-10 text-center text-[13px] text-[#a0a0ab]">
                No jobs found.
              </p>
            ) : null}
          </div>

          {jobs.length > 0 ? (
            <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                title="Previous page"
                className="flex size-8 items-center justify-center rounded-[8px] border border-white/10 text-[#a0a0ab] transition-colors hover:bg-white/5"
              >
                <ChevronLeft className="size-4" />
              </button>
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-[8px] text-[13px] transition-colors",
                    page === 1
                      ? "bg-white font-medium text-[#0b0b0c]"
                      : "border border-white/10 text-[#a0a0ab] hover:bg-white/5"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                title="Next page"
                className="flex size-8 items-center justify-center rounded-[8px] border border-white/10 text-[#a0a0ab] transition-colors hover:bg-white/5"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  )
}
