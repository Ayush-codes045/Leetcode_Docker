import { prisma } from "@/lib/db";

export async function getProblemById(problemId: string) {
    try {
        const data = await prisma.problem.findUnique({
            where: {
                id: problemId
            },
            select:{
                id:true,
                title:true,
                description:true,
                difficulty:true,
                testCases:true,
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
}