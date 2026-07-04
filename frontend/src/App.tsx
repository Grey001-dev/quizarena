
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/Landing/Landing'
import AuthPage from './pages/Auth/AuthPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/register" element={<AuthPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App
