import type { ApplicationInput } from "@/lib/application"

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const appliedJobs = async (data: ApplicationInput) => {
  const res = await fetch(`${baseUrl}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}
export const updateApplication=async(id:string,data:{status:string})=>{
const res = await fetch(`${baseUrl}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()

}