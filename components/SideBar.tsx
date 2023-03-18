
import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ChatBubbleOvalLeftEllipsisIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

let isDarkMode = true;

function SideBar() {
    // const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className='
        flex sm:flex-col flex-row
        justify-between
        sm:h-screen
        sm:p-5 p-2
        '>
            <GiHamburgerMenu className='clickable-icon'/>

            <div className='
            h-full
            flex flex-row
            sm:flex-col 
            justify-center
            sm:space-y-2
            '>
                <BsFillBoxFill className='clickable-icon' />
                <IoMdContacts className='clickable-icon' />
                <ChatBubbleOvalLeftEllipsisIcon className='clickable-icon' />
            </div>

            { changeMode() }
        </div>
    )
}

function changeMode() { 
    // setIsDarkMode(!isDarkMode);
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode)
    return (isDarkMode ? <MoonIcon className='clickable-icon' onClick={changeMode} /> : <SunIcon className='clickable-icon' onClick={changeMode} />)
}

export default SideBar;