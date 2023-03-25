import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Head from 'next/head'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import LoginForm from '@/components/LoginForm'
import RegistrationForm from '@/components/RegistrationForm';
import { SiGmail } from 'react-icons/si';
import { CgPassword } from 'react-icons/cg';
import GmailForm from '@/components/GmailForm';

function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [isGmail, setIsGmail] = useState(true)
    
    return (
        <div className='bg-white text-black h-screen w-screen p-5'>
            <Head>
                <title>Horizon</title>
                <link rel="icon" href="images\whale-tail.png" />
            </Head>

            <div className='flex flex-row items-cente space-x-4 lg:mx-52'>
                <img src="/images/whale-tail.png" className='w-10 h-10' />
                <h1 className='hidden md:inline text-2xl font-light '>HORIZON</h1>
            </div>

            <div className='flex flex-row w-full justify-center'>
                <div className='flex flex-col mt-[calc((100vh-500px)/2)] w-full max-w-[450px] sm:w-[450px]'>   
                    <div className='flex flex-col w-full px-5'>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login