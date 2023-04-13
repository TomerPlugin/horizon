import React, { useEffect, useState } from 'react'
import VirtualRoom from './VirtualRoom'
import { setMainPageComponent, setMainPageTitle } from '@/store/slices/mainPageSlice'
import { useDispatch } from 'react-redux'
import { setId } from '@/store/slices/virtualRoomSlice'
import { SubmitHandler, useForm } from 'react-hook-form'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
interface Inputs {
  roomId:  string | null
}

function JoinRoomForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()
  const dispatch = useDispatch()

  useEffect(() => {
      return () => {
          setMainPageTitle('Virtual Room: Join Room Form')
      }
  })

  async function isRoomExists(roomId: string) {
    const roomSnap = await getDoc(doc(db, "rooms", roomId))

    !roomSnap.exists() && setError("roomId", {message: "Room doesn't exists!"})

    return roomSnap.exists()
  }

  function joinRoom(roomId: string) {
    dispatch(setId(roomId))
    dispatch(setMainPageComponent(<VirtualRoom mode='join'/>))
  }

  const onSubmit: SubmitHandler<Inputs> = async({roomId}) => {
    roomId != null && roomId != "" && await isRoomExists(roomId) && joinRoom(roomId)
  }

  return (
    <div className='w-full h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <form onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col rounded-md outline-main-color space-y-6 border-2 p-8 border-none'
            >
              <div>
                <input {...register('roomId', {required:true})}
                type="text"
                placeholder='Enter room invite code...'
                className='bg-transparent p-3 focus:outline-main-color rounded-md' />
                
                {
                  errors.roomId && <p className='text-[15px] mt-3 font-normal text-orange-700'>
                    {errors.roomId?.message ? errors.roomId.message : "Please enter a valid room id."}
                  </p>
                }
              </div>
                
                <button className='p-3 bg-color-2nd clickable'>
                    <p>Join Room</p>
                </button>
            </form>
        </div>
    </div>
  )
}

export default JoinRoomForm