import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { generateRandomCode } from '../controllers/roomcontrollers.js';
export const codeGetRouter=express.Router();
codeGetRouter.get("/",verifyToken,generateRandomCode)