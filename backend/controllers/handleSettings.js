import prisma from "../lib/prisma.ts";
import bcrypt from "bcryptjs";
export const handleSettings=async(req,res)=>{
    
    try {
        const {username,email,currentPassword,newPassword,savingEmail,savingUsername,savingAvatar,avatarSeed}=req.body
        const userId=req.user.id;
        if(savingUsername){
            if(!username || username.trim==""){
                return res.status(400).json({message:'Username cannot be empty'})
            }
            const existingUsername=await prisma.user.findUnique({
                where:{username:username}
            })
            if(existingUsername && existingUsername.id !==userId){
                return res.status(400).json({message:'username already exists'})
            }
            const updatedUser=await prisma.user.update({
                where:{
                    id:userId,
                },
                data:{
                    username:username,
                }
            })
            return res.status(200).json({
                message:'Successful',
                username:username
            })
        }
        if(savingEmail){
            if(!email||!currentPassword || !newPassword){
                return res.status(400).json({message:'Inlcude all credentials'})
            }
            let currentUser=await prisma.user.findUnique({
                where:{id:userId}
            })
            if(!currentUser){
                return res.status(404).json({message:'User not found'})
            }
            let correctPassword=await bcrypt.compare(currentPassword,currentUser.password)
            if(!correctPassword){
                return res.status(400).json({message:'Incorect CurrentPassword'})
            }
            let changedPassword=await bcrypt.hash(newPassword,10)
            const updatedUser=await prisma.user.update({
                where:{
                    userId:userId
                },
                data:{
                    password:changedPassword,
                    active:true                    
                }
            })
        }
        
        // avatar....
        if(savingAvatar){
            if(!avatarSeed){
                return res.status(400).json({mesage:'No avatar style selected'})
            }
            const updatedUser=await prisma.user.update({
                where:{id:userId},
                data:{
                    avatarSeed:avatarSeed
                }
            });
            return res.status(200).json({
                message:'Avatar updated',
                user:updatedUser
            })
        }
        return req.status(400).json({message:'Invalid action'})
        
    } catch (err) {
        console.log('Setting processing error',err)
        return res.status(500).json({message:'Something went wrong'})
    }

}
export const getUser=async()=>{
    try {
        const userId=req.user.id;
        const User=await prisma.user.findUnique({
            where:{id:userId}
        })
        if(user.rows.length==0){
            return res.status(404).json({message:'User not found'})
        }
        return res.status(200).json(User)
    } catch (error) {
        return res.status(500).json({message:'Error fetching user details'})
    }
}