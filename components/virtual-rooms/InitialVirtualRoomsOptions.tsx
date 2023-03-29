import { PlusCircleIcon } from '@heroicons/react/24/outline'
import React, { useEffect } from 'react'
import { CgPassword } from 'react-icons/cg'
import JoinRoomForm from './JoinRoomForm'
import CreateRoomForm from './CreateRoomForm'
import { useDispatch, useSelector } from 'react-redux'
import { setMainPageTitle, setMainPageComponent, selectMainPage } from '@/store/slices/mainPageSlice'

function InitialVirtualRoomsOptions() {
    const mainPage = useSelector(selectMainPage)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     return () => {
    //         setMainPageTitle('Virtual Room: Create Room Form')
    //     }
    // })

  return (
    <div className='w-full h-full flex justify-center'>
            <div className='flex flex-col justify-center'>
                <div className='flex rounded-xl border-2 border-gray-700'>
                    <div className='flex flex-col font-semibold space-y-4 items-center clickable sm:p-7 p-4 py-6'
                        onClick={() => dispatch(setMainPageComponent(<CreateRoomForm />))}>
                        <p> Create New Room </p>
                        <PlusCircleIcon
                        className='h-10 w-10'
                        />
                    </div>
                    <div className='line'/>
                    <div className='flex flex-col font-semibold space-y-4 items-center clickable sm:p-7 p-4 py-6'
                        onClick={() => dispatch(setMainPageComponent(<JoinRoomForm />))}>
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