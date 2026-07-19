const API_URL = "https://quizarena-br8y.onrender.com/api/auth"
interface UserDetails {
  mode: "login" | "register"
  username?: string
  email: string
  password: string
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

