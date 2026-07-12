import express from 'express'
import { verifyToken } from '../middleware/authmiddleware.js'
import { handleSettings ,getUser} from '../controllers/handleSettings.js';
export const settingsRouter=express.Router()

settingsRouter.patch("/",verifyToken,handleSettings);
settingsRouter.get("/",verifyToken,getUser)