
const API_URL= "https://quizarena-br8y.onrender.com/api/code"
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