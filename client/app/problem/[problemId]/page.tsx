import { getProblemById } from "@/actions/getProblemById"
import ProblemPage from "@/components/problem/index"
const Page =async ({params}:{params:{problemId:string}}) => {
  return (
    <ProblemPage id={params.problemId} />
  )
}

export default Page