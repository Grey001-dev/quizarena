import { verifyToken } from "../middleware/authmiddleware";
import { joinRoom } from "./roomcontrollers";
import express from 'express'
const multiRouter=express.Router();

multiRouter.post("/join",verifyToken,joinRoom)
