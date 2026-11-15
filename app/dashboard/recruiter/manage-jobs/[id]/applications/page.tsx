import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JobApplications } from "@/components/recruiter/job-applications"
import type { JobPayload } from "@/components/dashboard/new-job-form"
import type { Application } from "@/lib/application"
import { applicationsData } from "@/lib/application"
import { jobDetails } from "@/lib/job"

export const metadata: Metadata = {
  title: "Job Applications · HireLoop",
  description: "Review applicants for your job post.",
}

const ApplicationsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  let job: JobPayload | null = null
  let applications: Application[] = []
  try {
    ;[job, applications] = await Promise.all([jobDetails(id), applicationsData(`jobId=${id}`)])
  } catch {
    // TODO: surface API errors; show the not-found state while the API is unreachable.
  }

  if (!job || !job.title) notFound()

  return <JobApplications job={job} applications={applications} />
}

export default ApplicationsPage
