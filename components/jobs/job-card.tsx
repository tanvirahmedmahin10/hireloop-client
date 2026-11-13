import { Bookmark, Clock3, Globe2, Wallet, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import type { JobPayload } from "@/components/dashboard/new-job-form"

/** Formats the `salary` field of a JobPayload for display, e.g. "$90k - $120k" or "$45 - $60 per hour". */
function formatSalary(job: JobPayload) {
  const { min, max, frequency } = job.salary
  if (min == null || max == null) return "Salary not specified"
  return frequency === "per year"
    ? `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`
    : `$${min.toLocaleString("en-US")} - $${max.toLocaleString("en-US")} ${frequency}`
}

function InfoBadge({
  icon: Icon,
  className,
  children,
}: {
  icon?: LucideIcon
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[30px] items-center gap-1.5 rounded-[8px] border border-white/[0.08] bg-[#1a1a1f] px-3 text-[13px] font-medium text-[#ededef]",
        className
      )}
    >
      {Icon ? <Icon className="size-3.5 text-[#e5e2e3]" /> : null}
      {children}
    </span>
  )
}

/** Reusable job listing card — renders any `JobPayload`. */
export function JobCard({ job }: { job: JobPayload }) {
  return (
    <article className="flex gap-5 rounded-[16px] border border-white/[0.06] bg-[#141418] p-6">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-[8px] bg-[#222228] text-xl font-semibold text-[#ededef]">
        {job.company.charAt(0).toUpperCase()}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[22px] leading-tight font-semibold text-[#ededef]">{job.title}</h3>
            <p className="mt-1 truncate text-base font-semibold text-[#6e6e78]">
              {job.company} • {job.location}
              {job.isRemote ? " (Remote)" : ""}
            </p>
          </div>
          <button
            type="button"
            title="Save job"
            className="flex size-10 shrink-0 items-center justify-center rounded-[8px] text-[#8e9192] transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bookmark className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <InfoBadge icon={Wallet}>{formatSalary(job)}</InfoBadge>
          <InfoBadge icon={Clock3}>{job.jobType}</InfoBadge>
          {job.isRemote ? (
            <InfoBadge
              icon={Globe2}
              className="border-[#22c55e]/20 bg-[#22c55e]/10 [&>svg]:text-[#22c55e] text-[#22c55e]"
            >
              Remote
            </InfoBadge>
          ) : null}
        </div>
      </div>
    </article>
  )
}
