import express from 'express'
import { handleauth } from '../controllers/handleauth.js'
const authRouter=express.Router()

authRouter.post("/",handleauth)

export default authRouter