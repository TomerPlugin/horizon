import React, { Dispatch, SetStateAction, use, useEffect, useRef, useState } from 'react'
import {LinkIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid'
import Message from './Message'
import useAuth from '@/hooks/useAuth'
import ChatsList from './ChatsList'
import { DocumentData, Timestamp, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import TimeAgo from 'timeago-react'

// let initialMessagesInfo = [{"username":"Tomer Haik", "message":"Are you ready for the next lesson?"}]

function Chat({mainSection, setMainSection, chatInfo, setChatInfo}:
    {mainSection:string, setMainSection:Dispatch<SetStateAction<string>>,
    chatInfo:any | null, setChatInfo:Dispatch<SetStateAction<any>>}) {

    const { user } = useAuth()

    const [messagesInfo, setMessagesInfo] = useState<any[]>([]);
    const [userChats, setUserChats] = useState<any[]>();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        user?.uid && onSnapshot(doc(db, 'userChats', user?.uid!), (userChatsDoc: any) => {
            setUserChats(userChatsDoc.data())
            // console.log(userChatsDoc.data())
        })
        
    }, [db])
    
    useEffect(() => {
        chatInfo && onSnapshot(doc(db, 'chats', getUsersCombinedId(chatInfo)!), (userChatsDoc: any) => {
            setMessagesInfo(userChatsDoc.data()?.messages)
        })
    }, [db, chatInfo])

    useEffect(() => {
        scrollToBottom()
    }, [messagesInfo]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.lastElementChild?.scrollIntoView()
        }
    }

    function getUsersCombinedId(otherUser: any) {
        if(!user?.uid || !otherUser?.uid) return null

        const combinedId =
                    user?.uid! > otherUser.uid
                    ? user.uid + otherUser.uid
                    : otherUser.uid + user.uid

        return combinedId
    }

    async function createChat(otherUser:DocumentData, msg:string) {
        
        const combinedId = getUsersCombinedId(otherUser)

        if(!combinedId) return

        const userChatsSnap = await getDoc(doc(db, "chats", combinedId))

        if(!userChatsSnap.exists()) {
            console.log("inside")
            await setDoc(doc(db, "chats", combinedId), { messages: [] })
            
            await setDoc(doc(db, "userChats", user?.uid!), {
            }, {merge: true})
            
            await setDoc(doc(db, "userChats", otherUser?.uid!), {
            }, {merge: true})

            await updateDoc(doc(db, "userChats", user?.uid!), {
                [otherUser?.uid]: {
                    userInfo: {
                    uid: otherUser?.uid,
                    displayName: otherUser?.displayName,
                    photoURL: otherUser?.photoURL,
                    email: otherUser?.email,
                    },
                    
                    lastMessage: {
                        username: user?.displayName,
                        content: msg
                    },
                }
            })


            await updateDoc(doc(db, "userChats", otherUser?.uid), {
                [user?.uid!]: {
                    userInfo: {
                    uid: user?.uid,
                    displayName: user?.displayName,
                    photoURL: user?.photoURL,
                    email: user?.email,
                    },  
                    
                    lastMessage: {
                        username: user?.displayName,
                        content: msg
                    },
                }
            })
        }
    }

    async function getChatMessages(otherUser: any) {
        const usersChatMessagesSnap = await getDoc(doc(db, "chats", getUsersCombinedId(otherUser)!))

        // if(!usersChatMessagesSnap.exists()) return null

        return usersChatMessagesSnap.data()
    }

    async function sendMessage(otherUser: any, message: string) {
        createChat(otherUser, message)

        let chatMessages = await getChatMessages(otherUser) ?? { messages:[] }

        chatMessages.messages.push({
            username: user?.displayName,
            message: message,
            timestamp: Timestamp.now(),
        })

        await updateDoc(doc(db, "userChats", otherUser?.uid), {
            [user?.uid!]: {
                userInfo: {
                uid: user?.uid,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
                email: user?.email,
                },  
                
                lastMessage: {
                    username: user?.displayName,
                    content: message
                },
            }
        })

        await updateDoc(doc(db, "userChats", user?.uid!), {
            [otherUser?.uid!]:{
                userInfo: {
                uid: otherUser?.uid,
                displayName: otherUser?.displayName,
                photoURL: otherUser?.photoURL,
                email: otherUser?.email,
                },  
                
                lastMessage: {
                    username: user?.displayName,
                    content: message
                },
            }
        })

        await setDoc(doc(db, "chats", getUsersCombinedId(otherUser)!), chatMessages)
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // track input field's state
        setInput(event.target.value)
    }

    function handleAdd() {
        // add message
        if(input != '' && input != null) {
            sendMessage(chatInfo, input)
            
            setInput('')
        }
    }

    return (
        <div className='flex flex-row h-full w-full'>

            { userChats && Object.entries(userChats)[0] &&
            <div className='
            flex flex-row
            min-w-[20rem]
            w-[25rem]
            hidden lg:inline
            '>
                <ChatsList userChats={userChats} setChatInfo={setChatInfo} />
            </div>
            }

            <div className='line h-full hidden md:inline' />
            
            { chatInfo &&
            <div className='flex flex-col w-full'>

                <div className='flex flex-row justify-between content-center p-8 p-5'>
                    <div className='flex flex-col self-center'>
                        <h1 className={`text-xl font-bold ${chatInfo?.isGroup && 'text-3xl font-bold'}`}>
                            { chatInfo?.displayName}
                        </h1>
                        <div className='text-sm my-1 space-x-1 flex flex-row'>
                            <p> Last seen </p>
                            <p>
                                <TimeAgo datetime={ chatInfo.lastSeen?.toDate()}/>
                                ...
                            </p>
                        </div>
                    </div>
                    
                    <img src={chatInfo.photoURL!} width="600" height="600" title={chatInfo?.displayName ?? ''}
                    className='
                    h-12 w-12 mx-1 rounded-full
                    outline-none
                    outline
                    hover:outline-gray-400
                    active:outline-gray-600
                    dark:active:outline-white
                    transition ease-in-out duration-200
                    cursor-pointer'
                    />
                </div>
            
                <div className='line' /> 

                <div className='flex flex-col'>
                    <div ref={messagesEndRef} className='flex flex-col w-full 
                    overflow-y-scroll h-[calc(100vh-295px)] sm:h-[calc(100vh-17rem)] scrollbar-hide
                    px-5 py-2
                    '>
                        {messagesInfo && messagesInfo.map((m) => <Message username={m.username} message={m.message} />)}
                    </div>

                    <div className='
                    flex flex-row
                    items-center
                    justify-between
                    p-3
                    '>
                        <LinkIcon className='h-10 w-10 p-3 clickable' />
                        <input value={input}
                            onKeyDown={event => event.key === 'Enter' && handleAdd()}
                            onChange={handleChange}
                            placeholder="Write a message...  "
                            className='
                            bg-transparent
                            w-full
                            p-2 px-3
                            mx-3
                            text-sm
                            outline outline-[1px]
                            outline-black/40
                            dark:outline-white/40
                            focus:outline-black
                            dark:focus:outline-white
                            rounded-lg
                        ' />
                        <PaperAirplaneIcon onClick={handleAdd} className='h-10 w-10 p-3 clickable' />
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}

export default Chat