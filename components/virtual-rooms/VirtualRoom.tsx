import React, { useEffect, useRef, useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import copy from 'copy-to-clipboard'
import { CollectionReference, DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { v4 as uuid } from 'uuid'
import { setMainPageTitle } from '@/store/slices/mainPageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { clearVirtualRoom, selectVirtualRoom, setId, setIsActive, setIsMicActive, setIsRemoteUserActive, setIsWebcamActive, setPeerConnection, setTitle } from '@/store/slices/virtualRoomSlice'
import VirtualRoomChat from './VirtualRoomChat'
import Video from './Video'

// let localStream: MediaStream;
// let remoteStream: MediaStream;

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

        return () => {!virtualRoom.isActive && setup()}
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

        localStream.getTracks().forEach((track) => {
            virtualRoom.peerConnection!.addTrack(track, localStream)
        })

        const remoteStream = new MediaStream()

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
        const roomDocRef = doc(db, "rooms", String(uuid().toUpperCase()))
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
            },
            title: virtualRoom.title,
        }

        await setDoc(roomDocRef, roomWithOffer)

        collectIceCandidates(roomDocRef, answerCandidates)

        onSnapshot(roomDocRef, async snapshot => {
            const data = snapshot.data()
            if(!virtualRoom.peerConnection!.remoteDescription && data?.answer) {
                dispatch(setIsRemoteUserActive(true))
                const answerDecription = new RTCSessionDescription(data.answer)
                virtualRoom.peerConnection!.setRemoteDescription(answerDecription)
            }
        })

        virtualRoom.peerConnection!.onconnectionstatechange = (event) => {
            if(virtualRoom.peerConnection!.connectionState === "disconnected") {
                dispatch(setIsRemoteUserActive(false))
                alert("Remote user has disconnected!")
                
                dispatch(clearVirtualRoom())
                window.location.reload()
            }
        }
    }

    const answerOffer = async () => {
        const roomDocRef = doc(db, "rooms", virtualRoom.id!)
        const offerCandidates = collection(roomDocRef, "offerCandidates")
        const answerCandidates = collection(roomDocRef, "answerCandidates")

        await getDoc(roomDocRef).then((doc) => {
            const roomTitle = doc.data()?.title
            
            setTitle(roomTitle)
            dispatch(setMainPageTitle(`Virtual Room: ${ roomTitle }`))
        })

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

        dispatch(setIsRemoteUserActive(true))

        virtualRoom.peerConnection!.onconnectionstatechange = (event) => {
            if(virtualRoom.peerConnection!.connectionState === "disconnected") {
                dispatch(setIsRemoteUserActive(false))
                alert("Remote user has disconnected!")
                
                dispatch(clearVirtualRoom())
                window.location.reload()
            }
        }
    }

    const hangUp = async () => {
        virtualRoom.peerConnection!.close()
        
        if(virtualRoom.id) {
            const roomDocRef = doc(db, "rooms", virtualRoom.id!)
            const offerCandidates = collection(roomDocRef, "offerCandidates")
            const answerCandidates = collection(roomDocRef, "answerCandidates")
            
            const offersSnapshot = await getDocs(offerCandidates)
            const answersSnapshot = await getDocs(answerCandidates)

            offersSnapshot.forEach(async (candidate) => {
                await deleteDoc(candidate.ref)
            })

            answersSnapshot.forEach(async (candidate) => {
                await deleteDoc(candidate.ref)
            })
        
            deleteDoc(roomDocRef)
            
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
            <div className={`flex flex-col w-full space-y-5 items-center ${userCount > 2 ? "" : "sm:flex-row sm:space-x-5 sm:space-y-0"} sm:w-full sm:h-full h-full w-full`}>
                {
                    // virtualRoom.isRemoteUserActive && 
                    <div className='w-11/12 max-w-sm h-full sm:max-w-full sm:w-fit rounded-xl bg-color-2nd'>
                        {/* <Video srcObject={remoteStream} autoPlay={true} className='video' /> */}
                        <video ref={remoteVideoRef} className='video'></video>
                    </div>
                }
                <div className='main-participant w-11/12 max-w-sm h-full sm:max-w-full sm:w-fit rounded-xl bg-color-2nd'>
                    {/* <Video srcObject={localStream} autoPlay={true} className='video' /> */}
                    <video ref={localVideoRef} className='video'></video>
                </div>
            </div>
            <div className='flex w-full mt-5 justify-between items-center'>
                <div title='Copy Room Id' className='flex items-center
                                bg-color-2nd
                                p-3 space-x-3
                                rounded-md
                                text-xs font-medium
                                clickable'
                    onClick={() => copy(virtualRoom.id!)}>
                    <p className='truncate sm:w-20'>{virtualRoom.id}</p>
                    <div className='h-full line outline-gray-300/70 dark:outline-gray-7 00' />
                    {/* <FiCopy className='h-6 w-6' /> */}
                    <ClipboardIcon className='h-6 w-6'/>   
                </div>
                <div className='flex space-x-2'>
                    {
                        virtualRoom.isMicActive ?
                        <BsMic
                        title='Mute'
                        onClick={switchMicState}
                        className={`clickable-icon max-h-12 max-w-12`}
                        />
                        :
                        <BsMicMute
                        title='Unmute'
                        onClick={switchMicState}
                        className={`clickable-icon max-h-12 max-w-12 bg-red-500 hover:bg-red-400 dark:hover:bg-red-400 active:bg-red-600 dark:active:bg-red-600 text-white`}
                        />
                    }

                    {
                        virtualRoom.isWebcamActive ?
                        <VideoCameraIcon
                        onClick={switchVideoCamState}
                        className={`clickable-icon max-h-12 max-w-12`}
                        />
                        :
                        <VideoCameraSlashIcon
                        onClick={switchVideoCamState}
                        className={`clickable-icon max-h-12 max-w-12 bg-red-500 hover:bg-red-400 dark:hover:bg-red-400 active:bg-red-600 dark:active:bg-red-600 text-white`}
                        />
                    }

                    <Squares2X2Icon 
                    onClick={() => {}}
                    className={`clickable-icon ${false && 'icon-bg-hover max-h-12 max-w-12'}`}
                    />

                </div>
                <div onClick={hangUp} className='rounded-md cursor-pointer p-3 max-h-12 max-w-12
                            flex flex-row space-x-1 items-center
                            text-white
                            bg-red-500 hover:bg-red-500/90 active:bg-red-600   
                            dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-600/60
                            transition duration-75 ease-in-out'>
                    <p>Leave</p>
                    <p className='hidden sm:inline'>Room</p>
                </div>
            </div>
        </div>
        <VirtualRoomChat />
    </div>
  )
}

export default VirtualRoom