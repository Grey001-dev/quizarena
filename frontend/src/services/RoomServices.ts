const ROOM_URL = 'https://quizarena-br8y.onrender.com/api/room'
const SOLO_API_URL = "https://quizarena-br8y.onrender.com/api/room/solo"

interface soloDetails {
  category: string[]
  amount: number
  difficulty: string
}

export const handleRoomRequest = {
  async joinRoom(roomCode: string) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${ROOM_URL}/join`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roomCode })
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Something went wrong")
    }
    return await res.json()
  },

  async createRoom() {
    const token = localStorage.getItem("token")
    const res = await fetch(`${ROOM_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Something went wrong")
    }
    return await res.json()
  },

  async soloRequest(soloDetails: soloDetails) {
    const token = localStorage.getItem("token")
    const res = await fetch(SOLO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(soloDetails)
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Something went wrong")
    }
    return await res.json()
  }
}