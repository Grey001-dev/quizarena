import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./landing.module.css";

export default function LandingPage(){
    const navigate=useNavigate()
    const [tick,setTick]=useState <number>(10)
    return(<div className={styles.page}>
        <nav className={styles.navbar}>
            <span className={styles.navLogo}>⚡ QuizArena</span>
            <div className={styles.navButtons}>
                <button className={styles.signInButton} onClick={()=>navigate("/login")}>
                    Sign in
                </button>
                <button className={styles.getStartedButton} onClick={()=>navigate("/register")}>
                    Get started
                </button>
            </div>
        </nav>

        <section className={styles.topSection}>
            <div className={styles.dotGrid} aria-hiddent="true">
                <div className={styles.topText}>
                    <p className={styles.toptop}>Real-time quiz battles for kids</p>
                    <h1 className={styles.topTitle}>
                        The classroom <br />
                        <em className={styles.toptitleAccent}>Just got competitive</em>
                    </h1>
                    <p className={styles.topSubtitle}>
                        Admins launch a live quiz.kids join,answer fast,earn points and climb the leaderboard-all in real time.
                    </p>
                    <div className={styles.topButtons}>
                        <button className={styles.createQuizButton} onClick={()=>navigate("/register")}>
                            Create a Quiz →
                        </button>
                        <button className={styles.joinRoomButton} onClick={()=>navigate("/join")}>
                            Join with a code
                        </button>
                    </div>
                </div>
            </div>

        </section>
        {/* Stats */}
        <section className={styles.statsSection}>
            <div className={styles.statItem}>
                <span className={styles.statNumber}>
                    6
                </span>
                <span className={styles.statLabel}>Character room code</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statNumber}>10s</span>
                <span className={styles.statLabel}>per question timer</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>question categories</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statNumber}>1-16</span>
                <span className={styles.statLabel}>player age range</span>
            </div>
        </section>

        {/* Features */}
        <section className={styles.featureSection}>
            <p className={styles.featureSectionLabel}>How it works</p>
            <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>
                        ⚔️
                    </span>
                    <h3 className={styles.featureTitle}>
                        Live battle rooms
                    </h3>
                    <p className={styles.featureDescription}>
                        Admins create a room in seconds.kids join with a 6-character
                        code,no accounts needed to spectate
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🧠</span>
                    <h3 className={styles.featureTitle}>Speed-bonus scoring</h3>
                    <p className={styles.featureDescription}>
                        Answer fast,score higher. Every question has a countdown timer. 
                        The faster you answer, the more points you earn.
                    </p>
                </div>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>📈</span>
                    <h3 className={styles.featureTitle}>ELO ranking</h3>
                    <p className={styles.featureDescription}>
                        Win battles, climb the global leaderboard. Every player has a rating that rises and falls based on who they beat.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>
                        🎨
                    </span>
                    <h3 className={styles.featureTitle}>
                        Custom quizzes
                    </h3>
                    <p className={styles.featureDescription}>
                        Build your own question banks or pull from thousands of ready-made questions across science, history and more
                    </p>
                </div>
            </div>
        </section>
        
        <section className={styles.bottomSection}>
            <h2 className={styles.bottomTitle}>
                Ready for battle?
            </h2>
            <p className={styles.bottomSubtitle}>
                Set up Your first quiz in under 2 minutes.
            </p>
            <button className={styles.createQuizButton}
            onClick={()=>navigate("/register")}
            >
                Start Now for Free →
            </button>
        </section>

        <footer className={styles.footer}>
            <span className={styles.footerLogo}>
                ⚡ QuizArena
            </span>
            <span className={styles.footerTagline}>
                Built for curios kids everywhere
            </span>
        </footer>
    </div>)
}