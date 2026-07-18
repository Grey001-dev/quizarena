import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../services/socket";
import styles from "./GamePage.module.css";

interface Question {
  text: string;
  category: string;
  options: string[];
}

interface Standing {
  userId: string;
  username: string;
  score: number;
}

interface FinalResult extends Standing {
  eloChange?: number;
}

export default function GamePage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState({ answered: 0, total: 0 });

  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [finalResults, setFinalResults] = useState<FinalResult[]>([]);

  useEffect(() => {
    socket.on("question-start", (data) => {
      setQuestion({
        text: data.question.text,
        category: data.question.category,
        options: data.question.options,
      });
      setQuestionNumber(data.gameNumber + 1);
      setTimeLimit(data.timeLimit);
      setTimeLeft(data.timeLimit);
      setSelectedAnswer(null);
      setShowResults(false);
      setCorrectAnswer(null);
      setAnsweredCount({ answered: 0, total: 0 });
    });

    socket.on("player-answered", (data) => {
      setAnsweredCount({ answered: data.totalAnswered, total: data.totalPlayers });
    });

    socket.on("question-end", (data) => {
      setCorrectAnswer(data.correctAnswer);
      setStandings(data.leadearBoard);
      setShowResults(true);
    });

    socket.on("game-over", (data) => {
      setFinalResults(data.finalResult);
      setGameOver(true);
    });

    return () => {
      socket.off("question-start");
      socket.off("player-answered");
      socket.off("question-end");
      socket.off("game-over");
    };
  }, []);

  useEffect(() => {
    if (showResults || gameOver || !question) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showResults, gameOver, question]);

  function handleAnswer(option: string) {
    if (selectedAnswer || showResults) return;
    setSelectedAnswer(option);
    socket.emit("submit-answers", {
      roomCode,
      userId: user.id,
      answer: option,
    });
  }

  if (gameOver) {
    const winner = finalResults[0];
    const podium = finalResults.slice(0, 3);
    const you = finalResults.find(r => r.userId === user.id);

    return (
      <div className={styles.page}>
        <div className={styles.resultsWrap}>
          <div className={styles.confetti} />

          {winner && (
            <>
              <p className={styles.winnerCrown}>🏆</p>
              <p className={styles.winnerLabel}>Winner</p>
              <p className={styles.winnerName}>{winner.username}</p>
              <p className={styles.winnerScore}>{winner.score} points</p>
            </>
          )}

          {podium.length > 1 && (
            <div className={styles.podium}>
              {podium[1] && (
                <div className={`${styles.podiumItem} ${styles.podium2}`}>
                  <span className={styles.podiumRank}>🥈</span>
                  <div className={styles.podiumAvatar}>
                    {podium[1].username.charAt(0).toUpperCase()}
                  </div>
                  <p className={styles.podiumName}>{podium[1].username}</p>
                  <div className={styles.podiumBar} />
                </div>
              )}
              {podium[0] && (
                <div className={`${styles.podiumItem} ${styles.podium1}`}>
                  <span className={styles.podiumRank}>🥇</span>
                  <div className={styles.podiumAvatar}>
                    {podium[0].username.charAt(0).toUpperCase()}
                  </div>
                  <p className={styles.podiumName}>{podium[0].username}</p>
                  <div className={styles.podiumBar} />
                </div>
              )}
              {podium[2] && (
                <div className={`${styles.podiumItem} ${styles.podium3}`}>
                  <span className={styles.podiumRank}>🥉</span>
                  <div className={styles.podiumAvatar}>
                    {podium[2].username.charAt(0).toUpperCase()}
                  </div>
                  <p className={styles.podiumName}>{podium[2].username}</p>
                  <div className={styles.podiumBar} />
                </div>
              )}
            </div>
          )}

          <div className={styles.fullboard}>
            {finalResults.map((r, i) => (
              <div key={r.userId} className={styles.boardRow}>
                <div className={styles.boardLeft}>
                  <span className={styles.boardRank}>{i + 1}</span>
                  <div className={styles.boardAvatar}>
                    {r.username.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.boardName}>
                    {r.userId === user.id ? "You" : r.username}
                  </span>
                </div>
                <div>
                  <span className={styles.boardScore}>{r.score}</span>
                  {r.eloChange !== undefined && (
                    <span className={r.eloChange >= 0 ? styles.eloUp : styles.eloDown}>
                      {r.eloChange >= 0 ? `+${r.eloChange}` : r.eloChange}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <button className={styles.ctaPrimary} onClick={() => navigate("/dashboard")}>
              Play again
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <p>Waiting for the first question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.progress}>
          <span className={styles.progressText}>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={styles.answeredBadge}>
            {answeredCount.answered}/{answeredCount.total} answered
          </span>
        </div>
        <div className={styles.timer}>
          <span className={styles.timerNum}>{timeLeft}</span>
          <span className={styles.timerLabel}>sec</span>
        </div>
      </div>

      <div className={styles.qcard}>
        <p className={styles.qcat}>{question.category}</p>
        <h2 className={styles.qtext}>{question.text}</h2>
      </div>

      <div className={styles.answers}>
        {question.options.map((option, index) => {
          let className = styles.ans;

          if (showResults) {
            if (option === correctAnswer) className = `${styles.ans} ${styles.ansCorrect}`;
            else if (option === selectedAnswer) className = `${styles.ans} ${styles.ansWrong}`;
            else className = `${styles.ans} ${styles.ansDisabled}`;
          } else if (option === selectedAnswer) {
            className = `${styles.ans} ${styles.ansSelected}`;
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer || showResults}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResults && (
        <div className={styles.standingsPanel}>
          <p className={styles.standingsLabel}>Live standings</p>
          {standings.map((s, i) => (
            <div key={s.userId} className={styles.standingRow}>
              <span>
                #{i + 1} {s.userId === user.id ? "You" : s.username}
              </span>
              <span className={styles.standingScore}>{s.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}