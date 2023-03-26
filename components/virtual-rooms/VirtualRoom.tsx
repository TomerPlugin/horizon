import React, { useEffect, useRef, useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'
import copy from 'copy-to-clipboard'

// let localStream;
// let remoteStream;

function VirtualRoom({title}:{title:string}) {
    const [inviteCode, setInviteCode] = useState("WQDW2F-FWFQ76D-FVE3CE7-EEV6MNV")
    const [isVideoCamOn, setIsVideoCamOn] = useState(true)
    const [isMicOn, setIsMicOn] = useState(false)
    const [userCount, setUserCount] = useState(1)
    const [localStream, setLocalStream] = useState<any>()

    const mainVideoRef = useRef<any>()
    const secondVideoRef = useRef<any>()

    useEffect(() => {
        getStream()
    }, [mainVideoRef, isMicOn, isVideoCamOn])

    async function getStream() {
        navigator.mediaDevices.getUserMedia({
            video:isVideoCamOn, audio:isMicOn
        }).then(stream => {
            let video = mainVideoRef.current
            // secondVideoRef.current.srcObject = stream
            // secondVideoRef.current.play()
            video.srcObject = stream
            video.play()
        }).catch(err => {
            console.error(err)
        })
    }

    function switchMicState() {
        setIsMicOn(!isMicOn)
    }

    function switchVideoCamState() {
        setIsVideoCamOn(!isVideoCamOn)
    }

  return (
    <div className='w-full h-full flex flex-row'>
        <div className={`flex flex-col w-full m-5 `}>
            <div className={`flex flex-col space-y-5 ${userCount > 2 ? "" : "sm:flex-row sm:space-x-5 sm:space-y-0"} sm:w-full sm:h-full h-full w-full`}>
                {
                    userCount > 2 ?
                    <div className='w-full flex flex-row space-x-3 justify-center'>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                    </div>
                    : userCount > 1 &&
                    <div className='w-full h-full sm:w-fit rounded-xl bg-color-2nd'>
                        <video ref={secondVideoRef} className='video'></video>
                    </div>
                }
                <div className='main-participant w-full h-full sm:w-fit rounded-xl bg-color-2nd'>
                    <video ref={mainVideoRef} className='video'></video>
                </div>
            </div>
            <div className='flex mt-5 justify-between items-center'>
                <div className='flex items-center
                                bg-color-2nd
                                p-3 space-x-3
                                rounded-md
                                text-xs font-medium
                                clickable'
                    onClick={() => copy(inviteCode)}>
                    <p className='truncate w-16 sm:w-20'>{inviteCode}</p>
                    <div className='h-full line outline-gray-300/70 dark:outline-gray-7 00' />
                    <ClipboardIcon className='h-6 w-6'/>   
                </div>
                <div className='flex space-x-2'>
                    {
                        isMicOn ?
                        <BsMic
                        title='Mute'
                        onClick={switchMicState}
                        className={`clickable-icon`}
                        />
                        :
                        <BsMicMute
                        title='Unmute'
                        onClick={switchMicState}
                        className={`clickable-icon bg-red-500 hover:bg-red-400 dark:hover:bg-red-400 active:bg-red-600 dark:active:bg-red-600 text-white`}
                        />
                    }

                    {
                        isVideoCamOn ?
                        <VideoCameraIcon
                        onClick={switchVideoCamState}
                        className={`clickable-icon `}
                        />
                        :
                        <VideoCameraSlashIcon
                        onClick={switchVideoCamState}
                        className={`clickable-icon bg-red-500 hover:bg-red-400 dark:hover:bg-red-400 active:bg-red-600 dark:active:bg-red-600 text-white`}
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