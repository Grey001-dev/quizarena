import express from 'express'
import { startSoloSession,getGameQuestion,submitAnswer } from '../controllers/roomcontrollers.js';
import { verifyToken } from '../middleware/authmiddleware.js'
import { getCategories } from '../controllers/categoryController.js';
export const roomRouter=express.Router();

roomRouter.post("/solo",verifyToken,startSoloSession)
roomRouter.get("/categories",getCategories)
roomRouter.get("/:roomId/question",verifyToken,getGameQuestion)
roomRouter.post("/:roomId/answer",verifyToken,submitAnswer)


// "11b9de07-1d63-406a-b07b-6b31faa7f410"
