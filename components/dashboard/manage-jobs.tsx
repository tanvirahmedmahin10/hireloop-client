"use client"

import * as React from "react"
import Link from "next/link"
import { Activity, Clock3, Pencil, Plus, Trash2, Users } from "lucide-react"
import { cn } from "@/lib/utils"

import type { JobPayload } from "@/components/dashboard/new-job-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { manageJobs } from "@/lib/job"

/* -------------------------------------------------------------------------- */
/*  Data — every row is a `JobPayload` (the type from the new-job form)       */
/* -------------------------------------------------------------------------- */

const jobs: JobPayload[] = await manageJobs()

const todayISO = new Date().toISOString().slice(0, 10)

/** A job is Closed once its deadline has passed (nothing else in JobPayload tracks status). */
const isClosed = (job: JobPayload) => !!job.deadline && job.deadline < todayISO

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const triggerClass =
  "h-[38px] w-[262px] rounded-[10px] border border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] justify-between data-placeholder:text-[#6e6e78] [&_svg]:text-[#a1a4aa] dark:bg-[#0c0c0f]"

type StatusFilter = "all" | "active" | "closed"

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex w-[262px] flex-col gap-2">
      <label htmlFor={id} className="text-[13px] text-[#a0a0ab]">
        {label}
      </label>
      <Select value={value} onValueChange={(next) => onChange(next ?? "all")}>
        <SelectTrigger id={id} className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="focus:bg-[#2c2c31] focus:text-white">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


export function ManageJobs() {
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [category, setCategory] = React.useState("all")

  const activeCount = jobs.filter((job) => !isClosed(job)).length
  const closedCount = jobs.length - activeCount
  const categoryOptions = [...new Set(jobs.map((job) => job.category))]

  const visible = jobs.filter(
    (job) =>
      (status === "all" || (status === "closed") === isClosed(job)) &&
      (category === "all" || job.category === category)
  )

  const stats = [
    {
      icon: Users,
      label: "Total Jobs",
      value: String(jobs.length),
      note: "across all categories",
      noteClass: "text-[#a0a0ab]",
    },
    {
      icon: Activity,
      label: "Active Listings",
      value: String(activeCount),
      note: `${jobs.length ? Math.round((activeCount / jobs.length) * 100) : 0}% of all listings`,
      noteClass: "text-[#22c55e]",
    },
    {
      icon: Clock3,
      label: "Closed Listings",
      value: String(closedCount),
      note: "past application deadline",
      noteClass: "text-[#f59e0b]",
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#ededef]">Manage Jobs</h1>
          <p className="mt-1 text-[13px] text-[#a0a0ab]">
            Oversee all active listings and historical job posts across the platform.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/manage-jobs/new"
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-[#fafafa] px-3 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white"
        >
          <Plus className="size-3.5" />
          Create Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <FilterSelect
            id="filter-status"
            label="Status"
            value={status}
            onChange={(value) => setStatus(value as StatusFilter)}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "closed", label: "Closed" },
            ]}
          />
          <FilterSelect
            id="filter-category"
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "All Categories" },
              ...categoryOptions.map((option) => ({ value: option, label: option })),
            ]}
          />
        </div>

        <div className="flex items-center gap-1 rounded-[10px] border border-white/[0.08] bg-[#1a1a1f] p-1">
          {(["active", "closed"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatus(status === filter ? "all" : filter)}
              className={cn(
                "h-8 rounded-[8px] px-3 text-[13px] transition-colors",
                status === filter ? "bg-[#232327] text-white" : "text-[#a0a0ab] hover:text-white"
              )}
            >
              {filter === "active" ? "Active" : "Closed"} ({filter === "active" ? activeCount : closedCount})
            </button>
          ))}
        </div>
      </div>


      <div className="overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                {["Title", "Company", "Category", "Type", "Deadline", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-[11px] font-medium text-[#6e6e78]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((job) => {
                const closed = isClosed(job)
                return (
                  <tr key={`${job.company}-${job.title}`} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-[#ededef]">{job.title}</p>
                      <p className="mt-0.5 text-xs text-[#a0a0ab]">{job.location}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className="flex size-8 items-center justify-center rounded-[4px] bg-[#222228] text-xs text-[#ededef]">
                          {job.company.charAt(0)}
                        </span>
                        <span className="text-[13px] text-[#ededef]">{job.company}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full border border-white/[0.08] bg-[#1a1a1f] px-2.5 py-0.5 text-xs text-[#ededef]">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">{job.jobType}</td>
                    <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">
                      {job.deadline ? formatDate(job.deadline) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          closed
                            ? "border-white/10 bg-white/5 text-[#a0a0ab]"
                            : "border-[#22c55e]/20 bg-[#22c55e]/10 text-[#22c55e]"
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", closed ? "bg-[#a0a0ab]" : "bg-[#22c55e]")} />
                        {closed ? "Closed" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit job"
                          className="flex size-8 items-center justify-center rounded-[8px] text-[#c4c7c8] transition-colors hover:bg-white/5"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete job"
                          className="flex size-8 items-center justify-center rounded-[8px] text-[#c4c7c8] transition-colors hover:bg-white/5"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    No jobs match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[16px] border border-white/[0.06] bg-[#141418] p-6">
            <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#a0a0ab]">
              <stat.icon className="size-4 text-[#c4c7c8]" />
              {stat.label}
            </div>
            <p className="mt-3 text-[26px] font-semibold text-[#ededef]">{stat.value}</p>
            <p className={cn("mt-3 text-[13px]", stat.noteClass)}>{stat.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
