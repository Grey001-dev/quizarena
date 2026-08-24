
const API_URL= "https://quizarena.grey001dev.hackclub.app/api/code"

export const generateCode=async ()=>{
    const token=localStorage.getItem("token");
    const res=await fetch(API_URL,
        {
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return await res.json()
}