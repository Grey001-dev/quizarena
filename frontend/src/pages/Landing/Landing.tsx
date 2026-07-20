import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import styles from "./Landing.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLogoGroup}>
          <Brain className={styles.brainIcon} size={24} />
          <span className={styles.navLogo}>QuizArena</span>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.signInButton} onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </nav>

      <section className={styles.topSection}>
        <div className={styles.topText}>
          <div className={styles.badgeContainer}>
            <span className={styles.toptop}>Real-time quiz battles for kids</span>
          </div>
          <h1 className={styles.topTitle}>
            The classroom <br />
            <span className={styles.toptitleAccent}>just got competitive</span>
          </h1>
          <p className={styles.topSubtitle}>
            Admins launch a live quiz. Kids join instantly, answer fast, earn points, and climb the leaderboard all in real time.
          </p>
          <div className={styles.topButtons}>
            <button className={styles.createQuizButton} onClick={() => navigate("/register")}>
              Create a Quiz →
            </button>
            <button className={styles.joinRoomButton} onClick={() => navigate("/login")}>
              Join with a code
            </button>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>6</span>
          <span className={styles.statLabel}>Character room codes</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10s</span>
          <span className={styles.statLabel}>Per question timers</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10</span>
          <span className={styles.statLabel}>Question categories</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>1-16</span>
          <span className={styles.statLabel}>Player age ranges</span>
        </div>
      </section>

      <section className={styles.featureSection}>
        <p className={styles.featureSectionLabel}>How it works</p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap}>
              <Brain size={22} className={styles.cardBrainIcon} />
            </div>
            <h3 className={styles.featureTitle}>Live battle rooms</h3>
            <p className={styles.featureDescription}>
              Admins create a room in seconds. Kids join safely with a simple 6 character code.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap}>
              <span className={styles.textIcon}>ELO</span>
            </div>
            <h3 className={styles.featureTitle}>ELO ranking system</h3>
            <p className={styles.featureDescription}>
              Win dynamic battles and scale the global leaderboard. Every player earns a competitive rating that adapts to who they beat.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.bottomSection}>
        <h2 className={styles.bottomTitle}>Ready for battle?</h2>
        <p className={styles.bottomSubtitle}>
          Set up your first live arena quiz in under 2 minutes.
        </p>
        <button className={styles.createQuizButton} onClick={() => navigate("/register")}>
          Start Now for Free →
        </button>
      </section>

      <footer className={styles.footer}>
        <div className={styles.navLogoGroup}>
          <Brain className={styles.brainIcon} size={20} />
          <span className={styles.footerLogo}>QuizArena</span>
        </div>
        <span className={styles.footerTagline}>
          Built for curious kids everywhere
        </span>
      </footer>
    </div>
  );
}