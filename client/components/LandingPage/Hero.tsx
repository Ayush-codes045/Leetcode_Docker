import Image from 'next/image'
import React from 'react'
import heroImage from '@/public/hero-Image.jpeg'
import { Button } from '../ui/button'
const Hero = () => {
  return (
    <div className=' flex justify-between items-center px-20 py-10'>
        <div>
            <div className='text-6xl font-bold'>Leetcode</div>
            <div className='text-2xl text-slate-500 font-semibold'>Master Coding Interview</div>
            <div className='text-lg text-slate-500 font-medium'>Join the most comprehensive coding interview preparation platform</div>
            <div className='flex gap-5 mt-5'>
                <Button className='bg-slate-900 text-slate-100 text-md hover:bg-slate-500 hover:text-slate-100 font-semibold px-5 py-2 rounded-md'>Get Started</Button>
                <Button className='bg-slate-100 text-slate-900 text-md hover:bg-slate-500 hover:text-slate-100 font-semibold px-5 py-2 rounded-md'>Learn More</Button>
            </div>
        </div>
        <div>
            <Image src={heroImage} alt="hero" className=' w-[30vw] rounded-md' />
        </div>
    </div>
  )
}

export default Hero