import useAuth from '@/hooks/useAuth';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { SiGmail } from 'react-icons/si'
import { CgPassword } from 'react-icons/cg'

interface Inputs {
  username:  string,
  email: string
  password: string
}

function LoginForm({setIsLogin}: {setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const { signUp } = useAuth()
  const [ isGmail, setIsGmail ] = useState(false)
  
  const onSubmit: SubmitHandler<Inputs> = async ({username, email, password}) => {
    signUp(username, email, password)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='
    w-full
  text-black
    rounded-md
    flex flex-col
    '>
      <h1 className='text-4xl font-bold mb-5'>Register</h1>

      <div className='flex flex-col py-4 space-y-4'>
        <label className='inline-block'>
          <input {...register('username', {required:true})} type="text" placeholder="Enter a username..." className='input' />
          {errors.email && <p className=' p-1 text-[13px] font-normal text-orange-700'>
            Please enter a valid username.
            </p>}
        </label>
        <label className='inline-block'>
          <input {...register('email', {required:true})} type="email" placeholder="Enter your email..." className='input' />
          {errors.email && <p className=' p-1 text-[13px] font-normal text-orange-700'>
            Please enter a valid email.
            </p>}
        </label>
        <label className='inline-block'>
        <input {...register('password', {required:true})} type="password" placeholder="Enter your password..." className='input' />
        {errors.password && <p className=' p-1 text-[13px] font-normal text-orange-700'>
            Please enter a valid password.
            </p>}
        </label>
      </div>
      
      <button className='
      text-white
      font-semibold
      w-full
      py-3 p-4
      rounded-md
      outline-none
        bg-[#603dc1]
        active:bg-[#613DC1]/60
        active:shadow-lg
        '>
        Register
      </button>
      
      <div className='text-sm mt-3 font-lignt text-gray-500 flex flex-row space-x-[5px]'>
        <p>Already have an account?</p>
        <p onClick={() => setIsLogin(true)}
        className='text-black font-bold cursor-pointer px-1 mx-1 rounded hover:shadow-md hover:bg-slate-200'>
          Login now
        </p>
      </div>
    </form>
  )
}

export default LoginForm