import React from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { RxGithubLogo } from 'react-icons/rx'
import { signIn } from 'next-auth/react'

const AuthOptions = () => {
    const signInWithProvider= async ({provider}:{provider:"google"|"github"}) => {
        if(provider === 'google'){
          await signIn('google')
        }
        else if(provider === 'github'){
          await signIn('github')
        }
    }
  return (
    <div className="w-full flex justify-between items-center ">
    <Button onClick={()=>signInWithProvider({provider:"google"})} className=" px-16 bg-slate-300 hover:text-slate-100 text-slate-900 flex gap-2"><FcGoogle size={'24'}/><p>Google</p></Button>
    <Button onClick={()=>signInWithProvider({provider:"github"})} className="px-16 bg-slate-300 hover:text-slate-100 text-slate-900 flex gap-2"><RxGithubLogo size={'24'}/><p>Github</p></Button>
  </div>
  )
}

export default AuthOptions