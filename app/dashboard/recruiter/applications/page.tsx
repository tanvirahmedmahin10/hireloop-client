import type { Metadata } from "next"

import { ApplicationsOverview } from "@/components/recruiter/applications-overview"

export const metadata: Metadata = {
  title: "Applications · HireLoop",
  description: "Pick a job to review its applicants.",
}

export default function ApplicationsPage() {
  return <ApplicationsOverview />
}
