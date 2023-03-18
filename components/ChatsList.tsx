import React from 'react'
import ContactChatSnippet from './ContactChatSnippet'

function ChatsList() {
  return (
    <div className='
    h-full 
    text-sm
    max-w-[20rem]
    w-[30rem]
    hidden md:inline
    '>
        <div className='m-8'>
            <h1 className=''>
                My Chats
            </h1>
            <div className='flex flex-row'>
                <button className='btn'>
                    Read    
                </button>
                <button className='btn'>
                    Unread
                </button>
            </div>
            <div className='flex flex-col
            overflow-y-scroll h-[calc(100vh-15rem)]
            scrollbar-hide'>
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
                <ContactChatSnippet />
            </div>
        </div>
    </div>
  )
}

export default ChatsList