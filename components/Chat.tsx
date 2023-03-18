import React from 'react'
import {LinkIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid'
import Message from './Message'

function Chat() {
  return (
    <div className='flex flex-col w-full'>

        <div className='flex flex-row justify-between content-center sm:p-8 p-5'>
            <div>
                <h1 className='text-2xl font-medium'>
                    Tomer Haik
                </h1>
                <h3 className='text-sm my-1'>
                    Last seen 2 hours ago...
                </h3>
            </div>
            
            <img src="/favicon.ico" className='
            h-10 w-10 mx-1 my-2 p-0.5 rounded-full
            outline-none
            outline
            hover:outline-gray-400
            active:outline-gray-600
            dark:active:outline-white
            transition ease-in-out duration-200
            cursor-pointer'
            />
        </div>
        
        <div className='line' /> 

        <div className='flex flex-col'>
            <div className='flex flex-col
            overflow-y-scroll h-[calc(100vh-295px)] sm:h-[calc(100vh-17rem)] scrollbar-hide
            p-5
            '>
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
            </div>

            <div className='
            flex flex-row
            items-center
            justify-between
            p-3
            '>
                <LinkIcon className='h-10 w-10 p-3 clickable' />
                <input type="text" placeholder="Write a message...  " className='
                bg-transparent
                w-full
                p-2 px-3
                mx-3
                text-sm
                outline outline-[1px]
                outline-black/40
                dark:outline-white/40
                focus:outline-black
                dark:focus:outline-white
                rounded-lg
                ' />
                <PaperAirplaneIcon className='h-10 w-10 p-3 clickable' />
            </div>

        </div>
    </div>
  )
}

export default Chat