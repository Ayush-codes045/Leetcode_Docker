"use server"

import { prisma } from "@/lib/db"

export async function getCompiledTestCases(submissionId: string) {
    try {
        const res = await prisma.testCases.findMany({
            where: {
                submissionId
            }
        })
        return res
    } catch (error) {
        console.log(error)
    }
}