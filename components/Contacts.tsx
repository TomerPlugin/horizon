import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DocumentData, collection, doc, getDocs, onSnapshot, query } from "firebase/firestore"; 
import { db } from '@/firebase';
import TimeAgo from 'timeago-react';
import useAuth from '@/hooks/useAuth';

function Contacts({mainSection, setMainSection, chatInfo, setChatInfo}:
    {mainSection:string, setMainSection:Dispatch<SetStateAction<string>>,
    chatInfo:DocumentData, setChatInfo:Dispatch<SetStateAction<DocumentData>>}) {

    const [usersList, setUsersList] = useState<any[]>(getUsers())
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

    return (
        <div className='text-sm'>
            <div className='mx-5'>
                <div className={`
                flex flex-col
                items-center
                overflow-y-scroll
                scrollbar-hide
                h-[calc(100vh-8rem)]
                sm:h-[calc(100vh-5rem)]
                `}>
                    {
                        usersList &&
                        usersList.map((u) =>
                            <div onClick={() => handleUserSelect(u)} className='
                            h-max w-full
                            flex flex-row
                            max-w-xl
                            p-3 pr-4 m-1
                            justify-between
                            items-center
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