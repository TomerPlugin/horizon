import { PlusCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { CgPassword } from 'react-icons/cg'
import JoinRoomForm from './JoinRoomForm'
import CreateRoomForm from './CreateRoomForm'

function InitialVirtualRoomsOptions({setSection}: {setSection:any}) {
  return (
    <div className='w-full h-full flex justify-center'>
            <div className='flex flex-col justify-center'>
                <div className='flex rounded-xl border-2 border-gray-700'>
                    <div className='flex flex-col font-semibold space-y-4 items-center clickable p-7'
                        onClick={() => setSection(<CreateRoomForm setSection={setSection}/>)}>
                        <p> Create New Room </p>
                        <PlusCircleIcon
                        className='h-10 w-10'
                        />
                    </div>
                    <div className='line'/>
                    <div className='flex flex-col font-semibold space-y-4 items-center clickable p-6'
                        onClick={() => setSection(<JoinRoomForm setSection={setSection}/>)}>
                        <p> Join Existing Room </p>
                        <CgPassword
                        className='h-10 w-10'
                        />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default InitialVirtualRoomsOptions