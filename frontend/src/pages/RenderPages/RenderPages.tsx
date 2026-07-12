import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Dashboard from "../../components/Dashboard/userDashboard.tsx";
import SoloPage from "../../components/Solo/SoloPage.tsx";
import JoinRoom from "../../components/Join/Join.tsx";
import SettingsPage from "../Settings/SettingsPage.tsx";
import { handleRoomRequest } from "../../services/RoomServices.ts";
import HostPage from "../../components/Host/CreateRoom.tsx";
import ProtectedRoutes from "../../hooks/ProtectedRoutes.tsx";

interface soloDetails{
    category:string
    difficulty:string
    questions:number
}



interface hostRoom{
    category:string
    difficulty:string
    questions:number
}

export default function RenderPages(){
    const navigate=useNavigate()
    const [userDetails,setUserDetails]=useState();
    const [soloDetails,setSoloDetails]=useState();
    const [joinRoom,setJoinRoom]=useState("");
    const [hostRoom,setHostRoom]=useState <string []>([]);
    const [message,setMessage]=useState("")
    

    const handlejoinRoom=async()=>{
        setMessage("")
        try {
            const data=await handleRoomRequest.joinRoom(joinRoom);
            if(data.roomId){
                navigate(`/lobby/${joinRoom}`)
            }else{
                setMessage(data.message)
            }

        } catch (err :any) {
            setMessage(err.message)
        }
    }
    const handlehostRoom=async()=>{
        setMessage("")
        try {
            const data =await handleRoomRequest.createRoom(hostRoom)
            
        } catch (error) {
            
        }
    }




    // all the js how data is moved would be here
    return(
        <main>
            <Routes>
                <Route element={<Dashboard />} path='/dashboard'/>
                <Route element={<SoloPage/>} path='/solo'/>
                <Route element={<HostPage/>} path='/host'/>
                <Route element={<JoinRoom/>} path='/join'/>
                <Route element={<SettingsPage/>} path='/settings'/>
               
                
            </Routes>
        </main>
    )
}