const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const checkoutVerify=async(sessionId:string)=>{
      const res = await fetch(`${baseUrl}/payments/checkVerify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({sessionId}),
  })
  return res.json()
}

export const getUserPremiumById=async(userId:string)=>{
  const res = await fetch(`${baseUrl}/all/${userId}/premium`)
  return res.json()

}