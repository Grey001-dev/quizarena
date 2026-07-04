import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import dotend, { configDotenv } from 'dotenv'
import authRouter from './routes/authroutes.js'
dotenv.config()
const app=express();
const httpServer=http.createServer(app)

const io=new Server(httpServer,{
    cors:{origin :'http://localhost:5174'}
})

app.use(cors())

app.use(express.json())

app.use("/api/auth",authRouter)

io.on('connection',(socket)=>{
    console.log('Client connected:',socket.id);
    socket.on('disconnect',()=>console.log('Client left:',socket.id))
})

httpServer.listen(4000,()=>{
    console.log('Server on port 4000')
})