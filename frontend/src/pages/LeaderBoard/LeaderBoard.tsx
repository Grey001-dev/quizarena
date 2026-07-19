import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarDisplay from "../../components/AvatarDisplay/AvatarDisplay";
import { ArrowLeft } from "lucide-react";
import styles from "./LeaderBoard.module.css"

interface LeaderBoard{
    id:string;
    username:string;
    elo:number;
    avatarSeed:string;
}

export default function LeaderboardPage(){
    const navigate=useNavigate();
    const [users,setUsers]=useState<LeaderBoard[]>([]);
    const currentUser=JSON.parse(localStorage.getItem("user")|| "{}")

    useEffect(()=>{
        const fetchLeaderboard=async()=>{
            const token=localStorage.getItem("token")
            try {
                const res=await fetch("http://localhost:7000/api/user/leaderboard",{
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    }
                })
                const data=await res.json()
                setUsers(data)
            } catch (error:any) {
                console.log(error.message)
            }
        }
        fetchLeaderboard();
    },[])

    return(
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <span className={styles.navLogo}>⚡ QuizArena</span>
                <button className={styles.backButton} onClick={()=>navigate("/dashboard")}>
                    <ArrowLeft size={14}/> Dashboard
                </button>
            </nav>

            <div className={styles.list}>
                {users.map((user,index)=>(
                    <div key={user.id} className={user.id===currentUser.id ? styles.rowActive: styles.row}>
                        <span className={styles.rank}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                        <AvatarDisplay seed={user.avatarSeed} size={36}/>
                        <span className={styles.username}>
                            {user.id===currentUser.id ? "You" : user.username}
                        </span>
                        <span className={styles.elo}>{user.elo} ELO</span>
                    </div>
                ))}

            </div>

        </div>
    )
}