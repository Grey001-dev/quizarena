const API_URL="http://localhost:7000/api/room";

export async function loadQuestion(roomId:string){
    const token=localStorage.getItem("token")
    const res=await fetch(`${API_URL}/${roomId}/question`,{
         headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    })
    if(!res.ok){
        const errorData=await res.json();
        throw new Error(errorData.message|| "Error loading those questions bro")
    };
    return await res.json()
}

export async function sendAnswer(selectedAnswer :string,roomId:string){
    const token=localStorage.getItem("token")
    const res=await fetch(`${API_URL}/${roomId}/answer`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({answer:selectedAnswer})
    });

    if(!res.ok){
        const errorData=await res.json();
        throw new Error(errorData.message ||"Error sending answer")
    }
    return await res.json();
}

export async function getCategories(){
    const token=localStorage.getItem("token");
    const res=await fetch(`${API_URL}/categories`,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    if(!res.ok){
        const errorData=await res.json()
        throw new Error(errorData.message || "Something went wrong fetching categories")
    }
    return await res.json();
}