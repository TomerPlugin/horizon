import React, { useEffect, useState } from 'react'
import VirtualRoom from './VirtualRoom'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { CgPassword } from 'react-icons/cg'
import InitialVirtualRoomsOptions from './InitialVirtualRoomsOptions'
import JoinRoomForm from './JoinRoomForm'
import { useDispatch, useSelector } from 'react-redux'
import { selectMainPage, setMainPageTitle } from '@/store/slices/mainPageSlice'
import { selectVirtualRoom } from '@/store/slices/virtualRoomSlice'

function VirtualRooms() {
    const mainPage = useSelector(selectMainPage)
    const dispatch = useDispatch()
    const virtualRoom = useSelector(selectVirtualRoom)
    
    function getVirtualRoomSection() {
        if (virtualRoom.isActive) return <VirtualRoom />
        else if(mainPage.title.includes("Virtual Rooms")) return <InitialVirtualRoomsOptions />
    }
    
    return (
        <div className='w-full h-full'>
            {getVirtualRoomSection()}
        </div>
    )
}

export default VirtualRooms