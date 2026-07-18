import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.ts";

export async function settings(req, res) {
    try {
        const data = req.body;
        const userId = req.user.id; 
        if (data.change === "username") {
            const username = data.username;
            if (!username) {
                return res.status(400).json({ message: "Username is required" });
            }

            const userExist = await prisma.user.findUnique({
                where: { username: username }
            });
            if (userExist) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            const updatedUser = await prisma.user.update({
                where: { id: userId }, 
                data: { username: username }
            });

            return res.status(200).json({ message: "Username updated successfully", user: updatedUser });
        }
        if (data.change === "avatar") {
            const avatar = data.avatar;
            if (!avatar) {
                return res.status(400).json({ message: "Avatar data is required" });
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId }, 
                data: { avatarSeed: avatar }
            });

            return res.status(200).json({ message: "Avatar updated successfully", user: updatedUser });
        }
        if (data.change === 'password') {
            const password = data.password;
            if (!password) {
                return res.status(400).json({ message: "Password credentials needed" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });
            const user=await prisma.user.findUnique({
            where:{id:userId}
            })


            return res.status(200).json({ message: "Password updated successfully" ,user:user});
        }
    

    } catch (error) {
        console.error("Settings Update Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
