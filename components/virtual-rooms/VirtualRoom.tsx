import React, { useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'

function VirtualRoom() {
    const [inviteCode, setInviteCode] = useState("WQDW2F-FWFQ76D-FVE3CE7-EEV6MNV")

  return (
    <div className='w-full h-full flex flex-row'>
        <div className='flex flex-col w-full m-5 '>
            <div className='w-full mb-5 flex flex-row space-x-3 '>
                <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
            </div>
            <div className='main-participant w-full h-full rounded-xl bg-color-2nd'>

            </div>
            <div className='flex mt-5 justify-between items-center'>
                <div className='flex items-center
                                bg-color-2nd
                                p-3 space-x-3
                                rounded-md
                                text-xs font-medium
                                clickable'
                    onClick={() => navigator.clipboard?.writeText(inviteCode)}>
                    <p className='truncate w-28'>{inviteCode}</p>
                    <div className='h-full line outline-gray-300/70 dark:outline-gray-7 00' />
                    <ClipboardIcon className='h-6 w-6'/>   
                </div>
                <div className='flex'>
                    {
                        true ?
                        <BsMic
                        title='Mute'
                        onClick={() => {}}
                        className={`clickable-icon ${false && 'icon-bg-hover'}`}
                        />
                        :
                        <BsMicMute
                        title='Unmute'
                        onClick={() => {}}
                        className={`clickable-icon ${true && 'icon-bg-hover'}`}
                        />
                    }

                    {
                        true ?
                        <VideoCameraIcon
                        onClick={() => {}}
                        className={`clickable-icon ${false && 'icon-bg-hover'}`}
                        />
                        :
                        <VideoCameraSlashIcon
                        onClick={() => {}}
                        className={`clickable-icon ${false && 'icon-bg-hover'}`}
                        />
                    }

                    <Squares2X2Icon 
                    onClick={() => {}}
                    className={`clickable-icon ${false && 'icon-bg-hover'}`}
                    />

                </div>
                <div className='rounded-md cursor-pointer p-3
                            bg-red-500 hover:bg-red-500/90 active:bg-red-600   
                            dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-600/60
                            transition duration-75 ease-in-out'>
                    <p className='text-white'>Leave Room</p>
                </div>
            </div>
        </div>
        <div className='virtualroom-chat hidden lg:inline m-5 ml-0 bg-color-2nd rounded-2xl w-5/12'>

        </div>
    </div>
  )
}

export default VirtualRoom