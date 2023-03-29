import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ChatSnippet from './ChatSnippet'
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { db } from '@/firebase';
import useAuth from '@/hooks/useAuth';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/chatInfoSlice';

function ChatsList({ userChats}: { userChats: any}) {

    const [searchInput, setSearchInput] = useState('')
    const { user } = useAuth()
    const dispatch = useDispatch()

    async function getUserById(id: string) {
        const userDoc = await getDoc(doc(db, "users", id))
        return userDoc.data()
    }

    async function handleSelect(selectedUserId: any) {
        const selectedUser = await getUserById(selectedUserId)
        selectedUser && dispatch(setUser(selectedUser))
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
                        placeholder="Search for chats..."
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

                    <div key={chat[1].userInfo?.displayName} onClick={() => handleSelect(chat[0])}>
                        <ChatSnippet username={chat[1].userInfo?.displayName}
                                    profilePic={chat[1].userInfo?.photoURL}
                                    lastMessage={chat[1]?.lastMessage}
                                    // isUnread={chat[1]?.lastMessage?.time > chat[1]?.lastRead}
                                    isUnread={false}
                        />
                    </div>
                    )
                    // .sort((a:any, b:any) => {
                    //     if (a.props.lastMessage?.time && b.props.lastMessage?.time) {
                    //         return a.props.lastMessage?.time - b.props.lastMessage?.time
                    //     }
                    //     return 0
                    // })
                }
            </div>
        </div>
    </div>
  )
}

export default ChatsList