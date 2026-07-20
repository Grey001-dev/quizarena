import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, LogOut, Trophy, Target, Radio, LogIn, Brain } from "lucide-react";
import { handleRoomRequest } from "../../services/RoomServices.ts";
import styles from "./userDashboard.module.css";

interface RecentGame {
  category: string;
  difficulty: string;
  solo: boolean;
  score: number;
  eloChange: number;
  rank: number | null;
  playedAt: string;
}

interface Stats {
  gamesPlayed: number;
  winRate: number;
  bestRank: number | null;
  recentGames: RecentGame[];
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [elo, setElo] = useState<number>(user?.elo || 1000);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<Stats>({
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

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://quizarena-br8y.onrender.com/api/user/stats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          if (data.elo) setElo(data.elo);
        }
      } catch (err) {
        console.error("Failed to load user stats", err);
      }
    };
    fetchUserStats();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const handleCodeGen = async () => {
    setMessage("");
    try {
      const data = await handleRoomRequest.createRoom();
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
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to create room");
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
          <span>QuizArena</span>
        </div>
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
        <Target size={20} strokeWidth={2.5} color="#1d4ed8" /> 
      
            </div>
            <h2 className={styles.modeTitle}>Solo play</h2>
            <p className={styles.modeDesc}>Play alone. Pick a category and sharpen your skills.</p>
          </div>

          <div className={`${styles.modeCard} ${styles.modeCardFilled}`} onClick={handleCodeGen}>
            <div className={styles.modeIconFilled}>
          <Radio size={20} strokeWidth={2.5} color="#ffffff" />
            </div>
            <h2 className={styles.modeTitleWhite}>Host a game</h2>
            <p className={styles.modeDescWhite}>
          Create a live room, share a code, and control the match.
            </p>
          </div>

          <div className={styles.modeCard} onClick={() => navigate("/join")}>
            <div className={styles.modeIcon}>
              <LogIn size={20} strokeWidth={2.5} color="#1d4ed8" />
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
                <p className={styles.statNumber}>{stats.gamesPlayed}</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Win rate</p>
                <p className={styles.statNumber}>{stats.winRate}%</p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Best rank</p>
                <p className={styles.statNumber}>{stats.bestRank ? `#${stats.bestRank}` : "--"}</p>
              </div>
            </div>
          </div> 
        </div> 
      </div>
    </div>
  );
}