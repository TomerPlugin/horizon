import useAuth from '@/hooks/useAuth'
import React from 'react'
import TimeAgo from 'timeago-react'

function ChatSnippet({username, profilePic, lastMessage, isUnread}:
  {username:string, profilePic:string, lastMessage:any, isUnread: boolean}) {
  const { user } = useAuth()

  return (
    <div className='
    flex flex-row
    justify-between
    py-2 px-2 my-1
    clickable
    hover:shadow
    '>
        <div className='flex flex-row items-center w-full'>
            <img src={profilePic} className='h-10 w-10 mr-2 rounded-full' />
            <div className='flex flex-col'>
                <p className='text-base font-semibold'>{username}</p>
                <div className='flex space-x-1'>
                  <p className='text-sm font-medium'>
                    {`${lastMessage?.username.split(' ')[0] == user?.displayName?.split(' ')[0] ? "You" : lastMessage?.username.split(' ')[0]}: `}
                  </p>
                  <p className='text-sm font-light text-ellipsis overflow-hidden'>{lastMessage?.content}</p>
                </div>
            </div>
        </div>
        <div className='flex flex-row space-x-2 items-center'>
          <p className='text-xs font-extralight'>
            {/* {lastMessage.time?.toDate() && <TimeAgo datetime={lastMessage.time?.toDate()} />} */}
          </p>
          { isUnread && <div className='w-2.5 h-2.5 bg-sky-400 rounded-full shadow' />}
        </div>
    </div>
  )
}

export default ChatSnippet