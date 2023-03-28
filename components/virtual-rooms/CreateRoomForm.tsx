import React, { useState } from 'react'
import VirtualRoom from './VirtualRoom'

function CreateRoomForm({setSection}: {setSection:any}) {
  const [title, setTitle] = useState('');

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  function createNewRoom(title: string) {
    setSection(<VirtualRoom mode='create' initialRoomId='' title={title} />)
  }

  return (
    <div className='w-full h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col w-[20rem] rounded-md outline-main-color space-y-6 border-2 p-8 border-none'>
                <input value={title} onChange={handleInputChange}
                onKeyDown={event => event.key == 'Enter' && createNewRoom(title)}
                type="text" placeholder='Enter room title...'
                className='bg-transparent p-3 focus:outline-main-color  rounded-md' />

                <button className='p-3 bg-color-2nd clickable'
                        onClick={() => createNewRoom(title)}>
                    <p>Create Room</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateRoomForm