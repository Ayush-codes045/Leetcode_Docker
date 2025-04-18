"use server";
import { prisma } from "@/lib/db";

export async function getProblem(full:string) {
    try {
        const allProblem =await prisma.problem.findMany({
            orderBy:{
                createdAt:"desc"
            },
            take:full === 'full' ? 10 : 4
        })
        return allProblem
    } catch (error) {
        console.log(error)
    }
}