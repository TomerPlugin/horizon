import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DocumentData, collection, doc, getDocs, onSnapshot, query } from "firebase/firestore"; 
import { db } from '@/firebase';
import TimeAgo from 'timeago-react';
import useAuth from '@/hooks/useAuth';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function Contacts({mainSection, setMainSection, chatInfo, setChatInfo}:
    {mainSection:string, setMainSection:Dispatch<SetStateAction<string>>,
    chatInfo:DocumentData, setChatInfo:Dispatch<SetStateAction<DocumentData>>}) {

    const [usersList, setUsersList] = useState<any[]>(getUsers())
    const [searchInput, setSearchInput] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        onSnapshot(collection(db, 'users'), (usersSnapshot: any) => {
            let usersData: any = [];
            
            usersSnapshot.docs.map((userDoc: any) =>
                userDoc.data()?.uid != user?.uid && usersData.push(userDoc.data())
            )
    
            setUsersList(usersData)
        })
    }, [db])

    function getUsers(){
        const querySnapshot = getDocs(collection(db, "users"));
    
        let users: DocumentData[] = [];
        querySnapshot.then((res) => res.forEach((doc) => {
            doc.data().uid != users.push(doc.data())
        }));
    
        return users
    }

    function handleUserSelect(userSelected: any) {
        setChatInfo(userSelected)
        setMainSection('Chat')
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(event.target.value)
    }

    return (
        <div className=''>
            <div className='mx-5'>
                <div className={`
                flex flex-col
                overflow-y-scroll
                items-center
                scrollbar-hide
                h-[calc(100vh-8rem)]
                sm:h-[calc(100vh-5rem)]
                `}>
                    <div className='
                        flex flex-row
                        items-center
                        bg-color-2nd
                        rounded-lg
                        max-w-xl w-full
                        p-4 mb-3 mt-5'>
                            
                        <input
                            value={searchInput}
                            onChange={handleSearchChange}
                            type="input"
                            placeholder="Search for contacts..."
                            className="
                            w-full
                            pr-1
                            bg-color-2nd
                            outline-none
                            " />
                            
                        <div>
                            <MagnifyingGlassIcon className='h-5 w-5'/>
                        </div>
                    </div>

                    {
                        usersList &&
                        usersList.map((u) => 
                            String(u.displayName).toLowerCase().includes(String(searchInput).toLowerCase()) &&
                            <div onClick={() => handleUserSelect(u)} className='
                            h-max 
                            flex flex-row
                            p-3 pr-4 m-1
                            justify-between
                            items-center
                            max-w-xl w-full
                            clickable
                            hover:shadow-md
                            rounded-xl'>
                                <div className='flex flex-row '>
                                    <img src={u.photoURL} width="600" height="600" className='h-12 w-12 mr-2 rounded-full' />
                                    <h1 className='text-md sm:text-xl font-bold'>
                                        {u.displayName}
                                    </h1>
                                </div>

                                <p className='text-xs font-extralight'>
                                    <TimeAgo datetime={u.lastSeen?.toDate()}/>
                                </p>
                            </div>
                        )
                    }
                    
                </div>
            </div>
        </div>
      )
}

export default Contacts