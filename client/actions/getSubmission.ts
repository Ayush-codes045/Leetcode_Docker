"use server";
import { prisma } from "@/lib/db";

export async function getSubmission(userId: any,problemId:string) {
    try {
        const submission =await prisma.submission.findMany({
            where:{
                problemId:problemId,
                userId:userId.session
            },
            orderBy: {
                createdAt: "desc", // optional
              },
        })
        return submission
    } catch (error) {
        console.log(error)
    }
}