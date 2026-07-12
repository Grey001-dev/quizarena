import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './LobbyPage.module.css'
import { ArrowLeft } from "lucide-react";

interface Player{
    isHost:boolean;
    socketId:string;
    username:string;
    elo:number;
    avatar:string;
}

interface ChatMessage{
    username:string;
    text:string;
    timestamp:number;
}

export default  function LobbyPage(){
    const navigate=useNavigate();
    const [players,setPlayers]=useState<Player[]>([]);
    const [messages,setMessages]=useState();
    const [chatInput,setChatInput]=useState("")
    const [roomCode,setRoomCode]=useState("")
    const isHost=players.find(p=>p);
    
    return(
        <div className={styles.page}>
             <nav className={styles.nav}>
                <span className={styles.navLogo}>
                    ⚡ QuizArena
                </span>
                <button className={styles.backButton} onClick={()=>navigate("/dashboard")}>
                    <ArrowLeft size={14}/>Dashboard
                </button>
             </nav>

             <div className={styles.content}>
                <div className={styles.codeBox}>
                    <p className={styles.codeLabel}>
                        Room code
                    </p>
                    <p className={styles.codeValue}>{roomCode}</p>
                </div>
                <div className={styles.twoCol}>
                    <div className={styles.panel}>
                        <p className={styles.panelLabel}>
                            Players({players.length})
                        </p>
                    </div>
                </div>


             </div>
        </div>
    )
}