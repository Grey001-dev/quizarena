import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

type AuthMode="login" | "register";

export default function AuthPage(){
    const navigate=useNavigate();
    const [mode,setMode]=useState<AuthMode>("login")
    const [loginEmail,setLoginEmail]=useState<string>("")
    const [loginPassword,setLoginPassword]=useState<string>("")
    // registration fields
    const [username,setUsername]=useState<string>("")
    const [registerEmail,setRegisterEmail]=useState<string>("")
    const [registerPassword,setResgisterPassword]=useState<string>("")
    const [loading,setLoading]=useState<boolean>(false);
    const [error,setError]=useState<string>("");

    function handleSwitch(change:AuthMode){
        setError("")
        setMode(change)
    }
    const handleLoginSubmit=async()=>{
        try {
            const fields={
            mode:mode,
            email:loginEmail,
            password:loginPassword
        }
            const res=await fetch("http://localhost:5000/api/auth",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(fields)
            });
            const data=await res.json();
            if(data.token){
                localStorage.setItem("token",data.token);
                navigate("/dashboard")
            }
            if(!res.ok){
                setError(data.message)
                return
            }
            console.log(data.message)   
        } catch (err) {
            console.error('Error handling login form',err)
        }
    }
    const handleRegSubmit=async()=>{
        try {
            const fields={
                mode:mode,
                email:registerEmail,
                password:registerPassword,
                username:username,
            }
            const res=await fetch("http://localhost:5000/api/auth",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(fields)
            })
            const data=await res.json()
            console.log("Succesfully registered",data.message)
        } catch (err) {
            console.log("Error registering user",err)
        }
    }

    return(
        <div className={styles.page}>
            <div className={styles.leftPanel}>
                <button className={styles.backButton} onClick={()=>navigate("/")}>
                    ← Back
                </button>
                <div className={styles.leftContent}>
                    <span className={styles.leftLogo}>
                        ⚡ QuizArena
                    </span>
                    <h2 className={styles.leftTagline}>
                        Build a quiz <br />Share a code <br />Battle live
                    </h2>
                    <p className={styles.leftSub}>
                        Admins create rooms and run the game. Players jump in with a 6-character code - no setup needed.
                    </p>
                    <div className={styles.leftStats}>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>
                                6
                            </span>
                            <span className={styles.leftStatLabel}>
                                char room code
                            </span>
                        </div>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>10s</span>
                            <span className={styles.leftStatLabel}>per question</span>
                        </div>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>∞</span>
                            <span className={styles.leftStatLabel}>categories</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formBox}>
                    <div className={styles.toggleRow}>
                        <button className={mode==="login" ? styles.toggleActive :styles.toggleInactive}
                        onClick={()=>handleSwitch("login")}
                        >
                            Sign in
                        </button>
                        <button className={mode==="register" ? styles.toggleActive :styles.toggleInactive}
                        onClick={()=>handleSwitch("register")}
                        >
                        Create Account
                        </button>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {mode==="login" && (
                        <div className={styles.form}>
                            <h1 className={styles.formTitle}>Welcome back</h1>
                            <p className={styles.formSubtitle}>Sign in to your account to continue</p>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Email</label>
                                <input type="email"
                                className={styles.fieldInput}
                                placeholder="Grey@example.com"
                                value={loginEmail}
                                onChange={(e)=>setLoginEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Password</label>
                                <input 
                                className={styles.fieldInput}
                                type="password" 
                                value={loginPassword}
                                placeholder="******"
                                onChange={(e)=>setLoginPassword(e.target.value)}
                                />
                            </div>

                            <button
                            className={styles.submitButton}
                            // ONCLICK
                            disabled={loading}
                            >
                                {loading ? 'Signing in...' :"Sign in"}
                            </button>
                            <p className={styles.switchText}>
                                No account? {""}
                                <button className={styles.switchLink}
                                onClick={()=>handleSwitch("register")}
                                >
                                    Create one
                                </button>
                            </p>
                        </div>
                    )}

                    {mode==="register" && (
                        <div className={styles.form}>
                            <h1 className={styles.formTitle}>
                                Create tour accound
                            </h1>
                            <p className={styles.formSubtitle}>
                                Join QuizArena and start battling.
                            </p>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Username</label>
                                <input
                                className={styles.fieldInput}
                                placeholder="Grey001"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)} 
                                type="text" 
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Email</label>
                                <input 
                                className={styles.fieldInput}
                                type="email" 
                                placeholder="Grey@example.com"
                                value={registerEmail}
                                onChange={(e)=>setRegisterEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Password</label>
                                <input
                                className={styles.fieldInput} 
                                type="password" 
                                placeholder="At least 6 characters"
                                value={registerPassword}
                                onChange={(e)=>setResgisterPassword(e.target.value)}
                                />
                            </div>

                            <button className={styles.submitButton}
                            // Onclick
                            disabled={loading}
                            >
                                {loading ? 'Creating account..' :"Create account"}
                            </button>

                            <p className={styles.switchText}>
                                Already have an account ? {" "}
                                <button className={styles.switchLink} onClick={()=>handleSwitch("login")}>
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}