const API_URL = "http://localhost:7000/api/auth"
const SOLO_API_URL="http://localhost:7000/api/solo"
interface UserDetails {
  mode: "login" | "register"
  username?: string
  email: string
  password: string
}
interface soloDetails{
    category: String
    questions:Number
    difficulty:String
}

export const AuthServices = {
  async submit(userDetails: UserDetails) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails)
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Something went wrong")
    }
    return await res.json()
  },
}

