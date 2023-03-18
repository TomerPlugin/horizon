import React from 'react'

function ContactChatSnippet() {
  return (
    <div className='
    flex flex-row
    justify-between
    items-center
    py-2 px-2 my-1
    clickable
    hover:shadow
    '>
        <div className='flex flex-row '>
            <img src="/favicon.ico" className='h-10 w-10 mr-2 p-0.5 rounded-full' />
            <div className='flex flex-col'>
                <p className='text-sm font-semibold'>Tomer Haik</p>
                <p className='text-sm font-light'>Hey, Whats up?</p>
            </div>
        </div>
        <p className='text-xs font-extralight'>
            12h
        </p>
    </div>
  )
}

export default ContactChatSnippet