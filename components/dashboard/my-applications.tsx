"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { cn } from "@/lib/utils"

import type { Application } from "@/lib/application"
import { applicationsData, statusStyles, timeAgo } from "@/lib/application"
import { authClient } from "@/lib/auth-client"
const { data: session } = await authClient.getSession();

const applications: Application[] = await applicationsData(
  `userId=${session?.user.id}`
);

type Tab = "active" | "archived"

export function MyApplications() {
  const [tab, setTab] = React.useState<Tab>("active")

  const active = applications.filter((application) => !application.archived)
  const archived = applications.filter((application) => application.archived)
  const visible = tab === "active" ? active : archived

  const shortlisted = active.filter((a) => a.status === "Shortlisted").length
  const interviews = active.filter((a) => a.status === "Interview").length
  const offered = active.filter((a) => a.status === "Offered").length

  const stats = [
    { label: "Total Applied", value: String(active.length), valueClass: "text-[#ededef]" },
    { label: "Shortlisted", value: String(shortlisted), valueClass: "text-[#ededef]" },
    { label: "Interviews", value: String(interviews), valueClass: "text-[#f59e0b]" },
    {
      label: "Success Rate",
      value: `${active.length ? Math.round((offered / active.length) * 100) : 0}%`,
      valueClass: "text-[#22c55e]",
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#ededef]">My Applications</h1>
          <p className="mt-1 text-[13px] text-[#ededef]">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-[10px] border border-white/[0.08] bg-[#1a1a1f] p-1">
            {(["active", "archived"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={cn(
                  "h-8 rounded-[8px] px-4 text-[13px] transition-colors",
                  tab === option ? "bg-[#232327] text-[#ededef]" : "text-[#a0a0ab] hover:text-white"
                )}
              >
                {option === "active" ? "Active" : "Archived"}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white"
          >
            <Download className="size-3" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/[0.06] bg-[#141418] p-6">
            <p className="text-[13px] text-[#a0a0ab]">{stat.label}</p>
            <p className={cn("mt-2 text-[26px] font-semibold leading-8", stat.valueClass)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Applications table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                {["Job Title", "Company", "Applied", "Status", "Action"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-xs font-medium text-[#6e6e78]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((application) => (
                <tr
                  key={application._id}
                  className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#222228] text-xs text-[#ededef]">
                        {application.companyName.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-[#ededef]">
                          {application.jobTitle}
                        </span>
                        <span className="block text-xs text-[#a0a0ab]">
                          {application.jobType} • {application.isRemote ? "Remote" : "On-site"}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#ededef]">{application.companyName}</td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">
                    {timeAgo(application.appliedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusStyles[application.status ?? "Applied"]
                      )}
                    >
                      {application.status ?? "Applied"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-[13px] text-[#ededef] transition-colors hover:text-white"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    No {tab} applications.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] bg-[#1a1a1f] px-6 py-4">
          <p className="text-[13px] text-[#a0a0ab]">
            Showing 1-{visible.length} of {applications.length} applications
          </p>
          <nav aria-label="Pagination" className="flex items-center gap-2">
            <button
              type="button"
              title="Previous page"
              className="flex size-8 items-center justify-center rounded-[8px] border border-white/10 text-[#a0a0ab] transition-colors hover:bg-white/5"
            >
              <ChevronLeft className="size-4" />
            </button>
            {[1, 2, 3].map((page) => (
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
        </div>
      </div>
    </div>
  )
}
