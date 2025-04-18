"use client";
import React from 'react'
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
interface DescriptionProps {
    problem: { 
      id: string; 
      title: string; 
      description: string; 
      difficulty: string; 
      testCases: { id: string; input: string; output: string; problemId: string|null; createdAt: Date; updatedAt: Date; }[]; 
    } | null | undefined; 
}
const Description = ({problem}:DescriptionProps) => {
  const data = problem?.description.split('<br />')
  return (
    <div className='px-5 py-6'>
      <div className=' flex  items-center'>
        <h1 className='text-xl font-bold p-5 px-3'>{problem?.title}</h1>
        <h2><Badge variant="outline" className={`${problem?.difficulty==="Easy"?"bg-green-300":problem?.difficulty==="Medium"?"bg-yellow-300":problem?.difficulty==="Hard"?"bg-red-300":"white"} text-black`} >{problem?.difficulty}</Badge>
        </h2>
      </div>
      <div className='px-7 '>
        <div>
          {data?.map((item, index) => {
            return <p className={`${item.startsWith("Exam")?"text-xl font-semibold py-4":""}   ${item.startsWith("Input:-")||item.startsWith("output:-")?"px-2 py-1 font-medium":""} ${index==0?"text-lg":""}`} key={index}>{item}</p>
          })}
        </div>
      </div>
    </div>
  )
}

export default Description