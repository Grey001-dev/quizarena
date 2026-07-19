import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthServices } from "../../services/AuthServices.ts";
import styles from "./AuthPage.module.css";

type AuthMode = "login" | "register";

interface AuthPageProps {
    setToken: (token: string) => void;
}

export default function AuthPage({ setToken }: AuthPageProps) {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>("login");
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    function handleSwitch(change: AuthMode) {
        setError("");
        setMode(change);
    }

    const handleLoginSubmit = async () => {
        try {
            setLoading(true);
            setError("");
            const fields = {
                mode: mode,
                email: loginEmail,
                password: loginPassword
            };
            const data = await AuthServices.submit(fields);
            if (data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.message || "Authentication failed.");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Error handling login form", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegSubmit = async () => {
        try {
            setLoading(true);
            setError("");
            const fields = {
                mode: mode,
                email: registerEmail,
                password: registerPassword,
                username: username
            };
            const data = await AuthServices.submit(fields);
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setToken(data.token);
                navigate("/dashboard");
            } else {
                setError(data.message || "Authentication failed.");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Error handling form submission", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftPanel}>
                <button className={styles.backButton} onClick={() => navigate("/")}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={styles.backIcon}
                    >
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                    </svg>
                    Back
                </button>
                <div className={styles.leftContent}>
                    <span className={styles.leftLogo}>⚡ QuizArena</span>
                    <h2 className={styles.leftTagline}>
                        Build a quiz <br />Share a code <br />Battle live
                    </h2>
                    <p className={styles.leftSub}>
                        Admins create rooms and run the game. Players jump in with a 6-character code - no setup needed.
                    </p>
                    <div className={styles.leftStats}>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>6</span>
                            <span className={styles.leftStatLabel}>char room code</span>
                        </div>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>10s</span>
                            <span className={styles.leftStatLabel}>per question</span>
                        </div>
                        <div className={styles.leftStatItem}>
                            <span className={styles.leftStatNumber}>10</span>
                            <span className={styles.leftStatLabel}>categories</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formBox}>
                    <div className={styles.toggleRow}>
                        <button 
                            className={mode === "login" ? styles.toggleActive : styles.toggleInactive}
                            onClick={() => handleSwitch("login")}
                        >
                            Sign in
                        </button>
                        <button 
                            className={mode === "register" ? styles.toggleActive : styles.toggleInactive}
                            onClick={() => handleSwitch("register")}
                        >
                            Create Account
                        </button>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    
                    {mode === "login" && (
                        <div className={styles.form}>
                            <h1 className={styles.formTitle}>Welcome back</h1>
                            <p className={styles.formSubtitle}>Sign in to your account to continue</p>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Email</label>
                                <input 
                                    type="email"
                                    className={styles.fieldInput}
                                    placeholder="Grey@example.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Password</label>
                                <input 
                                    className={styles.fieldInput}
                                    type="password" 
                                    value={loginPassword}
                                    placeholder="******"
                                    minLength={6}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className={styles.submitButton}
                                onClick={handleLoginSubmit}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                            <p className={styles.switchText}>
                                No account?{" "}
                                <button className={styles.switchLink} onClick={() => handleSwitch("register")}>
                                    Create one
                                </button>
                            </p>
                        </div>
                    )}

                    {mode === "register" && (
                        <div className={styles.form}>
                            <h1 className={styles.formTitle}>Create your account</h1>
                            <p className={styles.formSubtitle}>Join QuizArena and start battling.</p>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Username</label>
                                <input
                                    className={styles.fieldInput}
                                    placeholder="Grey001"
                                    value={username}
                                    maxLength={8}
                                    onChange={(e) => setUsername(e.target.value)} 
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
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Password</label>
                                <input
                                    className={styles.fieldInput} 
                                    type="password" 
                                    placeholder="At least 6 characters"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                />
                            </div>

                            <button 
                                className={styles.submitButton}
                                onClick={handleRegSubmit}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>

                            <p className={styles.switchText}>
                                Already have an account?{" "}
                                <button className={styles.switchLink} onClick={() => handleSwitch("login")}>
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}