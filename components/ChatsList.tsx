import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ChatSnippet from './ChatSnippet'
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { db } from '@/firebase';
import useAuth from '@/hooks/useAuth';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function ChatsList({ userChats, setChatInfo }: {
    userChats: any,
    setChatInfo:Dispatch<SetStateAction<any>>}) {

    const [searchInput, setSearchInput] = useState('')
    const { user } = useAuth()

    async function getUserById(id: string) {
        const userDoc = await getDoc(doc(db, "users", id))
        return userDoc.data()
    }

    async function handleSelect(selectedUserId: any) {
        setChatInfo(await getUserById(selectedUserId))
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(event.target.value)
    }

  return (
    <div className='text-sm w-full'>
        <div className='m-8'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-base w-32'>
                    My Chats
                </h1>
                <div className='
                    flex flex-row
                    items-center
                    bg-color-2nd
                    rounded-lg
                    w-full max-w-[15rem]
                    pl-4'>
                        
                    <input
                        value={searchInput}
                        onChange={handleSearchChange}
                        type="input"
                        placeholder="Search for contacts"
                        className="
                        w-full
                        pr-1
                        bg-color-2nd
                        outline-none
                        " />
                        
                    <div className='clickable p-3'>
                        <MagnifyingGlassIcon className=' h-5 w-5'/>
                    </div>
                </div>
            </div>
            <div className='flex flex-row'>
                <button className='btn'>
                    Read    
                </button>
                <button className='btn'>
                    Unread
                </button>
            </div>
            
            <div className={`
            h-[calc(100vh-15rem)
            flex flex-col
            overflow-y-scroll
            scrollbar-hide`}>
                { userChats &&
                    Object.entries(userChats).map((chat: any) =>
                    String(chat[1].userInfo?.displayName).toLowerCase().includes(String(searchInput).toLowerCase()) &&
                    <div onClick={() => handleSelect(chat[0])}>
                        <ChatSnippet username={chat[1].userInfo?.displayName}
                                    profilePic={chat[1].userInfo?.photoURL}
                                    lastMessage={chat[1]?.lastMessage}
                                    lastSeen={chat[1].userInfo?.lastSeen}
                                    isUnread={false}
                        />
                    </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default ChatsList