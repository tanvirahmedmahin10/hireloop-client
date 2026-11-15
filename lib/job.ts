import { JobPayload } from "@/components/dashboard/new-job-form"

const baseUrl=process.env.NEXT_PUBLIC_API_URL

export const createJobs=async(data:JobPayload)=>{
const res=await fetch(`${baseUrl}/jobs`,{
    method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
return res.json()
}
export const jobDetails = async (id: string): Promise<JobPayload> => {
  const res = await fetch(`${baseUrl}/jobs/${id}`)
  return res.json()
}
export const manageJobs = async (query = ""): Promise<JobPayload[]> => {
  const res = await fetch(`${baseUrl}/jobs?${query}`)
  return res.json()
}