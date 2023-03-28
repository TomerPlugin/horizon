import React, { useState } from 'react'

function VideosDisplaySection() {
    const [userCount, setUserCount] = useState(2)
    
  return (
    <div className={`flex flex-col space-y-5 items-center ${userCount > 2 ? "" : "sm:flex-row sm:space-x-5 sm:space-y-0"} sm:w-full sm:h-full h-full w-full`}>
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
                <video className='video'></video>
            </div>
        }
        <div className='main-participant w-full h-full sm:w-fit rounded-xl bg-color-2nd'>
            <video className='video'></video>
        </div>
    </div>
  )
}

export default VideosDisplaySection