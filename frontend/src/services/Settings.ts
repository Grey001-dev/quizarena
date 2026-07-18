import axios from 'axios';

const API_URL = 'http://localhost:7000/api/settings';

interface Settings {
    change: "username" | "avatar" | "password";
    password?: string;
    username?: string;
    avatar?: string;
}
export async function settingsPatch(settingsData: Settings) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.patch(
            API_URL, 
            settingsData, 
            {  
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return res.data; 
        
    } catch (error) {
        console.error("Failed to patch settings:", error);
        throw error;
    }
}