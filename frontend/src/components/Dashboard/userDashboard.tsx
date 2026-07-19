import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, LogOut,Trophy } from "lucide-react";
import { generateCode } from "../../services/RoomCode.ts";
import { handleRoomRequest } from "../../services/RoomServices.ts";
import styles from "./userDashboard.module.css";
import AvatarDisplay from "../AvatarDisplay/AvatarDisplay.tsx";

export default function Dashboard() {
  
  const user=JSON.parse(localStorage.getItem("user")|| "{}");
  const [elo,setElo]=useState(user?.elo)
  const [message, setMessage] = useState("");
  const [avatar,setAvatar]=useState(user?.avatarSeed)
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    winRate: 0,
    bestRank: null,
    recentGames: [],
  });
  const navigate = useNavigate();

  function greetings() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour >= 17) return "Good evening";
    return "Good afternoon";
  }

  useEffect(()=>{
    const fetchUserStats=async()=>{
      const token=localStorage.getItem("token")
      const res=await fetch("https://quizarena-br8y.onrender.com/api/user/stats",{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      });
      const data=await res.json();
      setStats(data)
    }
    fetchUserStats()
  },[])

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const handleCodeGen = async () => {
    setMessage("");
    try {
      const data = await handleRoomRequest.createRoom();
      console.log(data);
      if (data.roomCode) {
        navigate("/host", {
          state: {
            roomCode: data.roomCode,
            user: data.user,
            isHost: true,
          },
        });
      } else {
        setMessage("Couldn't generate room code");
        console.log("Couldn't generate room code");
      }
    } catch (err: any) {
      setMessage(err.message);
      console.log(err);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.navLogo}>⚡ QuizArena</span>
        <div className={styles.navRight}>
          <span className={styles.navElo}>
            ELO <strong>{elo}</strong>
          </span>
          <button 
            className={styles.settingsIcon} 
            onClick={() => navigate("/settings")}
            title="Account Settings"
          >
            <UserCog size={18} />
          </button>
         <button className={styles.leaderboardButton} onClick={() => navigate("/leaderboard")}>
            <Trophy size={14} strokeWidth={2.5} />
            <span>Leaderboard</span>
          </button>

          <div className={styles.divider}></div>
          <button className={styles.logoutButton} onClick={logout} title="Sign Out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className={styles.content}>
        {message && <p className={styles.systemMessage}>{message}</p>}
        <p className={styles.greeting}>{greetings()}</p>
        <h1 className={styles.title}>What do you want to do?</h1>

        <div className={styles.modeGrid}>
          <div className={styles.modeCard} onClick={() => navigate("/solo")}>
            <div className={styles.modeIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h2 className={styles.modeTitle}>Solo play</h2>
            <p className={styles.modeDesc}>Play alone. Pick a category and sharpen your skills.</p>
          </div>

          <div className={`${styles.modeCard} ${styles.modeCardFilled}`} onClick={handleCodeGen}>
            <div className={styles.modeIconFilled}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                <path d="M5 20h14a1 1 0 0 0 1-1v-1H4v1a1 1 0 0 0 1 1z" />
              </svg>
            </div>
            <h2 className={styles.modeTitleWhite}>Host a game</h2>
            <p className={styles.modeDescWhite}>
              Create a live room, share a code, and control the match.
            </p>
          </div>

          <div className={styles.modeCard} onClick={() => navigate("/join")}>
            <div className={styles.modeIcon}>
              {/* I added an icon for each game mode btw...this long strings */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2 className={styles.modeTitle}>Join a game</h2>
            <p className={styles.modeDesc}>Got an arena invite code? Hop directly into the action.</p>
          </div>
        </div>

        <div className={styles.bottomGrid}>
          <div className={styles.panel}>
            <p className={styles.panelLabel}>Recent games</p>

            {stats.recentGames.length === 0 ? (
              <p className={styles.emptyText}>No games played yet</p>
            ) : (
              stats.recentGames.map((game, i) => (
                <div key={i} className={styles.gameRow}>
                  <div className={styles.gameLeft}>
                    <span className={styles.gameDot} />
                    <div>
                      <p className={styles.gameName}>
                        {game.category} · {game.difficulty}
                      </p>
                      <p className={styles.gameMeta}>
                        {game.solo ? "Solo" : "Multiplayer"} · {new Date(game.playedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {game.solo ? (
                    <span className={styles.eloBadgeGray}>Solo</span>
                  ) : (
                    <span className={game.eloChange >= 0 ? styles.eloBadgeBlue : styles.eloBadgeRed}>
                      {game.eloChange >= 0 ? `+${game.eloChange}` : game.eloChange} ELO
                    </span>
                  )}
                </div>
              ))
            )}
          </div> {/* <--- FIX: This closes the Recent Games panel cleanly */}

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Your stats</p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>ELO rating</p>
                <p className={styles.statNumber}>{elo}</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Games played</p>
                <p className={styles.statNumber}>{stats.gamesPlayed}</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Win rate</p>
                <p className={styles.statNumber}>{stats.winRate}</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Best rank</p>
                <p className={styles.statNumber}>#{stats.bestRank}</p>
              </div>
            </div>
          </div> 
        </div> 
      </div>
    </div>
  );
}