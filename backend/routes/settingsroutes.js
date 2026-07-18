import express from 'express'
import { verifyToken } from '../middleware/authmiddleware.js'
import { settings} from '../controllers/handleSettings.js';
export const settingsRouter=express.Router()

settingsRouter.patch("/",verifyToken,settings);
