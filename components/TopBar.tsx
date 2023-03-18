import React from 'react'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, BellIcon} from '@heroicons/react/24/solid'

function TopBar() {
  return (
    <header>
        <div className='flex flex-row items-center'>
            <ChatBubbleOvalLeftEllipsisIcon className='h-10 w-10 p-1.5 mr-1'/>
            <h2 className='font-semibold'>Messaging</h2>
        </div>

        <div className='flex flex-row'>
            <div className='
            hidden sm:flex sm:flex-row
            items-center
            bg-color-2nd
            rounded-lg
            px-3
            '>
                <input type="text" placeholder="Search" className="
                w-40
                pr-1
                bg-color-2nd
                outline-none
                " />
                <div>
                    <MagnifyingGlassIcon className='h-5 w-5'/>
                </div>
            </div>

            <BellIcon className='h-10 w-10 mx-2 p-1
            clickable-icon'/>

            <img src="/favicon.ico" className='
            h-10 w-10 mx-1 p-0.5 rounded-full
            outline-none
            outline
            hover:outline-gray-400
            active:outline-gray-600
            dark:active:outline-white
            transition ease-in-out duration-200
            cursor-pointer'
            />
        </div>
    </header>
  )
}

export default TopBar