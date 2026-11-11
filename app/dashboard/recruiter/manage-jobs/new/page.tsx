import type { Metadata } from "next"

import { NewJobForm } from "@/components/dashboard/new-job-form"

export const metadata: Metadata = {
  title: "Post a New Job · HireLoop",
  description: "Create a new job listing for qualified candidates across the HireLoop network.",
}

const AddJobPage = () => {
  return (
    <div className="min-h-svh bg-[#0b0b0c]">
      <NewJobForm />
    </div>
  )
}

export default AddJobPage
