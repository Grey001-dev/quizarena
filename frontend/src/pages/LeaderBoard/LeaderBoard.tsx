import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarDisplay from "../../components/AvatarDisplay/AvatarDisplay";
import { ArrowLeft, Trophy, Brain } from "lucide-react";
import styles from "./LeaderBoard.module.css";

interface LeaderBoard {
    id: string;
    username: string;
    elo: number;
    avatarSeed: string;
}
// This was kinda rushed....but i had to create a leaderboard just fechting the top 20 highest elo from my db??
export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<LeaderBoard[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("https://quizarena-br8y.onrender.com/api/user/leaderboard", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setUsers(data);
            } catch (error: any) {
                console.log(error.message);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.navLogo}>
                    <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
                    <span>QuizArena</span>
                </div>
                <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={14} /> <span>Dashboard</span>
                </button>
            </nav>

            <div className={styles.content}>
                <div className={styles.headerGroup}>
                    <div>
                        <p className={styles.categoryLabel}>Global Rankings</p>
                        <h1 className={styles.title}>Leaderboard</h1>
                        <p className={styles.subtitle}>Top competitive players ranked by ELO rating</p>
                    </div>
                    <div className={styles.trophyIconWrapper}>
                        <Trophy size={28} color="#2563eb" />
                    </div>
                </div>

                <div className={styles.list}>
                    {users.map((user, index) => (
                        <div key={user.id} className={user.id === currentUser.id ? styles.rowActive : styles.row}>
                            <span className={styles.rank}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                            </span>
                            <AvatarDisplay seed={user.avatarSeed} size={38} />
                            <div className={styles.userInfo}>
                                <span className={styles.username}>
                                    {user.username}
                                </span>
                                {user.id === currentUser.id && <span className={styles.youBadge}>You</span>}
                            </div>
                            <span className={styles.elo}>{user.elo} <span className={styles.eloLabel}>ELO</span></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}