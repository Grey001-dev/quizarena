import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../lib/prisma.ts";

dotenv.config()

export const handleauth=async(req,res)=>{
    const {mode}=req.body;
    if(mode==="login"){
        try {
            const {email,password}=req.body;
            if(!email|| !password){
                return res.status(400).json({message:"Must include emails/password"})
            }
            const user=await prisma.user.findUnique({
                where:{email:email}
            });
            if(!user){
                return res.status(400).json({message:"Email not found!"})
            }
            const hashedPassword=user.password;
            const correctPassword=bcrypt.compare(password,hashedPassword);
            if (!correctPassword){
                return res.status(400).json({message:"invalid credentials"})
            }
            const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'14d'})
            return res.status(200).json({
                message:"Login Successful",
                token,
                user:{id:user.id,username:user.username,email:user.email}
            })
        } catch (error) {
            return res.status(500).json({message:'Authentication error',error})
        }
    }else{
        const {username,email,password}=req.body;
        try {
            if(!email || !password || !username){
                return res.status(400).json({message:'Provide essential credentials'})
            }
            const existingEmail=await prisma.user.findUnique({
                where:{email:email}
            })
            if(existingEmail){
                return res.status(400).json({message:'Email already exists'});
            }
            const existingUsername=await prisma.user.findUnique({
                where:{username:username}
            })
            if(existingUsername){
                return res.status(400).json({message:'Username already taken try another one'})
            const hashedPassword=await bcrypt.hash(password,10)
            const user=await prisma.user.create({
                data:{
                    username:username,
                    email:email,
                    password:hashedPassword
                }
            })
            const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'14d'})
            return res.status(200).json({
                message:'Succesfully registered user',
                token,
                user:{id:user.id,username:user.username,email:user.email}
            })}
        } catch (error) {
            return res.status(500).json({message:'Error registering user',error})
        }
    }
}