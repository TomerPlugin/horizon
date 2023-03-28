import React, { useEffect, useRef, useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import copy from 'copy-to-clipboard'
import { CollectionReference, DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { off } from 'process'

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

function VirtualRoom({title, mode, initialRoomId}:{title:string, mode:string, initialRoomId:string}) {
    const [roomId, setRoomId] = useState<string | null>(initialRoomId)
    const [isWebcamActive, setIsWebcamActive] = useState(true)
    const [isMicActive, setIsMicActive] = useState(false)
    const [userCount, setUserCount] = useState(2)
    const [localStream, setLocalStream] = useState<any>()
    
    const peerConnection = new RTCPeerConnection(servers)

    const localVideoRef = useRef<any>()
    const remoteVideoRef = useRef<any>()

    // useEffect(() => {
    //     resetLocalStream()
    // }, [localStream, isWebcamActive, isMicActive])

    useEffect(() => {
        function setup() {
            setupSources()
        }
        return () => setup()
    }, [])

    function resetLocalStream() {
        if(localStream) {
            localStream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop()
            })
        }
        navigator.mediaDevices.getUserMedia({
            video: isWebcamActive,
            audio: isMicActive
        }).then((stream) => {
            setLocalStream(stream)
        })
    }

    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    async function collectIceCandidates(
                        roomRef:DocumentReference<DocumentData>,
                        peerConnection:RTCPeerConnection,
                        remoteCandidatesCollection:CollectionReference<DocumentData>) {
                            
        const candidatesCollection = collection(roomRef, "offerCandidates");

        peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
                const json = event.candidate.toJSON();
                addDoc(candidatesCollection, json)
            }
        });

        onSnapshot(remoteCandidatesCollection, snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerConnection.addIceCandidate(candidate);
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
            peerConnection.addTrack(track, localStream)
        })

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        }

        let localVideo = localVideoRef.current
        localVideo.srcObject = localStream
        
        let remoteVideo = remoteVideoRef.current
        remoteVideo.srcObject = remoteStream

        localVideo.play()
        remoteVideo.play()

        if(mode == "create") createOffer()
        else if (mode == "join") answerOffer()
    }

    const createOffer = async () =>  {
        const roomDocRef = doc(db, "rooms", getTimeEpoch());
        const offerCandidates = collection(roomDocRef, "offerCandidates");
        const answerCandidates = collection(roomDocRef, "answerCandidates");

        setRoomId(roomDocRef.id);

        const offerDescription = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDescription);

        peerConnection.onicecandidate = (event) => {
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };

        const roomWithOffer = {
            offer: {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            }
        }

        await setDoc(roomDocRef, roomWithOffer);

        collectIceCandidates(roomDocRef, peerConnection, answerCandidates)

        onSnapshot(roomDocRef, async snapshot => {
            const data = snapshot.data()
            console.log('Got updated room:', snapshot.data());
            if(!peerConnection.remoteDescription && data?.answer) {
                console.log('Set remote description: ', data.answer);
                const answerDecription = new RTCSessionDescription(data.answer)
                peerConnection.setRemoteDescription(answerDecription)
            }
        })

        peerConnection.onconnectionstatechange = (event) => {
            if(peerConnection.connectionState === "disconnected") hangUp
        }
    }

    const answerOffer = async () => {
        console.log("Answering room")
        const roomDocRef = doc(db, "rooms", roomId!);
        const offerCandidates = collection(roomDocRef, "offerCandidates");
        const answerCandidates = collection(roomDocRef, "answerCandidates");

        const offerDescription = (await getDoc(roomDocRef)).data()?.offer

        await peerConnection.setRemoteDescription(offerDescription)
        
        peerConnection.onicecandidate = (event) => {
            event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
        };

        const answerDescription = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answerDescription)

        const roomWithAnswer = {
            answer: {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            }
        }

        await updateDoc(roomDocRef, roomWithAnswer)

        collectIceCandidates(roomDocRef, peerConnection, offerCandidates)

        peerConnection.onconnectionstatechange = (event) => {
            if(peerConnection.connectionState === "disconnected") hangUp
        }
    }

    const hangUp = async () => {
        peerConnection.close()

        if(roomId) {
            const roomDocRef = doc(db, "rooms", roomId!);
            const offerCandidates = collection(roomDocRef, "offerCandidates");
            const answerCandidates = collection(roomDocRef, "answerCandidates");
            
            for (const candidate of (await getDocs(offerCandidates)).docs) {
                deleteDoc(candidate.ref);
            }
            for (const candidate of (await getDocs(answerCandidates)).docs) {
                deleteDoc(candidate.ref);
            }
        
            deleteDoc(roomDocRef);
            
            alert("Room Ended!")
            window.location.reload()
        }
    }

    function switchMicState() {
        setIsMicActive(!isMicActive)
    }

    function switchVideoCamState() {
        setIsWebcamActive(!isWebcamActive)
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
                    onClick={() => copy(roomId!)}>
                    <p className='truncate w-16 sm:w-20'>{roomId}</p>
                    <div className='h-full line outline-gray-300/70 dark:outline-gray-7 00' />
                    <FiCopy className='h-6 w-6' />
                    {/* <ClipboardIcon className='h-6 w-6'/>    */}
                </div>
                <div className='flex space-x-2'>
                    {
                        isMicActive ?
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
                        isWebcamActive ?
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