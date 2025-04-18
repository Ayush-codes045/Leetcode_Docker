"use server"
import { prisma } from "@/lib/db";
import { RegisterTypes } from "@/types";
import bcryptjs from "bcryptjs";
import { signIn } from "next-auth/react";
interface RegisterProps {
    username: string;
    email: string;
    password: string;
}

export async function Register(data:RegisterProps) {
    try {
        const res =  RegisterTypes.safeParse(data)
        if (!res.success) {
            return {success:false, error:res.error}
        }
        const {email,username,password} = res.data
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data:{
                email,
                username,
                password:hashedPassword
            }
        })
    } 
    catch (error) {
        console.log(error)
    }
}