"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

import type { JobPayload } from "@/components/dashboard/new-job-form"
import type { Application, ApplicationStatus } from "@/lib/application"
import { statusStyles, timeAgo } from "@/lib/application"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateApplication } from "@/lib/actions/applications"

const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Review",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Offered",
]

/** Recruiter view: review every applicant for one job and update their status. */
export function JobApplications({
  job,
  applications,
}: {
  job: JobPayload
  applications: Application[]
}) {
  // Status per application id — kept locally until the database update is wired.
  // Falls back to "Applied" because older records may be missing the status field.
  const [statuses, setStatuses] = React.useState<Record<string, ApplicationStatus>>(() =>
    Object.fromEntries(
      applications.map((application) => [application._id, application.status ?? "Applied"])
    )
  )

  const handleStatusChange = async(id: string, status: ApplicationStatus) => {
    const result=await updateApplication(id,{status})
    console.log('updated result',result);
    if(result.modifiedCount>0){
setStatuses((prev) => ({ ...prev, [id]: status }))
    }
    
  
  }

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-8 sm:px-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/recruiter/manage-jobs"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#a0a0ab] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Back to Manage Jobs
        </Link>
        <h1 className="mt-2 text-[22px] font-semibold text-[#ededef]">Job Applications</h1>
        <p className="mt-1 text-[13px] text-[#a0a0ab]">
          Review applicants for <span className="text-[#ededef]">{job.title}</span> at{" "}
          {job.company}.
        </p>
      </div>

      {/* Applicants table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                {["Applicant", "Applied", "Status", "Update Status"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-xs font-medium text-[#6e6e78]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application._id}
                  className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#222228] text-xs text-[#ededef]">
                        {application.email.charAt(0).toUpperCase()}
                      </span>
                      <span
                        className="truncate text-[13px] font-medium text-[#ededef]"
                        title={application.email}
                      >
                        {application.email}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">
                    {timeAgo(application.appliedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusStyles[statuses[application._id] ?? "Applied"]
                      )}
                    >
                      {statuses[application._id] ?? "Applied"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={statuses[application._id] ?? "Applied"}
                      onValueChange={(value) =>
                        handleStatusChange(application._id, value as ApplicationStatus)
                      }
                    >
                      <SelectTrigger className="h-9 w-[160px] justify-between rounded-[8px] border border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] [&_svg]:text-[#a1a4aa]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
                        {statusOptions.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="focus:bg-[#2c2c31] focus:text-white"
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    No applications yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/[0.06] bg-[#1a1a1f] px-6 py-4 text-[13px] text-[#a0a0ab]">
          {applications.length} applicant{applications.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  )
}
