import { LinkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import React, { ChangeEvent, useState } from 'react'

function VirtualRoomChat() {
    const [isInGroupChat, setIsInGroupChat] = useState(true)
    const [input, setInput] = useState('')


    function handleAdd(event: any): void {
        throw new Error('Function not implemented.')
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error('Function not implemented.')
    }

  return (
    <div className='virtualroom-chat hidden lg:inline m-5 ml-0 bg-color-2nd rounded-2xl w-5/12'>
        <div className='flex flex-col h-full p-4'>
            <div className='flex h-16 bg-main-color space-x-2 rounded-lg p-2 text-md text-black dark:text-white'>
                <button className={`flex w-full
                                rounded-lg
                                justify-center items-center
                                ${ isInGroupChat ? 'bg-sky-300 dark:bg-sky-600 dark:hover:bg-sky-500' : 'clickable' }
                                cursor-pointer`}
                            onClick={() => setIsInGroupChat(true)}>
                    <p>Group</p>
                </button>
                <button className={`flex w-full
                                rounded-lg
                                justify-center items-center
                                ${ !isInGroupChat ? 'bg-sky-300 dark:bg-sky-600 hover:dark:bg-sky-500' : 'clickable'}
                                cursor-pointer`}
                        onClick={() => setIsInGroupChat(false)}>
                    <p>Personal</p>
                </button>
            </div>

            <div className='flex flex-col h-full'>
                
            </div>

            <div className='flex flex-row items-center justify-between bg-main-color rounded-lg p-2'>
                <input value={input}
                    onKeyDown={event => event.key === 'Enter' && handleAdd}
                    onChange={handleInputChange}
                    placeholder="Write a message...  "
                    className='
                    bg-transparent
                    w-full
                    p-2 px-3
                    mx-3
                    text-sm
                    outline-none' />
                <PaperAirplaneIcon onClick={handleAdd} className='h-10 w-10 p-3 clickable' />
            </div>
        </div>
    </div>
  )
}

export default VirtualRoomChat