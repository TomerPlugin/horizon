import useAuth from '@/hooks/useAuth';
import {fetchSignInMethodsForEmail} from 'firebase/auth'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { SiGmail } from 'react-icons/si';
import { collection, getDocs } from "firebase/firestore"; 

interface Inputs {
  username:  string | null
}

// function GmailForm({isLogin, setIsLogin}: {isLogin:boolean, setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}) {
  function GmailForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const { googleSignIn } = useAuth()
  
  const onSubmit: SubmitHandler<Inputs> = async () => {
    googleSignIn()
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='
    w-full
    mt-[-5rem]
   text-black
    rounded-md
    flex flex-col
    '>
      <h1 className='text-4xl font-bold mb-8 '>Login</h1>

      {/* <div className='flex flex-col py-4 space-y-4'>
        <label className='inline-block'>
          <input {...register('username', {required:true})} type="username" placeholder="Enter a username..." className='input' />
          {errors.username && <p className=' p-1 text-[13px] font-normal text-orange-700'>
            Please enter a valid username.
            </p>}
        </label>
      </div>  */}
      
      {
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
          Login With Google
        </button>}

      {/* {
        isLogin ?
        (<div className='text-sm mt-3 font-lignt text-gray-500 flex flex-row'>
          <p>New to Horizon?</p>
          <p onClick={() => setIsLogin(false)}
          className='text-black font-bold cursor-pointer px-1 mx-1 rounded hover:shadow-md hover:bg-slate-200'>
            Register now
          </p>
        </div>)
        :
        (<div className='text-sm mt-3 font-lignt text-gray-500 flex flex-row space-x-[5px]'>
          <p>Already have an account?</p>
          <p onClick={() => setIsLogin(true)} className='text-black font-bold cursor-pointer px-1 mx-1 rounded hover:shadow-md hover:bg-slate-200'>
              Login now
          </p>
        </div>)} */}
    </form>
  )
}

export default GmailForm