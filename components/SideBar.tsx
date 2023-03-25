
import React, { Dispatch, FC, SetStateAction } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ChatBubbleOvalLeftEllipsisIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Chat from './Chat'

let isDarkMode = true;

function SideBar({mainSection, setMainSection}: {mainSection:string, setMainSection:Dispatch<SetStateAction<string>>}) {
    const [modeIcon, setModeIcon] = useState(getModeIcon);

    function getModeIcon() {
        return isDarkMode ? <MoonIcon className='clickable-icon' onClick={changeMode} />
            : <SunIcon className='clickable-icon' onClick={changeMode} />
    }

    function changeMode() { 
        // setIsDarkMode(!isDarkMode);
        isDarkMode = !isDarkMode
        document?.documentElement.classList.toggle('dark')
        setModeIcon(getModeIcon)
    }

    return (
        <div className=' dragable
        flex sm:flex-col flex-row
        justify-between
        sm:h-screen
        sm:p-5 p-2
        '>
            <GiHamburgerMenu
            title='Options'
            onClick={() => setMainSection('Options')}
            className={`clickable-icon ${mainSection === "Options" && 'icon-bg-hover'}`}
            />

            <div className='
            h-full
            flex flex-row
            sm:flex-col 
            justify-center
            space-x-2
            sm:space-x-0
            sm:space-y-2
            '>
                <BsFillBoxFill
                title='Contacts'
                onClick={() => setMainSection('Games')}
                className={`clickable-icon ${mainSection === "Games" && 'icon-bg-hover'}`}
                />
                
                <IoMdContacts
                title='Contacts'
                onClick={() => setMainSection('Contacts')}
                className={`clickable-icon ${mainSection == "Contacts" && 'icon-bg-hover'}`}
                />

                <ChatBubbleOvalLeftEllipsisIcon
                title='Chat'
                onClick={() => setMainSection('Chat')}
                className={`clickable-icon ${mainSection == "Chat" && 'icon-bg-hover'}`}
                />
            </div>

            { modeIcon }
        </div>
    )
}

export default SideBar;