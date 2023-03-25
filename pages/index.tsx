import Head from 'next/head'
import useAuth from '../hooks/useAuth'
import Chat from '@/components/Chat'
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import Login from '@/components/Login'
import Contacts from '@/components/Contacts'
import VirtualRooms from '@/components/virtual-rooms/VirtualRooms'

// const inter = Inter({ subsets: ['latin'] })

const initialMainSection = 'Chat'

export default function Home() {
  const { loading, user } = useAuth()
  const [chatInfo, setChatInfo] = useState<DocumentData>()
  const [ mainSection, setMainSection ] = useState(initialMainSection)

  function getMainSection() {
    switch(mainSection) {
      case ('Chat'):
        return <Chat mainSection={mainSection} setMainSection={setMainSection}
        chatInfo={chatInfo!} setChatInfo={setChatInfo} />

      case ('Contacts'):
        return <Contacts mainSection={mainSection} setMainSection={setMainSection}
        chatInfo={chatInfo!} setChatInfo={setChatInfo} />

      case ('Virtual Rooms'):
        return <VirtualRooms />
    }
  }
  
  if(!user) return <Login />
  else if(!user.displayName) return 

  // useEffect(() => {    
  //   if(user) {
  //     setDoc(doc(db, "users", user.uid), {
  //       email: user.email,
  //       lastSeen: serverTimestamp(),
  //       photoUrl: user.photoURL
  //     }, { merge: true });
  //   }
  // })

  return (
    <div className='bg-main-color text-main-color h-screen'>
      <Head>
        <title>Home - Horizon</title>
        <link rel="icon" href="images\whale-tail.png" />
      </Head>

      <div className='flex flex-col-reverse h-full sm:flex-row'>

        <div className='flex flex-col-reverse sm:h-full sm:flex-row'>
          <SideBar mainSection={mainSection}
                  setMainSection={setMainSection}
                  chatInfo={chatInfo}
                  setChatInfo={setChatInfo}/>
          <div className='line' />
        </div>

        <section className='flex flex-col h-full w-full'>

          <div className='flex flex-col w-full'>
            <TopBar mainSection={mainSection}/>
            <div className='line' />
          </div>

          {
            getMainSection()
          }

        </section>
      </div>
    </div>
  )
}
