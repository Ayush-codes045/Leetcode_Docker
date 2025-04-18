
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <div className='bg-slate-900 text-slate-100 flex justify-between items-center px-20 py-10'>
            <div>
                <div className='text-2xl font-semibold'>Leetcode</div>
                <div className='text-md font-medium'>Master Coding Question</div>
                <div className=' font-medium'>Join the most comprehensive coding question preparation platform</div>
            </div>
            <div>
                <div className='flex  gap-4'>
                    <Link href={"/"} className='text-md hover:underline font-semibold'>Get Started</Link>
                    <Link href={"/"} className='text-md hover:underline font-semibold'>Learn More</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer