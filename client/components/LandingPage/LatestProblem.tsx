import React from 'react'
import ProblemCard from './ProblemCard'
import { getProblem } from '@/actions/getProblem'

const LatestProblem = async ({ full }: { full: string }) => {
  const problem = await getProblem(full);
  return (
    <div className="px-6 md:px-10 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-3xl font-bold text-slate-900">Latest Problems</div>
          <p className="text-slate-600 text-sm">Pick a problem and start solving.</p>
        </div>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {problem?.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default LatestProblem