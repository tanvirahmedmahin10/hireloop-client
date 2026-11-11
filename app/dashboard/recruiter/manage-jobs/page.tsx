import type { Metadata } from "next"

import { ManageJobs } from "@/components/dashboard/manage-jobs"

export const metadata: Metadata = {
  title: "Manage Jobs · HireLoop",
  description: "Oversee all active listings and historical job posts across the platform.",
}

const ManageJobsPage = () => {
  return (
    <div className="min-h-svh bg-[#0b0b0c]">
      <ManageJobs />
    </div>
  )
}

export default ManageJobsPage
