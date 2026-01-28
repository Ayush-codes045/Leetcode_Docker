//import AddProblem from '@/components/AddProblem'
import React from 'react'

import dynamic from 'next/dynamic';

// Dynamically import with no SSR
const AddProblem = dynamic(() => import('@/components/AddProblem'), {
  ssr: false,
});

const page = () => {
  return (
    <AddProblem />
  )
}

export default page