import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { ArrowLeft, Shuffle, Eye, EyeOff, AlertTriangle, CheckCircle, Loader2, Brain, User, ShieldCheck, KeyRound, LogOut } from 'lucide-react';
import AvatarDisplay from '../../components/AvatarDisplay/AvatarDisplay';
import { settingsPatch } from '../../services/Settings';

function generateSeedOptions(base: string): string[] {
    if (!base) return ['seed1', 'seed2', 'seed3', 'seed4', 'seed5', 'seed6'];
    return [base, base + '1', base + '2', base + '3', base + '4', base + '5'];
}

export default function SettingsPage() {
    const navigate = useNavigate();

    const storedUserStr = localStorage.getItem("user") || "{}";
    const user = JSON.parse(storedUserStr);

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarSeed, setAvatarSeed] = useState<string>(user?.avatarSeed || '');
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [savingUsername, setSavingUsername] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: "" });
    const [seedOptions, setSeedOptions] = useState<string[]>(generateSeedOptions(user?.username));

    const triggerNotification = (type: 'success' | 'error', text: string) => {
        setStatus({ type, text });
        setTimeout(() => setStatus({ type: null, text: "" }), 4000);
    };

    const handleUsernameSubmit = async () => {
        if (!username.trim()) return triggerNotification('error', "Username cannot be empty");
        if (username === user.username) return triggerNotification('error', "This is already your username");

        setSavingUsername(true);
        try {
            await settingsPatch({
                change: "username",
                username: username.trim()
            });

            const updatedUser = { ...user, username: username.trim() };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            triggerNotification('success', "Username updated successfully!");
        } catch (error: any) {
            triggerNotification('error', "Failed to update username");
            setUsername(user.username || '');
        } finally {
            setSavingUsername(false);
        }
    };

    const handleAvatarSelect = async (selectedSeed: string) => {
        setAvatarSeed(selectedSeed);
        try {
            await settingsPatch({
                change: "avatar",
                avatar: selectedSeed
            });

            const updatedUser = { ...user, avatarSeed: selectedSeed };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            triggerNotification('success', "Avatar updated successfully!");
        } catch (error: any) {
            triggerNotification('error', "Failed to save avatar choice");
            setAvatarSeed(user.avatarSeed || '');
        }
    };

    const handlePasswordSubmit = async () => {
        if (!newPassword) return triggerNotification('error', "New password field is required");
        if (newPassword.length < 6) return triggerNotification('error', "New password must be at least 6 characters");

        setSavingPassword(true);
        try {
            await settingsPatch({
                change: "password",
                password: newPassword
            });

            triggerNotification('success', "Password updated successfully!");
            setNewPassword("");
        } catch (error: any) {
            triggerNotification('error', "Failed to alter password credentials");
        } finally {
            setSavingPassword(false);
        }
    };

    function shuffleAvatars() {
        const random = Math.random().toString(36).substring(7);
        setSeedOptions(generateSeedOptions(random));
    }

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className={styles.page}>
            {status.type && (
                <div className={`${styles.toast} ${status.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
                    {status.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    <span>{status.text}</span>
                </div>
            )}

            <nav className={styles.navbar}>
                <div className={styles.navLogo}>
                    <Brain size={22} color="#60a5fa" strokeWidth={2.2} />
                    <span>QuizArena</span>
                </div>
                <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={14} /> <span>Dashboard</span>
                </button>
            </nav>

            <div className={styles.content}>
                <p className={styles.categoryLabel}>Settings</p>
                <h1 className={styles.title}>Manage your profile</h1>
                <p className={styles.subTitle}>Customize your avatar, credentials, and session preferences</p>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <User size={18} className={styles.panelIcon} />
                        <p className={styles.panelLabel}>Your Avatar</p>
                    </div>

                    <div className={styles.avatarSha}>
                        <AvatarDisplay seed={avatarSeed} size={60} />
                        <div>
                            <p className={styles.avatarName}>{username || 'Player'}</p>
                            <p className={styles.avatarElo}>ELO Rating: <span>{user.elo || 1000}</span></p>
                        </div>
                    </div>

                    <div className={styles.avatarGrid}>
                        {seedOptions.map((seed) => (
                            <div
                                key={seed}
                                onClick={() => handleAvatarSelect(seed)}
                                className={avatarSeed === seed ? styles.avatarOptionActive : styles.avatarOption}
                            >
                                <AvatarDisplay seed={seed} size={42} />
                            </div>
                        ))}
                    </div>

                    <button className={styles.shuffleButton} onClick={shuffleAvatars}>
                        <Shuffle size={13} /> Shuffle Avatars
                    </button>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <ShieldCheck size={18} className={styles.panelIcon} />
                        <p className={styles.panelLabel}>Edit Username</p>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Display Name</label>
                        <input
                            type="text"
                            className={styles.fieldInput}
                            value={username}
                            maxLength={8}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>

                    <button 
                        className={styles.saveButton}
                        onClick={handleUsernameSubmit}
                        disabled={savingUsername || username === user.username || !username.trim()}
                    >
                        {savingUsername ? <Loader2 size={14} className={styles.spin} /> : 'Save Changes'}
                    </button>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <KeyRound size={18} className={styles.panelIcon} />
                        <p className={styles.panelLabel}>Security & Password</p>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Account Email</label>
                        <input
                            type="email"
                            className={`${styles.fieldInput} ${styles.inputDisabled}`}
                            value={email}
                            readOnly
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>New Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                className={styles.fieldInputPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='••••••••'
                            />
                            <button 
                                type="button"
                                className={styles.eyeButton} 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        className={styles.saveButton}
                        onClick={handlePasswordSubmit}
                        disabled={savingPassword || !newPassword.trim()}
                    >
                        {savingPassword ? <Loader2 size={14} className={styles.spin} /> : 'Change Password'}
                    </button>
                </div>

                <div className={`${styles.panel} ${styles.dangerPanel}`}>
                    <div className={styles.dangerHeader}>
                        <LogOut size={18} color="#dc2626" />
                        <p className={styles.dangerLabel}>Session</p>
                    </div>
                    <div className={styles.dangerContent}>
                        <p className={styles.dangerText}>Log out of your QuizArena session on this browser</p>
                        <button className={styles.logOutButton} onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}