"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { JobPayload } from "@/components/dashboard/new-job-form"
import { applicationsData } from "@/lib/application"
import { authClient } from "@/lib/auth-client"
import { manageJobs } from "@/lib/job"

/**
 * Recruiter hub for applications: lists the signed-in recruiter's jobs,
 * and clicking a job opens its applicants page (manage-jobs/[id]/applications).
 */
export function ApplicationsOverview() {
  const { data: session } = authClient.useSession()
  const [jobs, setJobs] = React.useState<JobPayload[]>([])
  const [loading, setLoading] = React.useState(true)
  // Applicant count per job id (the API has no per-job count yet).
  const [counts, setCounts] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    if (!session?.user.id) return
    let cancelled = false

    const load = async () => {
      const [jobs, applications] = await Promise.all([
        manageJobs(`recruiterId=${session.user.id}`),
        applicationsData(),
      ])
      if (cancelled) return
      setJobs(jobs)
      setCounts(
        Object.fromEntries(
          jobs.map((job) => [job._id, applications.filter((a) => a.jobId === job._id).length])
        )
      )
    }

    load()
      .catch(() => {
        if (!cancelled) {
          setJobs([])
          setCounts({})
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [session?.user.id])

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-8 sm:px-8">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-[#ededef]">Applications</h1>
        <p className="mt-1 text-[13px] text-[#a0a0ab]">
          Select a job to review its applicants.
        </p>
      </div>

      {/* Jobs table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                {["Title", "Company", "Type", "Applicants", ""].map((heading, index) => (
                  <th key={heading || index} className="px-4 py-3 text-[11px] font-medium text-[#6e6e78]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#ededef]">{job.title}</p>
                    <p className="mt-0.5 text-xs text-[#a0a0ab]">{job.location}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">{job.company}</td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">{job.jobType}</td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">
                    {counts[job._id] ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/recruiter/manage-jobs/${job._id}/applications`}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/10 px-3 py-1.5 text-[13px] text-[#ededef] transition-colors hover:bg-white/5"
                    >
                      View Applications
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    Loading your jobs…
                  </td>
                </tr>
              ) : null}
              {!loading && jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    No job posts yet — create one from{" "}
                    <Link href="/dashboard/recruiter/manage-jobs/new" className="text-[#ededef] underline-offset-2 hover:underline">
                      Manage Jobs
                    </Link>
                    .
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/[0.06] bg-[#1a1a1f] px-6 py-4 text-[13px] text-[#a0a0ab]">
          {loading ? "" : `${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
        </div>
      </div>
    </div>
  )
}
