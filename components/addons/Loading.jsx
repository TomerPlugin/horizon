import React from 'react'
import { RingLoader } from 'react-spinners'
import { CircleLoader } from 'react-spinners'

function Loading() {
  return (
    <div className='flex flex-row justify-center w-screen h-screen py-[calc(100vh/2-60px)] bg-white'>
      <CircleLoader size={60} color="#000000" />
      {/* <RingLoader size={60} color="#000000" /> */}
    </div>
  )
}

export default Loading