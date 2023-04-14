import Head from 'next/head'
import useAuth from '../hooks/useAuth'
import Chat from '@/components/chat/Chat'
import TopBar from '@/components/addons/TopBar'
import SideBar from '@/components/addons/SideBar'
import Loading from '@/components/addons/Loading'
import { useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import Login from '@/components/login/Login'
import Contacts from '@/components/Contacts'
import VirtualRooms from '@/components/virtual-rooms/VirtualRooms'
import { useSelector } from 'react-redux'
import { selectMainPage } from '@/store/slices/mainPageSlice'

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

        <div className='flex flex-col-reverse bg-main-color sm:h-full sm:flex-row'>
          <SideBar />
          <div className='line' />
        </div>

        <section className='flex flex-col h-full w-full'>

          <div className='flex flex-col bg-main-color w-full'>
            <TopBar />
            <div className='line' />
          </div>

          { mainPage.component }

        </section>
      </div>
    </div>
  )
}
