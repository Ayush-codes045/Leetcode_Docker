"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button'
import { useRouter } from "next/navigation"
interface ProblemCardProps {

   problem: {
    title: string,
    description: string,
    difficulty: string
    authorId: string
    id: string
   }
}
const ProblemCard = ({problem}:ProblemCardProps) => {
    const router = useRouter()
return (
    <Card className='w-[40vw]'>
        <CardHeader>
            <CardTitle>{problem.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription>
                {problem.description.split('<br />')[0]}
            </CardDescription>
        </CardContent>
        <CardFooter>
            <Button onClick={()=>router.push(`/problem/${problem.id}`)} className='font-bold py-2 px-6 rounded'>
                Solve
            </Button>
        </CardFooter>
    </Card>
)
}

export default ProblemCard