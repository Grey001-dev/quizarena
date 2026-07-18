import { io } from "socket.io-client";

export const socket=io("http://localhost:7000",{
    transports:["websocket"]
});

socket.on("connect",()=>{
    console.log("Socket connected:",socket.id);
})

socket.on("connect_error",(err)=>{
    console.error("Socket connection error:",err.message)
})