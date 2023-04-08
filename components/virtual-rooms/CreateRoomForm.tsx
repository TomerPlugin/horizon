import React, { useEffect, useState } from 'react'
import VirtualRoom from './VirtualRoom'
import { useDispatch, useSelector } from 'react-redux';
import { selectMainPage, setMainPageComponent, setMainPageTitle } from '@/store/slices/mainPageSlice';
import { selectVirtualRoom, setId, setTitle } from '@/store/slices/virtualRoomSlice';

function CreateRoomForm() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
      return () => {
          setMainPageTitle('Virtual Room: Create Room Form')
      }
  })

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }

  function createNewRoom() {
    if(input == '') return

    dispatch(setTitle(input))
    dispatch(setMainPageComponent(<VirtualRoom />))
  }

  return (
    <div className='w-full h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col w-[20rem] rounded-md outline-main-color space-y-6 border-2 p-8 border-none'>
                <input value={input} onChange={handleInputChange}
                onKeyDown={event => event.key === 'Enter' && createNewRoom}
                type="text" placeholder='Enter room title...'
                className='bg-transparent p-3 focus:outline-main-color  rounded-md' />

                <button className='p-3 bg-color-2nd clickable'
                        onClick={createNewRoom}>
                    <p>Create Room</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateRoomForm