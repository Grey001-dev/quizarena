import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./userDashboard.module.css";

export default function Dashboard(){
    const [elo,setElo]=useState(1000)
    const navigate=useNavigate();

    function greetings(){
        const hour=new Date().getHours();
        if(hour<12){
            return "Good morning"
        }
        if(hour>16){
            return "Good evening"
        }
        return "Good afternoon"
    }

    return(
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <span className={styles.navRight}>
                    {/* lighning or brain image */}
                    QuizArena
                </span>
                <span className={styles.navElo}>
                    ELO<strong>{elo|| 1000}</strong>
                </span>
                <div className={styles.navAvatar}>
                   {/* avatar image */}
                </div>
            </nav>

            <div className={styles.content}>
                <p className={styles.greeting}>
                    {greetings()},
                    {/* username */}
                </p>
                <h1 className={styles.title}>What do u want to do?</h1>

                <div className={styles.modeGrid}>
                    <div className={styles.modeCard} onClick={()=>navigate("/solo")}>
                        <div className={styles.modeIconBlue}>
                            {/* solo icon here */}
                        </div>
                        <p className={styles.modeDesc}>
                            Play alone. Pick a category and go.
                        </p>
                    </div>

                    <div className={`${styles.modeCard} ${styles.modeCardFilled}`}
                    onClick={()=>navigate("/host")}
                    >
                        <div className={styles.modeIconWhite}>
                            {/* image for host like a crown */}
                        </div>
                        <h2 className={styles.modeTitleWhite}>
                            Host a game
                        </h2>
                        <p className={styles.modeDescWhite}>
                            Create a room,share a code,play with others.
                        </p>
                    </div>

                    <div className={styles.modeCard}
                    onClick={()=>navigate("/join")}
                    >
                        <div className={styles.modeIconGreen}>
                            {/* Like a entrance or door icon */}
                        </div>
                        <h2 className={styles.modeTitle}>
                            Join a game
                        </h2>
                        <p className={styles.modeDesc}>
                            Enter a room code and jump in
                        </p>
                    </div>
                </div>

                {/* Botttom  */}
                <div className={styles.bottomGrid}>
                    <div className={styles.panel}>
                        <p className={styles.panelLabel}>
                            Recent games
                        </p>

                        <div className={styles.gameRow}>
                            <div className={styles.gameInfo}>
                                <p className={styles.gameName}>
                                    Science . Medium
                                </p>
                                <p className={styles.meta}>
                                    3 players .2h ago
                                </p>
                                <span className={styles.eloBadgeGreen}>+18 ELO</span>
                            </div>

                            <div className={styles.divider}/>

                            <div className={styles.gameRow}>
                                <div className={styles.gameInfo}>
                                    <p className={styles.gameName}>
                                        History . Easy
                                    </p>
                                    <p className={styles.gameMeta}>
                                        Solo .yesterday
                                    </p>
                                </div>
                                <span className={styles.eloBadgeGray}>Solo</span>
                            </div>

                            <div className={styles.divider}/>

                            <div className={styles.gameRow}>
                                <div className={styles.gameInfo}>
                                    <p className={styles.gameName}>
                                        Geography . Hard
                                    </p>
                                    <p className={styles.gameMeta}>
                                        5 players · 2d ago
                                    </p>
                                </div>
                                <span className={styles.eloBadgeRed}>-12 ELO</span> 
                            </div>
                        </div>

                        {/* STATS */}
                        <div className={styles.panel}>
                            <p className={styles.panelLabel}>
                                Your stats
                            </p>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <p className={styles.statLabel}>
                                        ELO rating
                                    </p>
                                    <p className={styles.statNumber}>
                                        {/* user elo */}
                                    </p>
                                </div>

                                <div className={styles.statCard}>
                                    <p className={styles.statLabel}>
                                        Games played
                                    </p>
                                    <p className={styles.statNumber}>
                                        34
                                    </p>
                                </div>

                                <div className={styles.statCard}>
                                    <p className={styles.statLabel}>
                                        Win rate
                                    </p>
                                    <p className={`${styles.statNumber} ${styles.statGreen}`}>
                                        57%
                                    </p>
                                </div> 

                                <div className={styles.statCard}>
                                    <p className={styles.statLabel}>Best rank</p>
                                    <p className={styles.statNumber}>
                                        #1
                                        {/* Logo depending on rank sha */}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}