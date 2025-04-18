import React from 'react'
import ProblemCard from './ProblemCard'
import { getProblem } from '@/actions/getProblem'

const LatestProblem =async ({full}:{full:string}) => {
  const problem = await getProblem(full)
  return (
    <div className='px-10 py-4'>
        <div className='text-3xl font-bold'>Latest Problem</div>
        <div className=' flex flex-wrap p-5 gap-5'>
          {
            problem?.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))
          }
        </div>
    </div>
  )
}

export default LatestProblem