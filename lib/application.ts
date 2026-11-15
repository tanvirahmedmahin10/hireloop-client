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
  jobId: string
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
  _id: string
  status: ApplicationStatus
  /** ISO datetime of submission — rendered as "2 hours ago" on My Applications. */
  appliedAt: string
  /** Soft flag for the Active / Archived toggle on My Applications. */
  archived: boolean
}

/** Badge classes per status — shared by the seeker and recruiter application tables. */
export const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "border-white/10 bg-white/5 text-[#a1a4aa]",
  Review: "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
  Shortlisted: "border-[#60a5fa]/30 bg-[#60a5fa]/10 text-[#60a5fa]",
  Interview: "border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa]",
  Rejected: "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]",
  Offered: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
}

/** Formats an ISO datetime as "2 hours ago", "3 days ago", etc. Falls back to "just now" for missing/invalid values. */
export const timeAgo = (iso: string) => {
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return "just now"
  const minutes = Math.floor((Date.now() - timestamp) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`
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