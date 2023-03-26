import React, { useEffect, useState } from 'react'
import VirtualRoom from './VirtualRoom'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { CgPassword } from 'react-icons/cg'
import InitialVirtualRoomsOptions from './InitialVirtualRoomsOptions'
import JoinRoomForm from './JoinRoomForm'

function VirtualRooms() {
    const [isInRoom, setIsInRoom] = useState(false)
    const [section, setSection] = useState<any>()
    
    useEffect(() => {
        setSection(<VirtualRoom title=''/>)
        // setSection(<InitialVirtualRoomsOptions setSection={setSection}/>)
    }, [])
    
    return (
        <div className='w-full h-full'>
            {section}
        </div>
    )
}

export default VirtualRooms