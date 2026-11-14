import type { JobPayload } from "@/components/dashboard/new-job-form"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
/**
 * Application status pipeline:
 * Applied → Review → Shortlisted → Interview → Offered / Rejected
 */
export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Offered"

/**
 * What the client sends when applying (the payload for POST /applications).
 * The server fills in the defaults (status "Applied", appliedAt now, archived false).
 */
export interface ApplicationInput {
  /** The seeker (auth user) who submitted the application. */
  userId: string
  email: string
  /** The job that was applied to (reference + denormalized display fields). */
  jobId: JobPayload["_id"]
  jobTitle: string
  companyName: string
  jobType: string
  isRemote: boolean
  coverLetter?: string
  /** Link to the resume used for this application. */
  resumeUrl?: string
}

/** A saved application — an ApplicationInput plus what the database adds. */
export interface Application extends ApplicationInput {
  _id: number
  status: ApplicationStatus
  /** ISO datetime of submission — rendered as "2 hours ago" on My Applications. */
  appliedAt: string
  /** Soft flag for the Active / Archived toggle on My Applications. */
  archived: boolean
}

// ---------------------------------------------------------------------------
// API — same pattern as lib/job.ts.
// ---------------------------------------------------------------------------

export const applicationsData = async (query=""): Promise<Application[]> => {
  const res = await fetch(`${baseUrl}/applications?${query}`)
  return res.json()
}

export const applicationsDataCount = async (query=""): Promise<{count:number}> => {
  const res = await fetch(`${baseUrl}/applications/count?${query}`)
  return res.json()
}