import { Head } from 'next/document'
import React from 'react'

function UsernameInput() {
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
                    <div className='w-full text-black rounded-md flex flex-col'>
                        <h1 className='text-4xl font-bold mb-8 '>Login</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UsernameInput