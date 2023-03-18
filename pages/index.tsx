import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import SideBar from '@/components/SideBar'
import TopBar from '@/components/TopBar'
import Chat from '@/components/Chat'
import ChatsList from '@/components/ChatsList'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='bg-main-color h-screen'>
      <Head>
        <title>Home - Horizon</title>
        <link rel="icon" href="\favicon.ico" />
      </Head>

      <div className='flex flex-col-reverse sm:flex-row'>

        <div className='flex flex-col-reverse sm:flex-row'>
          <SideBar />
          <div className='line' />
        </div>

        <section className='flex flex-col w-full'>

          <div className='flex flex-col'>
            <TopBar />
            <div className='line' />
          </div>

          <div className='flex flex-row'>
          
            <div className='flex flex-row'>
              <ChatsList />
              <div className='line hidden md:inline' />
            </div>

            <Chat />
          </div>

        </section>
      </div>
    </div>
  )
}
