import type { Metadata } from "next"

import { BrowseJobs } from "@/components/jobs/browse-jobs"
import type { JobPayload } from "@/components/dashboard/new-job-form"
import { manageJobs } from "@/lib/job"

export const metadata: Metadata = {
  title: "Browse Jobs · HireLoop",
  description: "Find your next role across the HireLoop network.",
}

const BrowsingJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams(search as Record<string, string>)
  const query = urlSearch.toString()

  let jobs: JobPayload[] = []
  try {
    jobs = await manageJobs(query)
  } catch {
    // TODO: surface API errors; render an empty list while the API is unreachable.
  }

  return (
    <div className="min-h-svh bg-[#08080a]">
      <BrowseJobs jobs={Array.isArray(jobs) ? jobs : []} />
    </div>
  )
}

export default BrowsingJobsPage
