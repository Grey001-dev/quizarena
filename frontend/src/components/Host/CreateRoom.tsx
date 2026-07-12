import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./CreateRoom.module.css";
import { Socket } from "socket.io-client";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Player{
    socketId:string;
    username:string
    userId:string
    isHost:boolean
    timeEntered:Date
    Elo:Number
}

export default function HostPage(){
    const navigate=useNavigate();
    const location=useLocation();
    const [category,setCategory]=useState("");
    const [difficulty,setDifficulty]=useState('Easy');
    const [amount,setAmount]=useState(10);
    const [loading,setLoading]=useState(false);
    const [roomCode,setRoomCode]=useState<string | null>(location.state || null);
    const [players,setPlayers]=useState<Player[]>([]);
    const [isMixed,setIsMixed]=useState(false);
    const [selectedCategories,setSelectedCategories]=useState<string[]>(["9"])
    const [creatingRoom,setCreatingRoom]=useState(true)
    const CATEGORIES=[
        {label:'General knowledge',value:'9'},
        {label:'Science',value:'17'},
        {label:'History',value:'23'},
        {label:'Geography',value:'22'},
        {label:"Sports",value:'21'},
        {label:'Music', value:'12'},
        { label: "Movies", value: "11" },
        { label: "Technology", value: "18" },
    ]

    const DIFFICULTIES=[
        {label: 'Easy',sub:'Warm up',id:1},
        {label:'Medium',sub:'Standard',id:2},
        {label:'hard',sub:'Competiive',id:3}
    ]
    const AMOUNT=[5,10,15,25];

    function toggleMixed(){
        setIsMixed(!isMixed);
        setSelectedCategories([""]);
    }

    function handleToggleCategory(value:string){
        if(!isMixed){
            setSelectedCategories([value])
            
            return;
        }
        if(selectedCategories.includes(value)){
            setSelectedCategories(selectedCategories.filter(c=>c!==value))
        }else{
            setSelectedCategories([...selectedCategories,value])
        }
    }
    const handleStartGame=async()=>{

    }

    return(
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <span className={styles.navLogo}>
                    ⚡ QuizArena
                </span>
                <button className={styles.backButton} onClick={()=>navigate("/dashboard")}>
                    <ArrowLeft size={14}/> Dashboard
                </button>
            </nav>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Host a game
                </h1>
                <p className={styles.subTitle}>
                    Set up your room. Others join with your code and you all play together.
                </p>
                 <div className={styles.twoCol}>

                    <div className={styles.settingsPanel}>
                        <p className={styles.sectionLabel}>Game Mode & Categories</p>
                        <div className={styles.mixedToggle}>
                            <button className={!isMixed ? styles.mixedActive : styles.mixedInactive}
                            onClick={toggleMixed}
                            >
                                Single Category
                            </button>
                            <button className={isMixed ? styles.mixedActive : styles.mixedInactive}
                            onClick={toggleMixed }
                            >
                                Mixed Mode
                            </button>
                        </div>
                        {!isMixed ?
                        (<div className={styles.pillRow}>
                            {CATEGORIES.map((c)=>(
                                <button
                                key={c.value}
                                className={category===c.label ? styles.pillActive :styles.pill}
                                onClick={()=>setCategory(c.label)}
                                // can add a disabled here later
                                >
                                {c.label}
                                </button>
                            ))}
                        </div>):
                        (<div className={styles.pillRow}>
                            {CATEGORIES.map((c)=>(
                                <button 
                                key={c.value}
                                className={selectedCategories.includes(c.value) ? styles.pillActive: styles.pill}
                                onClick={()=>handleToggleCategory(c.value)}
                                >
                                   {c.label} 
                                </button>
                            ))}

                        </div>
                            
                            )
                        }
                        <p className={styles.sectionLabel}>
                            Difficulty
                        </p>
                        <div className={styles.diffRow}>
                            {DIFFICULTIES.map((d)=>(
                                <div 
                                key={d.id}
                                className={difficulty===d.label? styles.diffCardActive : styles.diffCard}
                                onClick={()=> setDifficulty(d.label)
                                
                                }
                                >
                                    <p className={difficulty === d.label ? styles.diffTitleActive : styles.diffTitle}>
                                        {d.label}
                                    </p>
                                    <p className={difficulty==d.label ? styles.diffSubActive : styles.diffSub}>
                                        {d.sub}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className={styles.sectionLabel}>
                            Number of questions
                        </p>
                        <div className={styles.amountRow}>
                            {AMOUNT.map((a)=>(
                                <div key={a}
                                className={amount===a? styles.amountActive : styles.amount}
                                onClick={()=>setAmount(a)}
                                >
                                {a}
                                </div>
                            ))}
                        </div>

                        <div className={styles.settingsPanel}>
                            <button 
                                className={styles.primaryButton}
                                onClick={handleStartGame}
                                disabled={players.length<2 || creatingRoom}
                                >
                                {creatingRoom ? "Setting up room..." :"Start Game"}
                            </button>
                        </div>
                        
                    </div>

                    <div className={styles.rightPanel}>
                        <div className={styles.codeBox}>
                            <p className={styles.codeLabel}>Room code</p>
                            <p className={styles.codeValue}>
                                {roomCode || "------"}
                            </p>
                            <p className={styles.codeSub}>
                                {roomCode && "Share this with players"}
                            </p>
                        </div>

                        <div className={styles.lobbyPanel}>
                            <p className={styles.sectionLabel}>
                                Players in lobby({players.length})
                            </p>
                            <div className={styles.slotsGrid}>
                                {Array.from({length:5}).map((_,index)=>{
                                    const player=players[index];

                                    if(player){
                                        return(
                                            <div key={player.userId || index} className={styles.slotCardFilled}>
                                                <div className={styles.avatarCircle}>
                                                    {player.username?.charAt(0).toUpperCase() || "?"}
                                                    {player.isHost && <span className={styles.hostCrown}>👑</span>}
                                                </div>
                                                <div className={styles.playerInfo}>
                                                    <p className={styles.playerName}>{player.username}</p>
                                                    <p className={styles.playerElo}>{String(player.Elo)}ELO</p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return(
                                        <div key={`${index}`} className={styles.slotCardEmpty}>
                                            <div className={styles.emptyCircle}>
                                                +
                                            </div>
                                            <p className={styles.emptyText}>Waiting...</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                    </div>
                 </div>
            </div>
        </div>
    )
}




