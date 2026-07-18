import prisma from '../lib/prisma.ts';
import { fetchQuestions } from '../lib/questions.js';
import { activeGames } from '../lib/activeGames.js';

export const generateRandomCode=async(req,res)=>{
    try {
        const userId=req.user.id
        const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let code='';
        for (let i=0;i<6;i++){
            code+=chars.charAt(Math.floor(Math.random() * chars.length));
        }
        let codeExists=await prisma.room.findFirst({
            where:{roomCode:code,status:"WAITING"}
        })
        while(codeExists){
            code='';
            for (let i=0;i<6;i++){
            code+=chars.charAt(Math.floor(Math.random() * chars.length));
            }
            codeExists=await prisma.room.findFirst({
                where:{roomCode:code,status:'WAITING'}
            })
        };
        const newRoom=await prisma.room.create({
            data:{
                roomCode:code,
                status:'WAITING',
                solo:false,
                hostId:userId,
            }
        })
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        return res.status(200).json({
            message:'Room code created',
            user,
            roomCode:code,
            roomId:newRoom.id
        });
        
    } catch (error) {
        console.error("Error generating code:",error.message);
        return res.status(500).json({message:'Internal server error generating room code'})
    }
}

export const joinRoom=async(req,res)=>{
    try {
        const userId=req.userId
        const {roomCode}=req.body;

        if (!roomCode){
            return res.status(400).json({message:'Room code required to join'})
        }
        const cleanCode=roomCode.toUpperCase().trim()

        const activeRoom=await prisma.room.findUnique({
            where:{roomCode:cleanCode}
        })

        if(!activeRoom){
            return res.status(400).json({
                message:'Room does not exist'
            })
        }
        if(activeRoom.status !=='WAITING'){
            return res.status(400).json({
                message: "Players are already in-game. Please wait for the next round."
            });
        }
        if(activeRoom==="INGAME"){
            return res.status(400).json({
                message:"Players ingame, wait for the next round"
            })
        }
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        return res.status(200).json({
            message:'Room verified successfully.Ready to join session.',
            roomId:activeRoom.id,
            user:{id:user.id,username:user.username,email:user.email,avatar:user.avatarSeed ||"default",elo:user.elo},
            roomCode:activeRoom.roomCode,
            category:activeRoom.category,
            difficulty:activeRoom.difficulty

        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({message:"Internal server error joining room"})
    }
}

// All solo rooms
export const startSoloSession=async (req,res)=>{
    try {
        let {category,difficulty,amount}=req.body;
        const userId=req.user.id;

        if(category && !Array.isArray(category)){
            category=[category]
        }
        const room=await prisma.room.create({
            data:{
                roomCode:null,
                category:category?.join(",") || 'mixed',
                difficulty:difficulty,
                solo:true,
                status:'ACTIVE',
                hostId:userId
            }
        })
        const questions=await fetchQuestions(category,difficulty,amount);


        activeGames.set(room.id,{
            questions,
            currentIndex:0,
            score:0
        })

        return res.status(200).json({message:'Solo room created',roomId:room.id})
    } catch (error) {
        console.log("Error creating solo session");
        return res.status(500).json({message:'Failed to create solo room'})
    }
}

export const getGameQuestion=async (req,res)=>{
    try {
        const {roomId}=req.params;

        const gameSession=activeGames.get(roomId);
        if(!gameSession){
            return res.status(404).json({message:'Game sessison not found or expired',gameOver:true})
        }
        const {questions,currentIndex}=gameSession;
        if(currentIndex>=questions.length){
            return res.status(200).json({
                message:'Game Over',
                gameOver:true,
                score:gameSession.score
            });
        }
        const currentQuestion=questions[currentIndex];
        return res.status(200).json({
            gameOver:false,
            currentIndex:currentIndex,
            totalQuestions:questions.length,
            question:currentQuestion,
        })
        console.log(currentQuestion)
    } catch (error) {
        console.error("Error fetching question:",error);
        return res.status(500).json({message:'Internal server error fetching question'})
    }
}
// Solo room btw
export async function submitAnswer(req,res){
    try {
        const {roomId}=req.params;
        const {answer}=req.body;

        const gameSession=activeGames.get(roomId);
        if(!gameSession){
            return res.status(404).json({message:'Game session not found or expired'});
        }
        const {questions,currentIndex}=gameSession;
        if(currentIndex>=questions.length){
            return res.status(400).json({message:"Game already finished"});
        }
        const currentQuestion=questions[currentIndex];
        const isCorrect=currentQuestion.correctAnswer===answer;

        if(isCorrect){
            gameSession.score+=1
        }
        gameSession.currentIndex +=1;
        activeGames.set(roomId,gameSession);
        return res.status(200).json({
            message:"Answer processed",
            isCorrect,
            correctAnswer:currentQuestion.correctAnswer,
            nextIndex:gameSession.currentIndex,
            score:gameSession.score,
            gameOver:gameSession.currentIndex>=questions.length,
            totalQuestions:gameSession.questions.length
        })
    } catch (error) {
        console.error("Error submitting answer:",error)
        return res.status(500).json({message:"Internal server error processing answer"})   
    }
} 
