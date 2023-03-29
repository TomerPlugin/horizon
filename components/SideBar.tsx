
import React, { Dispatch, FC, SetStateAction } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsFillBoxFill } from 'react-icons/bs'
import { IoMdContacts } from 'react-icons/io'
import { ArrowSmallLeftIcon, ChatBubbleOvalLeftEllipsisIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Chat from './Chat'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { selectMainPage, setMainPageComponent, setMainPageTitle } from '@/store/slices/mainPageSlice'
import Contacts from './Contacts'
import VirtualRooms from './virtual-rooms/VirtualRooms'
import { selectVirtualRoom } from '@/store/slices/virtualRoomSlice'
import { selectChatInfo } from '@/store/slices/chatInfoSlice'

let isDarkMode = true;

function SideBar() {

    const [modeIcon, setModeIcon] = useState(getModeIcon);
    const mainPage = useSelector(selectMainPage)
    const virtualRoom = useSelector(selectVirtualRoom)
    const chatInfo = useSelector(selectChatInfo)
    const dispatch = useDispatch()

    function handleBtnClick(page: string) {
        dispatch(setMainPageTitle(page))

        if(page === 'Chat'){dispatch(setMainPageComponent(<Chat />)) }
        else if(page === 'Contacts') dispatch(setMainPageComponent(<Contacts />))
        else if(page === 'Virtual Rooms') dispatch(setMainPageComponent(<VirtualRooms />))
        else if(page === 'Options') dispatch(setMainPageComponent(<></>))
    }

    function getModeIcon() {
        return isDarkMode ? <MoonIcon title="Change To Dark Mode" className='clickable-icon' onClick={changeMode} />
            : <SunIcon title="Change To Light Mode" className='clickable-icon' onClick={changeMode} />
    }

    function changeMode() { 
        // setIsDarkMode(!isDarkMode);
        isDarkMode = !isDarkMode
        document?.documentElement.classList.toggle('dark')
        setModeIcon(getModeIcon)
    }

    return (
        <div className='dragable
        flex sm:flex-col flex-row
        justify-between
        bg-main-color
        sm:p-5 p-2
        '>
            
            <ArrowSmallLeftIcon
            title='Return'
            onClick={() => handleBtnClick('')}
            className={`
            clickable-icon
            ${mainPage.title == 'Chat' && chatInfo.user ? "inline" : "hidden"}
            lg:hidden
            `}/>

            <GiHamburgerMenu
            title='Options'
            onClick={() => handleBtnClick('Options')}
            className={`
            clickable-icon
            ${mainPage.title === "Options" && 'icon-bg-hover'}
            ${mainPage.title == 'Chat' && chatInfo.user ? "hidden" : "inline"}
            lg:inline
            `}/>
            

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
                title='Virtual Rooms'
                onClick={() => handleBtnClick('Virtual Rooms')}
                className={`clickable-icon ${mainPage.title.includes("Virtual Rooms") && 'icon-bg-hover'}`}
                />
                
                <IoMdContacts
                title='Contacts'
                onClick={() => handleBtnClick('Contacts')}
                className={`clickable-icon ${mainPage.title == "Contacts" && 'icon-bg-hover'}`}
                />

                <ChatBubbleOvalLeftEllipsisIcon
                title='Chat'
                onClick={() => handleBtnClick('Chat')}
                className={`clickable-icon ${mainPage.title == "Chat" && 'icon-bg-hover'}`}
                />
            </div>

            { modeIcon }
        </div>
    )
}

export default SideBar;