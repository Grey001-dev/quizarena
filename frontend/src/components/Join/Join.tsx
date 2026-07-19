import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Join.module.css";
import { ArrowLeft } from "lucide-react";
import { handleRoomRequest } from "../../services/RoomServices";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [errMessage, setErrMessage] = useState("");

  const isFormValid = roomCode.length === 6;

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setErrMessage("");

    try {
      const data = await handleRoomRequest.joinRoom(roomCode);
      navigate("/host", {
        state: {
          roomCode: data.roomCode,
          isHost: false,
          user: data.user,
        },
      });
    } catch (error: any) {
      setErrMessage(error.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.navLogo}>⚡ QuizArena</span>
        <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} /> Dashboard
        </button>
      </nav>

      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Join a game</h1>
        <p className={styles.subTitle}>Enter the room code your host shared with you</p>

        {errMessage && <p className={styles.errorMessage}>{errMessage}</p>}

        <form className={styles.joinForm} onSubmit={handleJoin}>
          <div className={styles.codeRow}>
            <input
              type="text"
              maxLength={6}
              placeholder="012345"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className={styles.codeInput}
            />
          </div>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!isFormValid || loading}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}