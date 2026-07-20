import { activeGames } from "../lib/activeGames.js";
import { activeLobbies } from "../lib/activeLobbies.js";
import { fetchQuestions } from "../lib/questions.js";
import prisma from "../lib/prisma.ts";
export function socketHandlers(io,socket){
    // Made use of explicit events to properly grasps what they do beforehand
    socket.on("join-lobby",({roomCode,username,userId,isHost,avatar,elo})=>{
        if(!roomCode){
            return
        }
        socket.join(roomCode);
         console.log("join-lobby received (post play-again check):", {roomCode, userId, isHost});
        socket.data.roomCode=roomCode;
        socket.data.username=username;
        socket.data.userId=userId;
        socket.data.avatar=avatar;
        socket.data.elo=elo;


        if(!activeLobbies.has(roomCode)){
            activeLobbies.set(roomCode,{players:[],hostId:isHost ? userId:null})
        }
        const lobby=activeLobbies.get(roomCode)

        const alreadyIn=lobby.players.find(p=>p.userId===userId);
        if(!alreadyIn){
            lobby.players.push({
                socketId:socket.id,
                username,
                userId,
                isHost,
                avatar:avatar || "default",
                elo
            })
        }
        console.log("Room found on join attempt:", activeRoom?.roomCode, "status:", activeRoom?.status);
        console.log(lobby.players)
        io.to(roomCode).emit("lobby-update",lobby.players);
    });

    // Created the start game event when the hosts wants to host a game
    socket.on("start-game", async ({ roomCode, category, difficulty, amount, timeLimit }) => {
    try {
        console.log("Fetching questions...");
        const questions = await fetchQuestions(category, difficulty, amount);
        console.log("Questions fetched:", questions.length);

        // i fetch questions and keep them in my activeGames map
        activeGames.set(roomCode, {
            questions,
            currentIndex: 0,
            gameOver: false,
            players: {},
            answersThisRound: {},
            timeLimit: 10
        });
        console.log("activeGames set");

        const lobby = activeLobbies.get(roomCode);
        if(!lobby){
            return
        }

        if (lobby) {
            lobby.players.forEach(player => {
                activeGames.get(roomCode).players[player.userId] = { username: player.username, score: 0 };
            });
        }
        await prisma.room.update({
            where: { roomCode },
            data: { 
                status: "ACTIVE" ,
                category:Array.isArray(category) ? category.join(",") : category,
                difficulty:difficulty
            }
        });
        console.log("room status updated to ACTIVE");

        io.to(roomCode).emit("game-started",{totalQuestions:activeGames.get(roomCode)?.questions.length});
        
        setTimeout(()=>{
            DisplayEachQuestion(io, roomCode);
        },2000)
    } catch (error) {
        console.error("Failed to start game:", error);
    }
});
    socket.on("leave-lobby",({roomCode,userId})=>{
        const lobby=activeLobbies.get(roomCode);
        if(!lobby){
            return
        }
        const player=lobby.players.find(p=>p.userId===userId)

        if(player?.isHost){
            io.to(roomCode).emit("host-left");
            activeGames.delete(roomCode);
            activeLobbies.delete(roomCode)
        }
        else{
            lobby.players=lobby.players.filter(p=>p.userId !==userId);
            io.to(roomCode).emit("lobby-update",lobby.players);
        }
        socket.leave(roomCode)
    })


    function DisplayEachQuestion(io, roomCode) {
    const gameSession = activeGames.get(roomCode);
    if (!gameSession) {
        console.log("Not a valid room");
        return;
    }
    console.log("Sending question:", gameSession.questions[gameSession.currentIndex]);

    gameSession.answersThisRound = {};
    let currentIndex = gameSession.currentIndex;
    const question = gameSession.questions[currentIndex];
    io.to(roomCode).emit("question-start", {
        question: question,
        gameNumber: currentIndex,
        timeLimit: gameSession.timeLimit,
    });
    console.log("question-start emitted with real data");

    gameSession.roundTimer = setTimeout(() => {
        endQuestion(io, roomCode);
    }, gameSession.timeLimit * 1000);
}
    socket.on("submit-answers",async({roomCode,userId,answer})=>{
        const gameSession=activeGames.get(roomCode)
        if(!gameSession){
            return
        }
        const {questions,currentIndex}=gameSession
        const currentQuestion=questions[currentIndex]
        const isCorrect=answer===currentQuestion.correctAnswer;
        if(isCorrect){
            gameSession.players[userId].score+=1;
        }
        gameSession.answersThisRound[userId]={answer,isCorrect};
        io.to(roomCode).emit("player-answered",{
            userId,
            totalAnswered:Object.keys(gameSession.answersThisRound).length,
            totalPlayers:Object.keys(gameSession.players).length
        });

        const everyoneAnswered=Object.keys(gameSession.answersThisRound).length===Object.keys(gameSession.players).length;
        if(everyoneAnswered){
            endQuestion(io,roomCode);
        }
    })

    // I made this to displayy like a leaderboard standing for the users after each round of the gameSession
    function endQuestion(io,roomCode){
        const gameSession=activeGames.get(roomCode);
        if(!gameSession){
            return
        }
        if (gameSession.roundTimer) {
            clearTimeout(gameSession.roundTimer)};
        const currentIndex=gameSession.currentIndex
        const currentQuestion=gameSession.questions[currentIndex];

        const leadearBoard=Object.keys(gameSession.players).map(userId=>{
            const player=gameSession.players[userId]
            return{
                userId,
                username:player.username,
                score:player.score
            }
        }).sort((a,b)=>b.score-a.score);

        io.to(roomCode).emit("question-end",{
            correctAnswer:currentQuestion.correctAnswer,
            leadearBoard
        });
        
        setTimeout(()=>{
            gameSession.currentIndex+=1;
            if(gameSession.currentIndex>=gameSession.questions.length){
                endGame(io,roomCode)
                activeGames.delete(roomCode);
            }else{
                DisplayEachQuestion(io,roomCode)
            }
        },3000)
    }
    socket.on("play-again",async({roomCode})=>{
        const lobby=activeLobbies.get(roomCode)
        console.log("PLAY-AGAIN EVENT RECEIVED, roomCode:", roomCode);
        if(!lobby){
            return
        }
        await prisma.room.update({
            where:{roomCode:roomCode},
            data:{
                status:"WAITING"
            }
        })
         console.log("Room status after play-again update:", updated.status);
        activeGames.delete(roomCode);
        io.to(roomCode).emit("returned-to-lobby",{hostId:lobby.hostId});
    })

    socket.on("disconnect",()=>{
        console.log("disconnect fired for socket;",socket.id,"data:",socket.dat)
        const {roomCode,userId}=socket.data;
        if(!roomCode){
            console.log("no roomCode in socket.data, exiting early");
            return
        }
        const lobby=activeLobbies.get(roomCode)
        if(!lobby){
            console.log("no lobby found for roomCode:", roomCode);
            return
        }
        const player=lobby.players.find(p=>p.userId===userId);
        console.log("player found on disconnect:", player);
        if (player?.isHost){
            io.to(roomCode).emit("host-left")
            activeGames.delete(roomCode)
            activeLobbies.delete(roomCode)
        }else{
            // Filter out the player in the lobby
            lobby.players=lobby.players.filter(p=>p.userId !==userId);
            console.log("updated players after removal:", lobby.players);
            io.to(roomCode).emit("lobby-update",lobby.players);
        }
    })

    async function endGame(io,roomCode){
    const gameSession=activeGames.get(roomCode)
    if(!gameSession){
        return
    }
    gameSession.gameOver=true;
    const finalResult=Object.keys(gameSession.players).map(userId=>{
        const eachPlayer=gameSession.players[userId]
        return{
            userId,
            username:eachPlayer.username,
            score:eachPlayer.score
        }
    }).sort((a,b)=>b.score-a.score)

    const lobby=activeLobbies.get(roomCode)
    if(!lobby){
        return
    }
    try {
        const room=await prisma.room.findUnique({where:{roomCode}});
        const halfLobby=Math.ceil(finalResult.length/2)
        const boundaryScore=finalResult[halfLobby-1]?.score
        for (let i=0;i<finalResult.length;i++){
            const userRow=finalResult[i];
            const roundRank=i+1;
            const won=roundRank<=halfLobby || userRow.score===boundaryScore;
            const eloChange=won? 10 : -8;
            finalResult[i].eloChange=eloChange
            const eachPlayers=lobby.players.find((p)=>p.userId===userRow.userId)
            if(eachPlayers){
                eachPlayers.elo=(eachPlayers.elo || 1000) + eloChange;
            }

            await prisma.gameSession.create({
                data:{
                    username:userRow.username,
                    score:userRow.score,
                    eloChange:eloChange,
                    rank:roundRank,
                    userId:userRow.userId,
                    roomId:room.id,
                }
            });

            if(userRow.userId){
                await prisma.user.update({
                    where:{id:userRow.userId},
                    data:{elo:{increment:eloChange}}
                })
            }
        }
        await prisma.room.update({
            where:{roomCode},
            data:{status:'FINISHED'}
        })
    } catch (error) {
        console.log('Failed to save game results:',error.message)
    }

    io.to(roomCode).emit("game-over",{finalResult});
    activeGames.delete(roomCode)
}
}