import React from "react";
import { useState ,useEffect, type ReactEventHandler} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SoloPage.module.css";
import { ArrowLeft, CheckIcon, Brain } from 'lucide-react';
import { handleRoomRequest } from "../../services/RoomServices";
import { loadQuestion,sendAnswer,getCategories} from "../../services/Load";

interface feedback{
  isCorrect:boolean;
  correctAnswer:string;
}

export default function SoloPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<{id: string, name: string}[]>([]);
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
  const [feedback, setFeedback] = useState<feedback| null>(null);
  const [currenIndex,setCurrentIndex]=useState(0)
  const [totalQuestion,setTotalQuestion]=useState(amount)
  const [gameOver,setGameOver]=useState(false);
  const [finalScore,setFinalScore]=useState(0);
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
        let result=await getCategories()
        console.log(result)

    }
    fetchCategories()
  },[])

  const handleChoiceSubmit= async (option:string)=>{
    if(!roomId || feedback) return
    try {
      setAnswer(option);
      console.log(option);
      const data=await sendAnswer(option,roomId);
      console.log(data)
      setFeedback({
        isCorrect:data.isCorrect,
        correctAnswer:data.correctAnswer
      })
      setTimeout(async()=>{
         if(data.gameOver){
          setFinalScore(data.score)
          setGameOver(true)
          setScore(data.score)
          setMessage(`Game Session is over`);
          setGameStarted(false)
          console.log(score)
          return;
      }
      await loadQuestionSha(roomId)
      setAnswer(null)
      setFeedback(null)
      },2000)

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
        await loadQuestionSha(data.roomId)
        setRoomId(data.roomId)
        console.log(roomId)
        setFeedback(null)
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
      setTotalQuestion(data.totalQuestions)
      setCurrentIndex(parseInt(data.currentIndex))
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
      setSelectedCategories([]);
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
      {gameOver ? (
        <>
          <nav className={styles.navbar}>
            <div className={styles.navLogo}>
              <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
              <span>QuizArena</span>
            </div>
            <button className={styles.backButton} onClick={()=>navigate("/dashboard")}>
                <ArrowLeft size={14}/> Dashboard
            </button>
          </nav>

          <div className={styles.resultsContent}>
            <div className={styles.resultsCard}>
                <p className={styles.resultsEmoji}>
                  {finalScore>= totalQuestion * 0.7 ? "🏆" : finalScore>=totalQuestion * 0.4 ? "🎯" : "📚"}
                </p>
                <p className={styles.resultsLabel}>Game Complete</p>
                <p className={styles.resultsScore}>{finalScore} <span className={styles.resultsOutOf}>/{totalQuestion}</span></p>
                <p className={styles.resultsSub}>
                  {finalScore ===totalQuestion ?
                  "Perfect score! Incredible"
                  : finalScore>=totalQuestion *0.7
                  ? "Great job,you crushed it"
                  : finalScore>= totalQuestion *0.4
                  ? "Solid effort,keep practicing,"
                  : "Keep going,you'll get better"
                  }
                </p>

                <div className={styles.resultsStats}>
                  <div className={styles.resultsStatDiv}>
                      <p className={styles.resultsStatValue}>{finalScore}</p>
                      <p className={styles.resultsStatLabel}>Correct</p>
                  </div>
                  <div className={styles.resultsStatDiv}>
                      <p className={styles.resultsStatValue}>{totalQuestion-finalScore}</p>
                      <p className={styles.resultsStatLabel}>Wrong</p>
                  </div>
                  <div className={styles.resultsStatDiv}>
                    <p className={styles.resultsStatValue}>
                      {Math.round((finalScore/totalQuestion ) *100)}%
                    </p>
                    <p className={styles.resultsStatLabel}>Accuracy</p>
                  </div>
                </div>
                <div className={styles.resultsButton}>
                    <button 
                    className={styles.resultsButton}
                    onClick={()=>{setGameOver(false); setCurrentIndex(0); setScore(0)}}
                    >
                      Play again
                    </button>
                </div>
            </div>
          </div>
        </>
      ):
      !gameStarted ? (
        <>
          <nav className={styles.navbar}>
            <div className={styles.navLogo}>
              <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
              <span>QuizArena</span>
            </div>
            <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={14} /> Dashboard
            </button>
          </nav>

          <div className={styles.content}>
            <h1 className={styles.title}>Solo play</h1>
            <p className={styles.subTitle}>Pick your settings and go. Just you against yourself</p>
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
                      {c.name}
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
                      {c.name}
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
        <>
          <nav className={styles.navbar}>
            <div className={styles.navLogo}>
              <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
              <span>QuizArena</span>
            </div>
            <button className={styles.backButton} onClick={()=>setGameStarted(false)}>
                <ArrowLeft size={14}/>Quit Game
            </button>
          </nav>
          <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <span className={styles.progressText}>
                    {`Question ${currenIndex +1} of ${totalQuestion}`}
                </span>
            </div>

            <div className={styles.questionCard}>
                <p className={styles.questionCategory}>{currentQuestion?.category}</p>
                <h2 className={styles.questionText}>{currentQuestion?.text}</h2>
            </div>
            <div className={styles.optionsGrid}>
              {currentQuestion?.options?.map((option :string,index:number)=>{
              const optionLetter=String.fromCharCode(65+index)
              const isSelected=answer===option
              let buttonClass=styles.optionButton
              if(answer===option && !feedback){
                buttonClass=styles.optionButtonActive;
              }
              if(feedback){
                if(option===feedback.correctAnswer){
                  buttonClass=styles.optionButtonCorrect;
                }else if(answer===option && !feedback.isCorrect){
                  buttonClass=styles.optionButtonWrong;
                }else{
                  buttonClass=styles.optionButtonDisabled;
                }
              }
              return(
                  <button className={buttonClass} 
                  key={index} 
                  onClick={()=>handleChoiceSubmit(option)}
                  disabled={feedback !==null} >
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