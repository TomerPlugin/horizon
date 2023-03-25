import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ChatSnippet from './ChatSnippet'
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { db } from '@/firebase';
import useAuth from '@/hooks/useAuth';

function ChatsList({ userChats, setChatInfo }: {
    userChats: any,
    setChatInfo:Dispatch<SetStateAction<any>>}) {
    
    const { user } = useAuth()

    async function getUserById(id: string) {
        const userDoc = await getDoc(doc(db, "users", id))
        return userDoc.data()
    }

    async function handleSelect(selectedUserId: any) {
        setChatInfo(await getUserById(selectedUserId))
    }

  return (
    <div className='text-sm'>
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
            
            <div className={`
            h-[calc(100vh-15rem)
            flex flex-col
            overflow-y-scroll
            scrollbar-hide`}>
                { userChats &&
                    Object.entries(userChats).map((chat: any) =>
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