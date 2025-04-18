"use server"
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
export const PublishAction = async (title: string,description:string, testCases: { input: string; output: string }[],userId:string,difficulty:string) => {
    try {
        const submission = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                authorId:userId,
                testCases: {
                    create: testCases.map((testCase) => ({
                        input: testCase.input,
                        output: testCase.output,
                    })),
            }}})
            revalidatePath('/')
        return submission
    } catch (error) {
        console.log(error)
    }
}