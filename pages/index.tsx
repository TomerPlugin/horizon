import Head from 'next/head'
import useAuth from '../hooks/useAuth'
import Chat from '@/components/Chat'
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'
import { useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import Login from '@/components/Login'
import Contacts from '@/components/Contacts'
import VirtualRooms from '@/components/virtual-rooms/VirtualRooms'
import { useSelector } from 'react-redux'
import { selectMainPage } from '@/store/slices/mainPageSlice'
import Loading from '@/components/Loading'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { loading, user } = useAuth()
  const [chatInfo, setChatInfo] = useState<DocumentData>()
  const mainPage = useSelector(selectMainPage)

  if(loading) return <Loading />
  else if(!user) return <Login />

  return (
    <div className='bg-main-color text-main-color h-screen'>
      <Head>
        <title>Home - Horizon</title>
        <link rel="icon" href="images\whale-tail.png" />
      </Head>

      <div className='flex flex-col-reverse h-full sm:flex-row'>

        <div className='flex flex-col-reverse sm:h-full sm:flex-row'>
          <SideBar chatInfo={chatInfo}
                  setChatInfo={setChatInfo}/>
          <div className='line' />
        </div>

        <section className='flex flex-col h-full w-full'>

          <div className='flex flex-col w-full'>
            <TopBar />
            <div className='line' />
          </div>

          { mainPage.component }

        </section>
      </div>
    </div>
  )
}
