import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JobDetails } from "@/components/jobs/job-details"
import type { JobPayload } from "@/components/dashboard/new-job-form"
import { jobDetails } from "@/lib/job"

export const metadata: Metadata = {
  title: "Job Details · HireLoop",
  description: "Read the full job details on HireLoop.",
}

const JobDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  let job: JobPayload | null = null
  try {
    job = await jobDetails(id)
  } catch {
    // TODO: surface API errors; show the not-found state while the API is unreachable.
  }

  if (!job || !job.title) notFound()

  return (
    <div className="min-h-svh bg-[#08080a]">
      <JobDetails job={job} />
    </div>
  )
}

export default JobDetailsPage
