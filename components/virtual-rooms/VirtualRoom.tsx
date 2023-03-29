import React, { useEffect, useRef, useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import copy from 'copy-to-clipboard'
import { CollectionReference, DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { off } from 'process'
import { setMainPageTitle } from '@/store/slices/mainPageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { clearVirtualRoom, selectVirtualRoom, setId, setIsActive, setIsMicActive, setIsWebcamActive, setPeerConnection } from '@/store/slices/virtualRoomSlice'

// let localStream;
// let remoteStream;

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
}

function VirtualRoom({mode}:{ mode:string }) {
    const [userCount, setUserCount] = useState(2)
    const [localStream, setLocalStream] = useState<any>()
    const virtualRoom = useSelector(selectVirtualRoom)
    const dispatch = useDispatch()

    !virtualRoom.peerConnection && dispatch(setPeerConnection(new RTCPeerConnection(servers)))
    
    const localVideoRef = useRef<any>()
    const remoteVideoRef = useRef<any>()

    // useEffect(() => {
    //     resetLocalStream()
    // }, [localStream, isWebcamActive, isMicActive])

    useEffect(() => {
        function setup() {
            dispatch(setMainPageTitle(`Virtual Room: ${virtualRoom.title}`))
            dispatch(setIsActive(true))
            setupSources()
        }
        return () => setup()
    }, [])

    // function resetLocalStream() {
    //     if(localStream) {
    //         localStream.getTracks().forEach((track: MediaStreamTrack) => {
    //             track.stop()
    //         })
    //     }
    //     navigator.mediaDevices.getUserMedia({
    //         video: virtualRoom.isWebcamActive,
    //         audio: virtualRoom.isMicActive
    //     }).then((stream) => {
    //         setLocalStream(stream)
    //     })
    // }

    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    async function collectIceCandidates(
                        roomRef:DocumentReference<DocumentData>,
                        remoteCandidatesCollection:CollectionReference<DocumentData>) {
                            
        const candidatesCollection = collection(roomRef, "offerCandidates");

        virtualRoom.peerConnection!.addEventListener('icecandidate', event => {
            if (event.candidate) {
                const json = event.candidate.toJSON();
                addDoc(candidatesCollection, json)
            }
        });

        onSnapshot(remoteCandidatesCollection, snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    virtualRoom.peerConnection!.addIceCandidate(candidate);
                }
            });
        })
    }

    const setupSources = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        
        const remoteStream = new MediaStream()

        localStream.getTracks().forEach((track) => {
            virtualRoom.peerConnection!.addTrack(track, localStream)
        })

        virtualRoom.peerConnection!.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        }

        let localVideo = localVideoRef?.current
        if (localVideo) localVideo.srcObject = localStream
        
        let remoteVideo = remoteVideoRef.current
        if (remoteVideo) remoteVideo.srcObject = remoteStream

        localVideo?.play()
        remoteVideo?.play()

        if(mode == "create") createOffer()
        else if (mode == "join") answerOffer()
    }

    const createOffer = async () =>  {
        const roomDocRef = doc(db, "rooms", getTimeEpoch())
        const offerCandidates = collection(roomDocRef, "offerCandidates")
        const answerCandidates = collection(roomDocRef, "answerCandidates")

        dispatch(setId(roomDocRef.id))

        const offerDescription = await virtualRoom.peerConnection!.createOffer()
        await virtualRoom.peerConnection!.setLocalDescription(offerDescription)

        virtualRoom.peerConnection!.onicecandidate = (event) => {
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON())
        }

        const roomWithOffer = {
            offer: {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            }
        }

        await setDoc(roomDocRef, roomWithOffer)

        collectIceCandidates(roomDocRef, answerCandidates)

        onSnapshot(roomDocRef, async snapshot => {
            const data = snapshot.data()
            console.log('Got updated room:', snapshot.data())
            if(!virtualRoom.peerConnection!.remoteDescription && data?.answer) {
                console.log('Set remote description: ', data.answer)
                const answerDecription = new RTCSessionDescription(data.answer)
                virtualRoom.peerConnection!.setRemoteDescription(answerDecription)
            }
        })

        virtualRoom.peerConnection!.onconnectionstatechange = (event) => {
            if(virtualRoom.peerConnection!.connectionState === "disconnected") hangUp
        }
    }

    const answerOffer = async () => {
        console.log("Answering room")
        const roomDocRef = doc(db, "rooms", virtualRoom.id!)
        const offerCandidates = collection(roomDocRef, "offerCandidates")
        const answerCandidates = collection(roomDocRef, "answerCandidates")

        const offerDescription = (await getDoc(roomDocRef)).data()?.offer

        await virtualRoom.peerConnection!.setRemoteDescription(offerDescription)
        
        virtualRoom.peerConnection!.onicecandidate = (event) => {
            event.candidate && addDoc(answerCandidates, event.candidate.toJSON())
        }

        const answerDescription = await virtualRoom.peerConnection!.createAnswer()
        await virtualRoom.peerConnection!.setLocalDescription(answerDescription)

        const roomWithAnswer = {
            answer: {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            }
        }

        await updateDoc(roomDocRef, roomWithAnswer)

        collectIceCandidates(roomDocRef, offerCandidates)

        virtualRoom.peerConnection!.onconnectionstatechange = (event) => {
            if(virtualRoom.peerConnection!.connectionState === "disconnected") hangUp
        }
    }

    const hangUp = async () => {
        virtualRoom.peerConnection!.close()
        
        if(virtualRoom.id) {
            const roomDocRef = doc(db, "rooms", virtualRoom.id!)
            const offerCandidates = collection(roomDocRef, "offerCandidates")
            const answerCandidates = collection(roomDocRef, "answerCandidates")
            
            for (const candidate of (await getDocs(offerCandidates)).docs) {
                deleteDoc(candidate.ref)
            }
            for (const candidate of (await getDocs(answerCandidates)).docs) {
                deleteDoc(candidate.ref)
            }
        
            deleteDoc(roomDocRef)
            
            alert("Room Ended!")
            dispatch(clearVirtualRoom())
            window.location.reload()
        }
    }

    function switchMicState() {
        dispatch(setIsMicActive(!virtualRoom.isMicActive))
    }

    function switchVideoCamState() {
        dispatch(setIsWebcamActive(!virtualRoom.isWebcamActive))
    }

  return (
    <div className='w-full h-full flex flex-row'>
        <div className={`flex flex-col w-full m-5 `}>
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
                        <video ref={remoteVideoRef} className='video'></video>
                    </div>
                }
                <div className='main-participant w-full h-full sm:w-fit rounded-xl bg-color-2nd'>
                    <video ref={localVideoRef} className='video'></video>
                </div>
            </div>
            <div className='flex mt-5 justify-between items-center'>
                <div title='Copy Room Id' className='flex items-center
                                bg-color-2nd
                                p-3 space-x-3
                                rounded-md
                                text-xs font-medium
                                clickable'
                    onClick={() => copy(virtualRoom.id!)}>
                    <p className='truncate w-16 sm:w-20'>{virtualRoom.id}</p>
                    <div className='h-full line outline-gray-300/70 dark:outline-gray-7 00' />
                    <FiCopy className='h-6 w-6' />
                    {/* <ClipboardIcon className='h-6 w-6'/>    */}
                </div>
                <div className='flex space-x-2'>
                    {
                        virtualRoom.isMicActive ?
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
                        virtualRoom.isWebcamActive ?
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
                <div onClick={hangUp} className='rounded-md cursor-pointer p-3
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