import express from 'express'
import { verifyToken } from '../middleware/authmiddleware.js'
import {
  generateRandomCode,
  joinRoom,
  startSoloSession,
  getGameQuestion,
  submitAnswer
} from '../controllers/roomcontrollers.js'
import { getCategories } from '../controllers/categoryController.js'

export const roomRouter = express.Router();

roomRouter.get("/categories", getCategories)
roomRouter.post("/create", verifyToken, generateRandomCode)
roomRouter.post("/join", verifyToken, joinRoom)
roomRouter.post("/solo", verifyToken, startSoloSession)
roomRouter.get("/:roomId/question", verifyToken, getGameQuestion)
roomRouter.post("/:roomId/answer", verifyToken, submitAnswer)