
const API_URL= "http://localhost:7000/api/code"
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