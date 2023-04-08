import React, { useEffect, useRef, useState } from 'react'
import {LinkIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid'
import Message from './Message'
import useAuth from '@/hooks/useAuth'
import ChatsList from './ChatsList'
import { DocumentData, Timestamp, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import TimeAgo from 'timeago-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectMainPage, setMainPageTitle } from '@/store/slices/mainPageSlice'
import { selectChatInfo, setMessages } from '@/store/slices/chatInfoSlice'
import { selectUserChats, setUserChats } from '@/store/slices/userChatsSlice'

function Chat() {

    const { user } = useAuth()

    const mainPage = useSelector(selectMainPage)
    const chatInfo = useSelector(selectChatInfo)
    const userChats = useSelector(selectUserChats)
    const dispatch = useDispatch()

    // const [messagesInfo, setMessagesInfo] = useState<any[]>([]);
    // const [userChats, setUserChats] = useState<unknown[]>();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        user?.uid && onSnapshot(doc(db, 'userChats', user?.uid!), (userChatsDoc: any) => {
            dispatch(setUserChats(userChatsDoc.data())) 

            // // Add lastRead time to doc(db, "userChats", user?.uid!) using serverTimestamp() without deleting the other data!!
            // setDoc(doc(db, "userChats", user?.uid!), {
            //     [chatInfo.user?.uid]: {
            //         lastRead: serverTimestamp(),
            //     }
            // }, {merge: true})
        })
        
    }, [db])
    
    useEffect(() => {
        getUsersCombinedId() && onSnapshot(doc(db, 'chats', getUsersCombinedId()!), (usersChatsDoc: DocumentData) => {
            dispatch(setMessages(usersChatsDoc.data()?.messages))
        })
    }, [db, chatInfo.user])

    useEffect(() => {
        scrollToBottom()
    }, [chatInfo.messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.lastElementChild?.scrollIntoView()
        }
    }

    function getUsersCombinedId() {
        if(!user?.uid || !chatInfo.user?.uid) return null

        const combinedId =
                    user?.uid! > chatInfo.user.uid
                    ? user.uid + chatInfo.user.uid
                    : chatInfo.user.uid + user.uid

        return combinedId
    }

    async function createChat(msg:string) {
        
        const combinedId = getUsersCombinedId()

        if(!combinedId) return

        const userChatsSnap = await getDoc(doc(db, "chats", combinedId))

        if(!userChatsSnap.exists()) {
            console.log("inside")
            await setDoc(doc(db, "chats", combinedId), { messages: [] })
            
            await setDoc(doc(db, "userChats", user?.uid!), {
            }, {merge: true})
            
            await setDoc(doc(db, "userChats", chatInfo.user?.uid!), {
            }, {merge: true})

            await updateDoc(doc(db, "userChats", user?.uid!), {
                [chatInfo.user?.uid]: {
                    userInfo: {
                    uid: chatInfo.user?.uid,
                    displayName: chatInfo.user?.displayName,
                    photoURL: chatInfo.user?.photoURL,
                    email: chatInfo.user?.email,
                    },
                    
                    lastMessage: {
                        username: user?.displayName,
                        content: msg,
                        time: serverTimestamp(),
                    },
                    lastRead: serverTimestamp(),
                }
            })


            await updateDoc(doc(db, "userChats", chatInfo.user?.uid), {
                [user?.uid!]: {
                    userInfo: {
                    uid: user?.uid,
                    displayName: user?.displayName,
                    photoURL: user?.photoURL,
                    email: user?.email,
                    },  
                    
                    lastMessage: {
                        username: user?.displayName,
                        content: msg,
                        time: serverTimestamp(),
                    },
                    lastRead: serverTimestamp(),
                }
            })
        }
    }

    async function getChatMessages() {
        const usersChatMessagesSnap = await getDoc(doc(db, "chats", getUsersCombinedId()!))

        // if(!usersChatMessagesSnap.exists()) return null

        return usersChatMessagesSnap.data()
    }

    async function sendMessage(message: string) {
        await createChat(message)

        let chatMessages = await getChatMessages() ?? { messages:[] }

        chatMessages.messages.push({
            username: user?.displayName,
            message: message,
            timestamp: Timestamp.now(),
        })

        await updateDoc(doc(db, "userChats", chatInfo.user?.uid), {
            [user?.uid!]: {
                userInfo: {
                uid: user?.uid,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
                email: user?.email,
                },  
                
                lastMessage: {
                    username: user?.displayName,
                    content: message,
                    time: serverTimestamp(),
                },
                lastRead: serverTimestamp(),
            }
        })

        await updateDoc(doc(db, "userChats", user?.uid!), {
            [chatInfo.user?.uid!]:{
                userInfo: {
                uid: chatInfo.user?.uid,
                displayName: chatInfo.user?.displayName,
                photoURL: chatInfo.user?.photoURL,
                email: chatInfo.user?.email,
                },  
                
                lastMessage: {
                    username: user?.displayName,
                    content: message,
                    time: serverTimestamp(),
                },

                lastRead: serverTimestamp(),
            }
        })

        await setDoc(doc(db, "chats", getUsersCombinedId()!), chatMessages)
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // track input field's state
        setInput(event.target.value)
    }

    function handleAdd() {
        // add message
        if(input != '' && input != null) {
            sendMessage(input)
            
            setInput('')
        }
    }

    return (
        <div className='flex flex-row w-full justify-center'>

            { userChats && Object.entries(userChats)[0] &&
            <div className={`
            flex flex-row
            lg:min-w-[20rem] lg:w-[25rem]
            ${chatInfo.user ? "hidden" : "w-[35rem] max-w-[30rem] lg:w-[35rem] lg:max-w-[30rem]"}
            lg:inline
            `}>
                <ChatsList />
            </div>
            }
            
            { chatInfo.user &&
            <div className='flex flex-row w-full'>
                <div className='line'/>
                <div className={`flex flex-col w-full  ${ !userChats && 'sm:w-[calc(100vw-90px)] lg:w-[calc(100vw-410px)]'}`}>
                    <div className='flex flex-row justify-between content-cente p-5'>
                        <div className='flex flex-col self-center'>
                            <h1 className={`text-xl font-bold ${chatInfo.user?.isGroup && 'text-3xl font-bold'}`}>
                                { chatInfo.user?.displayName}
                            </h1>
                            <div className='text-sm my-1 space-x-1 flex flex-row'>
                                <p> Last seen </p>
                                <p>
                                    <TimeAgo datetime={chatInfo.user.lastSeen?.toDate()}/>
                                    ...
                                </p>
                            </div>
                        </div>
                        
                        <img src={chatInfo.user.photoURL} width="600" height="600" title={chatInfo.user?.displayName ?? ''}
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
                        <div ref={messagesEndRef} className='flex flex-col
                        overflow-y-scroll h-[calc(100vh-295px)] sm:h-[calc(100vh-15.3rem)] scrollbar-hide
                        px-5 py-2
                        '>
                            {chatInfo.messages && chatInfo.messages.map((m) => <Message username={m.username} message={m.message} />)}
                        </div>

                        <div className='
                        flex flex-row
                        items-center
                        justify-between
                        m-3
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
            </div>
            }
            
        </div>
    )
}

export default Chat