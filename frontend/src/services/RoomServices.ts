const ROOM_URL='http://localhost:7000/api/rooms'
const SOLO_API_URL="http://localhost:7000/api/room/solo"


interface soloDetails{
    category:string[]
    amount:number
    difficulty:string
}
export const handleRoomRequest={
    async joinRoom(roomCode:string) {
        const token=localStorage.getItem("token")
        const res=await fetch(ROOM_URL,{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(roomCode)
        }) 
        if(!res.ok){
            const errorData=await res.json()
            throw new errorData(errorData.message || "Something went wrong")
        }
        return await res.json()
    },

    async createRoom(roomDetails:string[]){
        const token=localStorage.getItem("token")
        const res=await fetch(`${ROOM_URL}/create`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(roomDetails)
        })

        if(!res.ok){
            const errorData=await res.json()
            throw new errorData(errorData.message || "Something went wrong")
        }
        return await res.json()
    },
    async soloRequest(soloDetails:soloDetails){
        const token=localStorage.getItem("token")
        const res=await fetch(SOLO_API_URL,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(soloDetails)
        })
        if(!res.ok){
            const errorData = await res.json()
            console.log(errorData.message)
            throw new Error(errorData.message || "Something went wrong")
        }
        return await res.json()
  }
}