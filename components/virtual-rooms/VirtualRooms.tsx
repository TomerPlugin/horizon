import React, { useEffect, useState } from 'react'
import VirtualRoom from './VirtualRoom'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { CgPassword } from 'react-icons/cg'
import InitialVirtualRoomsOptions from './InitialVirtualRoomsOptions'
import JoinRoomForm from './JoinRoomForm'
import { useDispatch, useSelector } from 'react-redux'
import { selectMainPage, setMainPageTitle } from '@/store/slices/mainPageSlice'

function VirtualRooms() {
    const mainPage = useSelector(selectMainPage)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(setMainPageTitle('Virtual Rooms'))
        }
    }, [])

    function getMainSection() {
        if(mainPage.title.includes('Virtual Rooms'))
            return mainPage.component
    }
    
    return (
        <div className='w-full h-full'>
            {getMainSection()}
        </div>
    )
}

export default VirtualRooms