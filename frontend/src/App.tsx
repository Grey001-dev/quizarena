import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/Landing/Landing'
import AuthPage from './pages/Auth/AuthPage'
import ProtectedRoutes from './hooks/ProtectedRoutes.tsx'
import Dashboard from './components/Dashboard/userDashboard.tsx'
import SoloPage from './components/Solo/SoloPage.tsx';
import HostPage from './components/Host/CreateRoom.tsx'
import JoinRoom from './components/Join/Join.tsx'
import SettingsPage from './pages/Settings/SettingsPage.tsx'
import GamePage from './pages/Game/GamePage.tsx'
import LeaderboardPage from './pages/LeaderBoard/LeaderBoard.tsx'
function App() {
  const [token,setToken]=useState(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/login" element={<AuthPage setToken={setToken}/>} />
        <Route path="/register" element={<AuthPage setToken={setToken}/>}/>
        <Route element={<ProtectedRoutes/>}>
            <Route element={<Dashboard />} path='/dashboard'/>
            <Route element={<SoloPage/>} path='/solo'/>
            <Route element={<HostPage/>} path='/host'/>
            <Route element={<JoinRoom/>} path='/join'/>
            <Route element={<SettingsPage/>} path='/settings'/>
            <Route element={<GamePage/>}path="/game/:roomCode"/>
            <Route element={<LeaderboardPage/>} path='/leaderboard'/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
