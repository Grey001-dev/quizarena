import jwt from "jsonwebtoken";
import dotenv from "dotenv"


export const verifyToken=async(req,res,next)=>{
    const authHeaders=req.headers["authorization"];
    const token=authHeaders && authHeaders.split(" ")[1];

    if(!token){
        return res.status(400).json({message:"No token,access denied"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        req.userId=decoded.id
        next()
    } catch (error) {
        return res.status(500).json({message:"Error caught verifying user"})
        console.log('Error caught verifying user',error)
    }
}
