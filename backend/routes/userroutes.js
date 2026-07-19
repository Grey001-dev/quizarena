import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { getLeaderboard,getUserStats } from '../controllers/leaderboardcontroller.js';

export const userRouter=express.Router();

userRouter.get("/leaderboard",verifyToken,getLeaderboard)
userRouter.get("/stats",verifyToken,getUserStats)
