import React from "react";
import { useState ,useEffect, type ReactEventHandler} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SoloPage.module.css";
import { ArrowLeft, CheckIcon } from 'lucide-react';
import { handleRoomRequest } from "../../services/RoomServices";
import { loadQuestion,sendAnswer,getCategories} from "../../services/Load";


export default function SoloPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [amount, setAmount] = useState(10);
  const [datas,setDatas]=useState<any>()
  const [loading, setLoading] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion,setQuestion] = useState<any>(null);
  const [answer,setAnswer]=useState<string |null>("")
  const [message, setMessage] = useState("");
  const [roomId,setRoomId]=useState<string>("");


  const Difficulties = [
    { label: "Easy", sub: "Warm Up", id: 1 },
    { label: "Medium", sub: "Standard", id: 2 },
    { label: "Hard", sub: "Competitive", id: 3 }
  ];
  const AMOUNTS = [5, 10, 15, 20];
  const options=["A","B","C","D"];

  useEffect(()=>{
    const fetchCategories=async ()=>{
        setCategory(await getCategories())
    }
    fetchCategories()
  },[])

  const handleChoiceSubmit= async (option:string)=>{
    if(!roomId) return
    try {
      setAnswer(option);
      console.log(option);
      const data=await sendAnswer(option,roomId);
      console.log(data)
      if(data.gameOver){
        alert(data.score)
        setScore(data.score)
        setMessage(`Game Session is over`);
        setGameStarted(false)
        console.log(score)
        return;
      }
      await loadQuestionSha(roomId)
      setAnswer(null)
    } catch (error) {
     setMessage("Failed to send answer to backend"); 
    }
  }

  const handleSoloStart=async()=>{
    try{
        const data=await handleRoomRequest.soloRequest({
        category:selectedCategories,
        difficulty:difficulty,
        amount:amount
      });
      if(data && data.roomId){
        setRoomId(data.roomId)
        console.log(roomId)
        await loadQuestionSha(data.roomId)
        setGameStarted(true)
      }else{
        setMessage("Failed to retreuev a valid room ID from the server");
      }
    } catch (error) {
      console.error("Failed to start solo game:",error);
      setMessage("Failed to create game session")
    }finally{
      setLoading(false)
    }
  }

  const loadQuestionSha=async(targetRoomId:string)=>{
    setLoading(true)
    try {
      if(!targetRoomId || targetRoomId===''){
        return
      }
      const data=await loadQuestion(targetRoomId);
      setQuestion(data.question)
      console.log(data.question)
    }catch (error) {
     console.log("Error loading question:",error) 
    }finally{
      setLoading(false)
    }
  }

  function toggleMixed() {
    setIsMixed(!isMixed);
  }

  function handleToggleCategory(value: string) {
    if (!isMixed) {
      setSelectedCategories([value]);
      return;
    }
    if (selectedCategories.includes(value)) {
      if (selectedCategories.length == 1) return;
      setSelectedCategories(selectedCategories.filter(c => c !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  }

  return (
    <div className={styles.page}>
      {!gameStarted ? (
        /* SETUP MODE VIEW */
        <>
          <nav className={styles.navbar}>
            <span className={styles.navLogo}>⚡ QuizArena</span>
            <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={14} /> Dashboard
            </button>
          </nav>

          <div className={styles.content}>
            <h1 className={styles.title}>Solo play</h1>
            <p className={styles.subTitle}>Pick your settings and go. Just you against the clock</p>
            {message && <p className={styles.messageText}>{message}</p>}

            <p className={styles.sectionLabel}>Game Mode & Categories</p>
            <div className={styles.mixedToggle}>
              <button
                className={!isMixed ? styles.mixedActive : styles.mixedInactive}
                onClick={toggleMixed}
              >
                Single Category
              </button>
              <button
                className={isMixed ? styles.mixedActive : styles.mixedInactive}
                onClick={toggleMixed}
              >
                Mixed Mode
              </button>
            </div>

            {isMixed ? (
              <div className={styles.pillRow}>
                {category.map((c) => {
                  const isActive = selectedCategories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className={isActive ? styles.pillActive : styles.pill}
                      onClick={() => handleToggleCategory(c.id)}
                    >
                      {isActive && <span><CheckIcon size={14} /></span>}
                      {c.id}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={styles.pillRow}>
                {category.map((c) => {
                  const isActive = selectedCategories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className={isActive ? styles.pillActive : styles.pill}
                      onClick={() => setSelectedCategories([c.id])}
                    >
                      {isActive && <span><CheckIcon size={14} /></span>}
                      {c.id}
                    </button>
                  );
                })}
              </div>
            )}

            <p className={styles.sectionLabel}>Difficulty</p>
            <div className={styles.diffRow}>
              {Difficulties.map((d) => (
                <div
                  key={d.id}
                  className={difficulty === d.label.toLowerCase() ? styles.diffCardActive : styles.diffCard}
                  onClick={() => setDifficulty(d.label.toLowerCase())}
                >
                  <p className={difficulty === d.label.toLowerCase() ? styles.diffTitleActive : styles.diffTitle}>
                    {d.label}
                  </p>
                  <p className={difficulty === d.label.toLowerCase() ? styles.diffSubActive : styles.diffSub}>
                    {d.sub}
                  </p>
                </div>
              ))}
            </div>

            <p className={styles.sectionLabel}>Number of questions</p>
            <div className={styles.amountRow}>
              {AMOUNTS.map((a) => (
                <div
                  key={a}
                  className={amount === a ? styles.amountActive : styles.amount}
                  onClick={() => setAmount(a)}
                >
                  {a}
                </div>
              ))}
            </div>

            <button
              className={styles.startButton}
              onClick={handleSoloStart}
              disabled={loading}
            >
              {loading ? "Starting..." : "Start"}
            </button>
          </div>
        </>
      ) : (
        /* LIVE GAME ARENA VIEW (Matches Your Mockup Image) */
        <>
          <nav className={styles.navbar}>
            <span className={styles.navLogo}>
                ⚡ QuizArena
            </span>
            <button className={styles.backButton} onClick={()=>setGameStarted(false)}>
                <ArrowLeft size={14}/>Quit Game
            </button>
          </nav>
          <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <span className={styles.progressText}>
                    Question 4 of 10
                </span>
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill}/>    
                </div>
                <div className={styles.timerBadge}>
                    <span className={styles.timerNumber}>
                        7
                    </span>
                    <span className={styles.timerLabel}>
                        seconds
                    </span>
                </div>
            </div>

            <div className={styles.questionCard}>
                <p className={styles.questionCategory}>{currentQuestion.category}</p>
                <h2 className={styles.questionText}>{currentQuestion.text}</h2>
            </div>
            <div className={styles.optionsGrid}>
              {currentQuestion?.options?.map((option :string,index:number)=>{
              const optionLetter=String.fromCharCode(65+index)
              const isSelected=answer===option
              return(
                  <button className={isSelected ?styles.optionButtonActive :styles.optionButton} 
                  key={index} 
                  onClick={()=>handleChoiceSubmit(option)} >
                      <div className={styles.optionLetter}>
                          {optionLetter}
                      </div>
                      <span className={styles.optionValue}>
                          {option}
                      </span>
                  </button>
              )
            })}
                {/* <div className={styles.stadingsCard}>
                    <p className={styles.standingsLabel}>
                        LIVE STANDING
                    </p>
                    <div className={styles.standingsRow}>
                        <span>1 &nbsp; &nbsp; Grey</span>
                        <span className={styles.standingsScore}>2840</span>
                    </div>

                    <div className={`${styles.standingsRow} ${styles.standingsUserActive}`}>
                        <span>2 &nbsp; &nbsp; You</span>
                        <span className={styles.standingsScore}>2610</span>
                    </div>
                    <div className={styles.standingsRow}>
                        <span> 3 &nbsp; &nbsp;TurboAce</span>
                        <span className={styles.standingsScore}>2100</span>
                    </div>

                </div> */}
            </div>

          </div>
        </>
      )}
    </div>
  );
}