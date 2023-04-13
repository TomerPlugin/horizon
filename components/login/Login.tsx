import React, { useState, useEffect } from 'react'
import { SubmitHandler, useForm } from "react-hook-form";
import Head from 'next/head'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import LoginForm from '@/components/login/LoginForm'
import RegistrationForm from '@/components/login/RegistrationForm';
import { SiGmail } from 'react-icons/si';
import { CgPassword } from 'react-icons/cg';
import GmailForm from '@/components/login/GmailForm';
import { BsKey } from "react-icons/bs"
import useAuth from '@/hooks/useAuth';
import ParticlesBackground from '../ParticlesBackground';


function Login() {
    // const [isLogin, setIsLogin] = useState(true)
    // const [isGmail, setIsGmail] = useState(true)
    const { googleSignIn } = useAuth()
  
    const submit = async() => {
        googleSignIn()
    }
    
    return (
        <div className='text-black h-screen w-screen p-5'>
            <Head>
                <title>Horizon</title>
                <link rel="icon" href="images\whale-tail.png" />
            </Head>

            <ParticlesBackground />

            <div className='flex flex-row items-cente space-x-4 lg:mx-52'>
                <img src="/images/whale-tail.png" className='w-10 h-10' />
                <h1 className='hidden md:inline text-2xl font-light '>HORIZON</h1>
            </div>

            <div className='flex flex-row w-full h-full justify-center'>
                <div className='flex flex-col justify-center align items-center w-full h-[80vh] max-w-[450px] sm:w-[450px]'>
                    <div className='w-max h-max p-7 rounded-full cursor-pointer group bg-white border-violet-500 border-2
                                ring-1 ring-slate-900/5 shadow-xl focus:animate-ping hover:animate-spin-slow transition-colors ease-in-out
                                hover:bg-violet-600 active:bg-violet-700 active:outline-none active:ring-4 active:ring-violet-300'
                                onClick={submit}>
                        <BsKey className='fill-violet-500 group-hover:fill-white transition-colors ease-in-out' size={50}></BsKey>
                    </div>
                    {/* <div className='flex flex-col w-full px-5'>
                        <div className='flex flex-row'>
                        {
                            isGmail ? <GmailForm />
                            : (isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <RegistrationForm setIsLogin={setIsLogin}/>)
                        }
                        </div>
                    </div>
                    
                    <div className='flex flex-row space-x-5 items-center justify-center m-4'>
                        <SiGmail onClick={() => {setIsGmail(true)}}
                        className={`h-12 w-12 clickable-icon ${isGmail ? 'bg-gray-300' : ''}`}/>
                        
                        <CgPassword onClick={() => setIsGmail(false)}
                        className={`h-12 w-12 clickable-icon ${!isGmail ? 'bg-gray-300' : ''}`} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Login