import useAuth from '@/hooks/useAuth'
import React from 'react'
import {IoLogOutOutline} from 'react-icons/io5'

function Options() {
    const { logout, user} = useAuth()

  return (
        <div className=''>
            <div className='mx-5'>
                <div className={`
                flex flex-col
                overflow-y-scroll
                items-center
                scrollbar-hide
                h-[calc(100vh-8rem)]
                sm:h-[calc(100vh-5rem)]
                space-y-10
                py-4
                `}>
                    <div className='account flex flex-col sm:flex-row w-full max-w-xl space-y-6 sm:space-y-0 rounded-xl p-2 sm:p-10 justify-center sm:justify-between items-center'>
                        <div className='h-full flex flex-col justify-center pt-6'>
                            <img src={user?.photoURL!}
                            className='rounded-full h-[10rem]
                                        outline-none shadow-xl
                                        hover:outline-gray-400
                                        active:outline-gray-600
                                        dark:active:outline-white
                                        transition ease-in-out duration-300
                                        cursor-pointer' />
                        </div>
                        <div className='flex flex-col w-full max-w-[15rem] space-y-5'>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Your Username</label>
                                <input disabled={true} className="bg-main-color border-slate-500 dark:border-slate-600 border-2
                                                dark:bg-slate-800 bg-slate-300 placeholder-black font-semibold shadow-lg
                                                dark:placeholder-slate-400 rounded-lg w-full p-2" placeholder={user?.displayName!} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Your Email</label>
                                <input disabled={true} className="bg-main-color border-slate-500 dark:border-slate-600 border-2
                                                dark:bg-slate-800 bg-slate-300 placeholder-black font-semibold shadow-lg
                                                dark:placeholder-slate-400 rounded-lg w-full p-2" placeholder={user?.email!} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full max-w-sm sm:max-w-lg space-y-6'>
                        <div onClick={() => logout()}
                            className='
                            h-20
                            flex flex-row
                            p-3 px-8
                            justify-between
                            items-center
                            max-w-xl w-full
                            clickable
                            hover:bg-red-500/90
                            dark:hover:bg-red-500/90
                            hover:text-white
                            shadow-xl
                            rounded-xl'>
                                <h1 className='text-2xl sm:text-3xl font-bold'>Logout </h1>
                                <IoLogOutOutline size={40}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options