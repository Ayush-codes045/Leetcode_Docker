"use server"
import { prisma } from "@/lib/db";
import client from "@/lib/redis";
export async function compileCode(problemId:string,code: string,language:string,testCases: { input: string; output: string }[],userId:string) {
    try {
        const submissionId = await prisma.submission.create({
            data: {
                code,
                language,
                problemId: problemId,
                userId,
                status: "PENDING",
                testCases:{
                    create: testCases.map((testCase) => ({
                        input: testCase.input,
                        output: testCase.output,
                    })),
                }
            }
        })
        const key = `${userId}'${submissionId.id}'${problemId}`
        client.LPUSH("worker",key);
        return submissionId.id
    } catch (error) {
        console.log(error)
    }
}