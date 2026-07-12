import {useState,useEffect}from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { ArrowLeft } from 'lucide-react';
import AvatarDisplay from '../../components/AvatarDisplay/AvatarDisplay';
import { Shuffle,X } from 'lucide-react';

function generateSeedOptions(base:string):string[]{
    return [base,base+'1',base+'2',base+'3',base+'4',base+'5']
}

export default function SettingsPage(){
    const navigate=useNavigate();
    const user=JSON.parse(localStorage.getItem("user")||"{}")
    const [username,setUsername]=useState( user?.username|| '')
    const [email,setEmail]=useState(user?.email || '')
    const [avatarSeed,setAvatarSeed]=useState<string>(user?.username || '')
    const [currentPassword,setCurrentPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [savingUsername,setSavingUsername]=useState(false)
    const [savingEmail,setSavingEmail]=useState(false)
    const [message,setMessage]=useState("");
    const [seedOptions,setSeedOptions]=useState<string[]>(generateSeedOptions(user?.username));
    const [isZoomed,setIsZoomed]=useState(false)

    function shuffleAvatars(){
        const random=Math.random().toString(36).substring(7);
        setSeedOptions(generateSeedOptions(random));
    }

    function handleLogout(){
        localStorage.removeItem("token");
        navigate("/auth")
    }

    return(
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <span className={styles.navLogo}>
                    ⚡ QuizArena
                </span>
                <button className={styles.backButton} onClick={()=>navigate("/")}>
                    <ArrowLeft size={12}/> Dashboard
                </button>
            </nav>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Settings
                </h1>
                <p className={styles.subTitle}>Manage your account and profile</p>

                {message && <p className={styles.message}>{message}</p>}


                <div className={styles.panel}>
                    <p className={styles.panelLabel}>Your Avatar</p>
                    <div className={styles.avatarSha}>
                        <AvatarDisplay seed={avatarSeed} size={64}/>
                        <div>
                            <p className={styles.avatarName}>
                                {username}
                            </p>
                            <p className={styles.avatarElo}>ELO {user.elo ||1000}</p>
                        </div>
                    </div>

                    <div className={styles.avatarGrid}>
                        {seedOptions.map((seed)=>(
                            <div
                            key={seed}
                            onClick={()=>setAvatarSeed(seed)}
                            className={
                                avatarSeed===seed ? styles.avatarOptionActive: styles.avatarOption
                            }
                            >
                            <AvatarDisplay seed={seed} size={44}/>
                            </div>
                        ))}
                    </div>
                    <button className={styles.shuffleButton} onClick={shuffleAvatars}>
                      <Shuffle size={12}/>  Shuffle Avatars
                    </button>
                </div>

                <div className={styles.panel}>
                    <p className={styles.panelLabel}>
                        Edit Username
                    </p>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Username</label>
                        <input 
                        className={styles.fieldInput}
                        value={username}
                        maxLength={8}
                        onChange={(e)=>setUsername(e.target.value)}               
                        />
                    </div>

                    <button className={styles.saveButton}
                    disabled
                    >
                    {savingUsername ? 'Saving....':'Save Changes'}
                    </button>
                </div>
                <div className={styles.panel}>
                    <p className={styles.panelLabel}>Change Password</p>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Email</label>
                        <input 
                        type="email"
                        className={styles.fieldInput}
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Current password</label>
                        <input 
                        type="password" 
                        className={styles.fieldInput}
                        value={currentPassword}
                        onChange={(e)=>setCurrentPassword(e.target.value)}
                        placeholder='••••••••'
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>New password</label>
                        <input 
                        type="password" 
                        value={newPassword}
                        className={styles.fieldInput}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        placeholder='••••••••'
                        />
                    </div>

                    <button 
                    className={styles.saveButton}
                    disabled={savingEmail}

                    >
                    {savingEmail ? "Changing...":'Change Password'}
                    </button>
                </div>

                <div className={styles.Panel}>
                    <p className={styles.Label}>
                        Account
                    </p>
                    <div className={styles.Row}>
                        <p className={styles.Text}>Log out of your account on this device</p>
                    </div>
                    <button className={styles.logOutButton} onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </div>
            
        </div>
        
    )
}