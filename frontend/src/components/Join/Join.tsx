import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Join.module.css"
import { ArrowLeft } from "lucide-react";
export default function JoinRoom(){
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [roomCode,setRoomCode]=useState<string>("");
    const [codeError,setCodeError]=useState<string>("");
    const handleJoin=(e:React.FormEvent)=>{
        e.preventDefault()
        if(roomCode.length!==6){
            return;
        }
        setLoading(true)
        console.log("Joining room:",roomCode)
    }
    const isFormvalid=roomCode.length===6 ? true : false
    return(
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <span className={styles.navLogo}>
                    ⚡ QuizArena
                </span>
                <button className={styles.backButton} onClick={()=>navigate("/dashboard")}>
                    <ArrowLeft size={16}/> Dashboard
                </button>
            </nav>

            <div className={styles.contentContainer}>
                <h1 className={styles.title}>Join a game</h1>
                <p className={styles.subTitle}>Enter the room code your host shared with you </p>

                <form className={styles.joinForm}>
                    <div className={styles.codeRow}>
                       <input 
                       type="text" 
                       maxLength={6}
                       placeholder="012345"
                       value={roomCode}
                       onChange={(e)=>setRoomCode(e.target.value)}
                       className={styles.codeInput}
                       />

                    </div>
                    <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={ !isFormvalid|| loading}
                    >
                    </button>
                    <p className={styles.footerNote}></p>
                </form>
            </div>
        </div>
    )
}