import React, { useState } from 'react'
import VirtualRoom from './VirtualRoom'

function JoinRoomForm({setSection}: {setSection:any}) {
  const [input, setInput] = useState('')

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }

  function isRoomExists() {
    return true
  }

  function joinRoom() {
    setSection(<VirtualRoom mode='join' initialRoomId={input} title='' />)
    
  }

  return (
    <div className='w-full h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col rounded-md outline-main-color space-y-6 border-2 p-8 border-none'>
                <input value={input} onChange={handleInputChange} type="text" placeholder='Enter room invite code...'
                className='bg-transparent p-3 focus:outline-main-color rounded-md' />

                <button className='p-3 bg-color-2nd clickable'
                        onClick={() => joinRoom()}>
                    <p>Join Room</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default JoinRoomForm