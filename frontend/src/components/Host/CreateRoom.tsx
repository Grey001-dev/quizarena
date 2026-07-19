import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateRoom.module.css";
import { socket } from "../../services/socket";
import { ArrowLeft, CheckIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import AvatarDisplay from "../AvatarDisplay/AvatarDisplay";
import { getCategories } from "../../services/Load";

interface Player {
    socketId: string;
    username: string;
    userId: string;
    isHost: boolean;
    elo: number;
    avatar: string;
}

interface ToastState {
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
}

export default function HostPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [category, setCategory] = useState([]);
    const [difficulty, setDifficulty] = useState('Easy');
    const [amount, setAmount] = useState(10);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [loading, setLoading] = useState(false);
    const [roomCode, setRoomCode] = useState<string | null>(location.state?.roomCode || null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isMixed, setIsMixed] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [creatingRoom, setCreatingRoom] = useState(!location.state?.roomCode);
    const isHost = location.state?.isHost ?? false;

    const [toast, setToast] = useState<ToastState>({ show: false, type: 'info', message: '' });
    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: 'info', message: '' }), 4000);
    };

    const DIFFICULTIES = [
        { label: 'Easy', sub: 'Warm up', id: 1 },
        { label: 'Medium', sub: 'Standard', id: 2 },
        { label: 'Hard', sub: 'Competitive', id: 3 }
    ];
    const AMOUNT = [5, 10, 15, 25];

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getCategories();
            setCategory(result);
        };
        fetchCategories();
    }, []);

    function leaveLobby() {
        socket.emit("leave-lobby", {
            roomCode, userId: user.id
        });
        navigate("/dashboard");
    }

    useEffect(() => {
        if (!roomCode) return;
        
        setCreatingRoom(false);
        socket.emit("join-lobby", {
            roomCode,
            username: user.username,
            userId: user.id,
            avatar: user.avatarSeed,
            elo: user.elo,
            isHost
        }
    );

        socket.on("lobby-update", (updatedPlayers: Player[]) => {
            setPlayers(updatedPlayers);
        });

        socket.on("game-started", (data: { totalQuestions: number }) => {
            navigate(`/game/${roomCode}`, { state: { totalQuestions: data.totalQuestions } });
        })
        socket.on("host-left", () => {
            showNotification('error', "The host has left the lobby. Redirecting to Dashboard...");
            setTimeout(() => navigate("/dashboard"), 2500);
        });

        return () => {
            socket.off("lobby-update");
            socket.off("game-started");
            socket.off("host-left");
        };
    }, [roomCode, user?.username, user?.id, isHost, navigate]);

    function toggleMixed() {
        if (!isHost) return;
        setIsMixed(!isMixed);
        setSelectedCategories([]);
    }

    function handleToggleCategory(value: string) {
        if (!isMixed) {
            setSelectedCategories([]);
            return;
        }
        if (selectedCategories.includes(value)) {
            if (selectedCategories.length === 1) return;
            setSelectedCategories(selectedCategories.filter(c => c !== value));
        } else {
            setSelectedCategories([...selectedCategories, value]);
        }
    }

    const handleStartGame = async () => {
        if (!isHost) return;
        if (players.length < 2) {
            showNotification('info', "You need at least 2 players in the lobby to begin.");
            return;
        }

        setCreatingRoom(true);
        socket.emit("start-game", {
            roomCode,
            category: selectedCategories,
            difficulty: difficulty.toLowerCase(),
            amount,
            timeLimit: 10
        });
    };

    return (
        <div className={styles.page}>
            {toast.show && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>
                    {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    <span className={styles.toastMessage}>{toast.message}</span>
                </div>
            )}

            <nav className={styles.navbar}>
                <span className={styles.navLogo}>⚡ QuizArena</span>
                <button className={styles.backButton} onClick={leaveLobby}>
                    <ArrowLeft size={14} /> Dashboard
                </button>
            </nav>

            <div className={styles.content}>
                <h1 className={styles.title}>Host a game</h1>
                <p className={styles.subTitle}>
                    Set up your room. Others join with your code and you all play together.
                </p>
                
                <div className={styles.twoCol}>
                    <div className={styles.settingsPanel}>
                        <p className={styles.sectionLabel}>Game Mode & Categories</p>
                        <div className={styles.mixedToggle}>
                            <button 
                                className={!isMixed ? styles.mixedActive : styles.mixedInactive}
                                onClick={toggleMixed}
                                disabled={!isHost}
                            >
                                Single Category
                            </button>
                            <button 
                                className={isMixed ? styles.mixedActive : styles.mixedInactive}
                                onClick={toggleMixed}
                                disabled={!isHost}
                            >
                                Mixed Mode
                            </button>
                        </div>

                        <div className={styles.pillRow}>
                            {category.map((c: any) => {
                                const isActive = selectedCategories.includes(c.id);
                                return (
                                    <button
                                        key={c.id}
                                        className={isActive ? styles.pillActive : styles.pill}
                                        onClick={() => isMixed ? handleToggleCategory(c.id) : isHost && setSelectedCategories([c.id])}
                                        disabled={!isHost}
                                    >
                                        {isActive && <span><CheckIcon size={14} /></span>}
                                        {c.name}
                                    </button>
                                );
                            })}
                        </div>
         
                        <p className={styles.sectionLabel}>Difficulty</p>
                        <div className={styles.diffRow}>
                            {DIFFICULTIES.map((d) => (
                                <div 
                                    key={d.id}
                                    className={difficulty === d.label ? styles.diffCardActive : styles.diffCard}
                                    onClick={() => isHost && setDifficulty(d.label)}
                                >
                                    <p className={difficulty === d.label ? styles.diffTitleActive : styles.diffTitle}>
                                        {d.label}
                                    </p>
                                    <p className={difficulty === d.label ? styles.diffSubActive : styles.diffSub}>
                                        {d.sub}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className={styles.sectionLabel}>Number of questions</p>
                        <div className={styles.amountRow}>
                            {AMOUNT.map((a) => (
                                <div 
                                    key={a}
                                    className={amount === a ? styles.amountActive : styles.amount}
                                    onClick={() => isHost && setAmount(a)}
                                >
                                    {a}
                                </div>
                            ))}
                        </div>

                        <div className={styles.actionWrapper}>
                            <button 
                                className={styles.primaryButton}
                                onClick={handleStartGame}
                                disabled={players.length < 2 || creatingRoom}
                            >
                                {creatingRoom ? "Setting up room..." : "Start Game"}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rightPanel}>
                        <div className={styles.codeBox}>
                            <p className={styles.codeLabel}>Room code</p>
                            <p className={styles.codeValue}>{roomCode || "------"}</p>
                            <p className={styles.codeSub}>{roomCode && "Share this with players"}</p>
                        </div>

                        <div className={styles.lobbyPanel}>
                            <p className={styles.sectionLabel}>Players in lobby ({players.length})</p>
                            <div className={styles.slotsGrid}>
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const player = players[index];
                                    if (player) {
                                        return (
                                            <div key={player.userId || index} className={styles.slotCardFilled}>
                                                <div className={styles.avatarCircle}>
                                                    <AvatarDisplay seed={player.avatar} size={44} />
                                                    {player.isHost && <span className={styles.hostCrown}>👑</span>}
                                                </div>
                                                <div className={styles.playerInfo}>
                                                    <p className={styles.playerName}>{player.username}</p>
                                                    <p className={styles.playerElo}>{String(player.elo)} ELO</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={`empty-${index}`} className={styles.slotCardEmpty}>
                                            <div className={styles.emptyCircle}>+</div>
                                            <p className={styles.emptyText}>Waiting...</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}