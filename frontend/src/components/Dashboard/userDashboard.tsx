import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserCog  } from "lucide-react";
import { generateCode } from "../../services/RoomCode.ts";
import styles from "./userDashboard.module.css";

export default function Dashboard() {
  const [elo] = useState(1000);
  const [roomCode,setRoomCode]=useState("");
  const [message,setMessage]=useState("")
  const navigate = useNavigate();

  function greetings() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour >= 17) return "Good evening";
    return "Good afternoon";
  }
  function logout(){
    localStorage.removeItem("token")
    navigate("/login")
  }
  const handleCodeGen=async ()=>{
    setMessage("")
    try {
      const data=await generateCode();
      console.log(data)
      if(data.roomCode){
        navigate("/host",{state:data.roomCode})
        setMessage(data.message)
      }
      else{
        setMessage("Couldnt generate roomcode")
        console.log("Couldnt generate roomcode")
      }
    } catch (err:any) {
      setMessage(err.message)
      console.log(err)
    }
  }

  return (
    <div className={styles.page}>

      <nav className={styles.navbar}>
        <span className={styles.navLogo}>⚡ QuizArena</span>
        <div className={styles.navRight}>
          <span className={styles.navElo}>
            ELO <strong>{elo}</strong>
          </span>
          <button className={styles.settingsIcon} onClick={()=>navigate("/settings")}><UserCog  size={16}/></button>
          <div className={styles.navAvatar}onClick={()=>navigate("/settings")} />
          <div>
            <button onClick={()=>logout()}>
                Logout
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.content}>

       
        <p className={styles.greeting}>{greetings()}</p>
        <h1 className={styles.title}>What do you want to do?</h1>

        <div className={styles.modeGrid}>

          <div className={styles.modeCard} onClick={() => navigate("/solo")}>
            <div className={styles.modeIcon} />
            <h2 className={styles.modeTitle}>Solo play</h2>
            <p className={styles.modeDesc}>Play alone. Pick a category and go.</p>
          </div>

          <div
            className={`${styles.modeCard} ${styles.modeCardFilled}`}
            onClick={handleCodeGen}
          >
            <div className={styles.modeIconFilled} />
            <h2 className={styles.modeTitleWhite}>Host a game</h2>
            <p className={styles.modeDescWhite}>
              Create a room, share a code, play with others.
            </p>
          </div>

          <div className={styles.modeCard} onClick={() => navigate("/join")}>
            <div className={styles.modeIcon} />
            <h2 className={styles.modeTitle}>Join a game</h2>
            <p className={styles.modeDesc}>Enter a room code and jump in.</p>
          </div>

        </div>

        <div className={styles.bottomGrid}>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Recent games</p>

            <div className={styles.gameRow}>
              <div className={styles.gameLeft}>
                <span className={styles.gameDot} />
                <div>
                  <p className={styles.gameName}>Science · Medium</p>
                  <p className={styles.gameMeta}>3 players · 2h ago</p>
                </div>
              </div>
              <span className={styles.eloBadgeBlue}>+18 ELO</span>
            </div>

            <div className={styles.gameRow}>
              <div className={styles.gameLeft}>
                <span className={styles.gameDot} />
                <div>
                  <p className={styles.gameName}>History · Easy</p>
                  <p className={styles.gameMeta}>Solo · yesterday</p>
                </div>
              </div>
              <span className={styles.eloBadgeGray}>Solo</span>
            </div>

            <div className={styles.gameRow}>
              <div className={styles.gameLeft}>
                <span className={styles.gameDot} />
                <div>
                  <p className={styles.gameName}>Geography · Hard</p>
                  <p className={styles.gameMeta}>5 players · 2d ago</p>
                </div>
              </div>
              <span className={styles.eloBadgeRed}>-12 ELO</span>
            </div>

          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Your stats</p>
            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>ELO rating</p>
                <p className={styles.statNumber}>{elo}</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Games played</p>
                <p className={styles.statNumber}>34</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Win rate</p>
                <p className={styles.statNumber}>57%</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Best rank</p>
                <p className={styles.statNumber}>#1</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}