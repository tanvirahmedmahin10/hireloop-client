import type { Metadata } from "next"

import { MyApplications } from "@/components/dashboard/my-applications"

export const metadata: Metadata = {
  title: "My Applications · HireLoop",
  description: "Track your job applications and interview progress.",
}

const ApplicationsPage = () => {
  return <MyApplications />
}

export default ApplicationsPage
