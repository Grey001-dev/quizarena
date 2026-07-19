import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import authRouter from './routes/authroutes.js'
import { settingsRouter } from './routes/settingsroutes.js'
import { roomRouter } from './routes/roomroutes.js'
import { socketHandlers } from './socket/socketHandler.js'
import { userRouter } from './routes/userroutes.js'
dotenv.config()
const app=express();
const PORT=process.env.PORT || 7000
const httpServer=http.createServer(app)


const allowedOrigins = [
  'http://localhost:5173',
  'https://quizarena001.netlify.app',
  "https://quizarena-eta.vercel.app"
];
const io = new Server(httpServer, {
    cors: { origin: allowedOrigins },
    methods: ["GET", "POST"],
    credentials: true
})

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/settings",settingsRouter)
app.use("/api/room",roomRouter);
app.use("/api/user",userRouter)
app.get("/test",(req,res)=>{
    res.json({message:'he is alive'})
})

io.on('connection',(socket)=>{
    console.log('Client connected:',socket.id);
    socketHandlers(io,socket);
})

httpServer.listen(PORT,()=>{
    console.log('Server on port 7000')
})