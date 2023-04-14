import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
  email: string
  password: string
}

function SignForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='
    sm:w-[400px] w-full
   text-black
    rounded-md
    p-5 mt-20
    flex flex-col
    '>
      <h1 className='text-4xl font-bold mb-5'>Sign Up</h1>
      <div className='flex flex-col py-4 space-y-4'>

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
       bg-color-2nd
       outline-none
        bg-[#603dc1]
        active:bg-[#613DC1]/60
        active:shadow-lg
        '>
        Sign Up
      </button>
      
      <div className='text-sm mt-3 font-lignt text-gray-500 flex flex-row space-x-[5px]'>
        <p>Already have an account?</p>
        <a href="/login" className='text-black font-bold'>
            Login now
        </a>
      </div>
    </form>
  )
}

export default SignForm