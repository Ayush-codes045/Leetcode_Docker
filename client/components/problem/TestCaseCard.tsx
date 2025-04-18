import { testCases } from '@prisma/client'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

const TestCaseCard = ({item,index}:{item:testCases,index:number}) => {
  return (
    <Card className={`p-2 flex justify-center items-center flex-col m-2 w-42 ${item.status=="ACCEPTED"?"bg-green-400":"bg-rose-300"}`}>
       <div>
        {`Test Case ${index+1}`}
      </div>
        <CardHeader  className=' text-lg text-slate-800'>
                {item.status}
        </CardHeader>
        <CardDescription >
            {item.status=="ACCEPTED"?`${item.input}=>${item.output}`:``}
        </CardDescription>
    </Card>
  )
}

export default TestCaseCard
