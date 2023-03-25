import React from 'react'
import VirtualRoom from './VirtualRoom'

function JoinRoomForm({setSection}: {setSection:any}) {
  return (
    <div className='w-full h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col rounded-md outline-main-color space-y-6 border-2 p-8 border-none'>
                <input type="text" placeholder='Enter room invite code...'
                className='bg-transparent p-3 focus:outline-main-color  rounded-md' />

                <button className='p-3 bg-color-2nd clickable'
                        onClick={() => setSection(<VirtualRoom />)}>
                    <p>Join Room</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default JoinRoomForm