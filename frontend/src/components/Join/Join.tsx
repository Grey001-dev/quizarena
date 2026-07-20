import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Join.module.css";
import { ArrowLeft, Brain } from "lucide-react";
import { handleRoomRequest } from "../../services/RoomServices";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [errMessage, setErrMessage] = useState("");

  const isFormValid = roomCode.trim().length === 6;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setRoomCode(value);
    }
  };

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || loading) return;

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
        <div className={styles.navLogo}>
          <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
          <span>QuizArena</span>
        </div>
        <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={14} /> Dashboard
        </button>
      </nav>

      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Join a game</h1>
        <p className={styles.subTitle}>Enter the 6-character room code shared by your host</p>

        {errMessage && <div className={styles.errorMessage}>{errMessage}</div>}

        <form className={styles.joinForm} onSubmit={handleJoin}>
          <div className={styles.codeRow}>
            <input
              type="text"
              maxLength={6}
              placeholder="012345"
              value={roomCode}
              onChange={handleInputChange}
              className={styles.codeInput}
              autoFocus
              spellCheck={false}
              autoComplete="off"
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