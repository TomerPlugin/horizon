import useAuth from '@/hooks/useAuth'
import React from 'react'

function Message({username, message}: {username:string, message:string}) {
  const { user } = useAuth()

  if(username == user?.displayName)
  {
    return (
      <div className='w-full flex flex-row justify-end'>
        <div className='message bg-[#97DFFC]/80 dark:bg-sky-400/60 dark:shadow-white/20'>
            <p className='text-main-color text-sm'>
              {message}
            </p>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className='message'>
            <p className='text-main-color text-xs font-bold'>
              ~ {username}
            </p>
            <p className='text-main-color text-sm'>
              {message}
            </p>
        </div>
      </div>
    )
  }
}

export default Message