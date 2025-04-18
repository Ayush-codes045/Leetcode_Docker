"use server"
import { prisma } from "@/lib/db";

export async function checkCompilation(id:string | undefined){
    try {
        if(!id) return null
        const res = await prisma.submission.findUnique({
            where:{
                id:id
            }
        })
        if(!res) return null
        return res?.status
    } catch (error) {
        console.log(error)
    }
}