import React, { useEffect, useId, useRef, useState } from 'react'
import { ClipboardIcon, Squares2X2Icon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline'
import { BsMic, BsMicMute } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import copy from 'copy-to-clipboard'
import { CollectionReference, DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { off } from 'process'
import { setMainPageTitle } from '@/store/slices/mainPageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addMember, clearVirtualRoom, removeMember, replaceMember, selectVirtualRoom, setId, setIsActive, setIsAddedExistingMembers, setIsMicActive, setIsWebcamActive, setLocalInfo, setMembers, setTitle } from '@/store/slices/virtualRoomSlice'
import { v4 as uuid } from 'uuid';
import useAuth from '@/hooks/useAuth'
import Video from './Video'
import VirtualRoomChat from './VirtualRoomChat'

interface Member {
    id: string,
    username: string,
    info: DocumentData,
    peer: RTCPeerConnection | null,
    videoStream: MediaStream | null,
}   

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

function VirtualRoom() {
    const [userCount, setUserCount] = useState(2)
    const [isLocalMemberHasInfo, setIsLocalMemberHasInfo] = useState(false)
    const isAddedExistingMembers = useRef(false);
    const { user } = useAuth()

    const virtualRoom = useSelector(selectVirtualRoom)
    const dispatch = useDispatch()
    !virtualRoom.id && dispatch(setId(String(uuid().toUpperCase())))
    
    let localStream = new MediaStream
    // const localVideoRef = useRef<any>()
    // const remoteVideoRef = useRef<any>()

    useEffect(() => {
        resetLocalStream()
    }, [virtualRoom.isWebcamActive, virtualRoom.isMicActive])

    useEffect(() => {
        function setup() {
            dispatch(setIsActive(true))
            setupLocalSources()
        }
        return () => {!virtualRoom.isActive && setup()}
    }, [])

    useEffect(() => {
        virtualRoom.id && onSnapshot(collection(db, "rooms", virtualRoom.id, "members"), (membersSnapshot) => {
            membersSnapshot.docChanges().forEach((change) => {
                // If member already in members list, skip him
                const member = virtualRoom.members.find((m) => m.id == change.doc.id)
                if(member || !isAddedExistingMembers.current) return

                console.log("Room update: ", change.type)

                if(change.type === "added") {

                    console.log("Adding new member:", change.doc.id)

                    const member: Member = {
                        id: change.doc.id,
                        username: change.doc.data().username,
                        info: change.doc.data(),
                        peer: new RTCPeerConnection(servers),
                        videoStream: new MediaStream()
                    }

                    member.id != user?.uid && setupMember(member)

                    dispatch(addMember(member))
                }

                else if(change.type === "removed") {
                    console.log("Removing existing member:", change.doc.data())
                    dispatch(removeMember(change.doc.id))
                }
                // else if(change.type === "modified") {
                //     console.log("Modifying existing member")
                //     const member: Member = {
                //         id: change.doc.id,
                //         username: change.doc.data().username,
                //         info: change.doc.data(),
                //         peer: new RTCPeerConnection(servers),
                //         videoStream: new MediaStream()
                //     }
                    
                //     dispatch(replaceMember(member))
                // }
            })
        })
    }, [db])

    const setupMember = async (member: Member) => {
        member.peer!.ontrack = (event: any) => {
            event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
                member.videoStream!.addTrack(track)
            })
        }

        localStream.getTracks().forEach((track: MediaStreamTrack) => {
            member.peer?.addTrack(track, localStream)
        })

        const offerCandidates = collection(db, "rooms", virtualRoom.id, "members", user?.uid!, "offerCandidates")
        const offerCandidatesSnap = await getDocs(offerCandidates)

        if(offerCandidatesSnap.empty) {
            member.peer!.onicecandidate = (event) => {
                event.candidate && addDoc(offerCandidates, event.candidate.toJSON())
            } 
        }   

        await createPeerOffer(member)
        await getPeerAnswer(member)

        getIceCandidates(member)
    }

    async function getIceCandidates(member: Member) {
        const memberCandidatesCollection = collection(db, "rooms", virtualRoom.id, "members", member.id, "offerCandidates");

        console.log("Getting ice cands...")

        onSnapshot(memberCandidatesCollection, snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added" && member.peer?.remoteDescription) {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    member.peer!.addIceCandidate(candidate);
                    console.log("Icecand added!")
                }
            });
        })
    }

    const setupLocalSources = async () => {
        const roomDocRef = doc(db, "rooms", String(virtualRoom.id.toUpperCase()))
        const roomMembersCollection = collection(roomDocRef, "members")
        const localMemberDocRef = doc(roomMembersCollection, user?.uid)
        const offerCandidates = collection(localMemberDocRef, "offerCandidates")


        getDoc(roomDocRef).then(async roomSnap => {
            const roomTitle = roomSnap.data()?.title

            if(roomTitle) dispatch(setTitle(roomTitle))
            else await setDoc(roomDocRef, { title: virtualRoom.title })
            
            dispatch(setMainPageTitle(`Virtual Room: ${ roomTitle ? roomTitle : virtualRoom.title }`))
        })

        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })

        await setDoc(localMemberDocRef, {})

        const membersSnapshot = await getDocs(roomMembersCollection)
        membersSnapshot.docs.forEach(async (memberDoc) => {
            const member: Member = {
                id: memberDoc.id,
                username: memberDoc.data().username,
                info: memberDoc.data(),
                peer: new RTCPeerConnection(servers),
                videoStream: new MediaStream()
            }

            if(virtualRoom.members.find((m) => m.id == member.id)) return

            if(memberDoc.id == user?.uid) {
                member.videoStream = localStream
                
                dispatch(addMember(member))
                return
            }


            console.log("Initializing existing member:", member)
            dispatch(addMember(member))

            member.peer!.ontrack = (event: any) => {
                event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
                    member.videoStream!.addTrack(track)
                })
            }
    
            localStream?.getTracks().forEach((track: MediaStreamTrack) => {
                member.peer?.addTrack(track, localStream)
            })

            const offerCandidatesSnap = await getDocs(offerCandidates)

            if(offerCandidatesSnap.empty) {
                member.peer!.onicecandidate = (event) => {
                    event.candidate && addDoc(offerCandidates, event.candidate.toJSON())
                } 
            }   

            await getPeerOffer(member)
            await createPeerAnswer(member)

            getIceCandidates(member)
        })

        isAddedExistingMembers.current = true
    }

    const getPeerOffer = async (member: Member) => {
        const remoteMemberDocRef = doc(db, "rooms", virtualRoom.id, "members", member.id)
        const memberDocSnap = null

        let offerDescription = null
        while (!offerDescription) {
            const memberDocSnap = await getDoc(remoteMemberDocRef)
            offerDescription = memberDocSnap.data()?.offer
        }

        member.peer?.setRemoteDescription(offerDescription)
        console.log("Got an offer!")
    }

    const createPeerAnswer = async (member: Member) => {
        const localMemberDocRef = doc(db, "rooms", virtualRoom.id, "members", user?.uid!)
        const localMemberAnswersCollectionRef = collection(localMemberDocRef, "answers")
        const remoteMemberAnswerDocRef = doc(localMemberAnswersCollectionRef, member.id)

        const answerDescription = await member.peer?.createAnswer()
        member.peer?.setLocalDescription(answerDescription)
        console.log("Generated answer")

        await setDoc(remoteMemberAnswerDocRef, {
            answer: {
                sdp: answerDescription?.sdp,
                type: answerDescription?.type,
            }
        })
    }

    const createPeerOffer = async (member: Member) => {
        const remoteMemberDocRef = doc(db, "rooms", virtualRoom.id, "members", member.id)
        const localMemberDocRef = doc(db, "rooms", virtualRoom.id, "members", user?.uid!)
        const candidatesCollection = collection(localMemberDocRef, "offerCandidates") 

        member.peer!.onicecandidate = (event) => {
            event.candidate && addDoc(candidatesCollection, event.candidate.toJSON())
        }

        const offerDescription = await member.peer?.createOffer()
        await member.peer!.setLocalDescription(offerDescription)
        console.log("Generated offer")

        const localOffer = (await getDoc(localMemberDocRef)).data()?.offer
        if(!localOffer) {
            const localPeerInfo = {
                username: user?.displayName,
                offer: {
                    sdp: offerDescription!.sdp,
                    type: offerDescription!.type,
                }
            }
            
            setDoc(localMemberDocRef, localPeerInfo)
            dispatch(setLocalInfo(localPeerInfo))   
        }
    }

    const getPeerAnswer = async (member: Member) => {
        const memberDocRef = doc(db, "rooms", virtualRoom.id, "members", member.id)
        const memberAnswersCollectionRef = collection(memberDocRef, "answers")

        onSnapshot(memberAnswersCollectionRef, answerSnapshot => {
            answerSnapshot.docChanges().forEach((change) => {
                if(change.type == "added" && change.doc.id == user?.uid && change.doc.data()?.answer) {
                    member.peer!.setRemoteDescription(change.doc.data().answer)
                }
            })
        })
    
        member.peer!.onconnectionstatechange = (event) => {
            if(member.peer!.connectionState === "disconnected") hangUp
        }           
    }

    function resetLocalStream() {
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
            // audio or video
            if (track.kind === 'video') {
              track.enabled = virtualRoom.isWebcamActive
            }
            else if (track.kind === 'audio') {
                track.enabled = virtualRoom.isMicActive
            }
          });
    }

    const hangUp = async () => {
        virtualRoom.members.forEach((m: Member) => {
            m.peer!.close()
        })
        
        if(virtualRoom.id) {
            const userDocRef = doc(db, "rooms", virtualRoom.id!, "members", user?.uid!)
            const offerCandidates = collection(userDocRef, "offerCandidates")
            const answersRef = collection(userDocRef, "answers")
            
            for (const candidate of (await getDocs(offerCandidates)).docs) {
                deleteDoc(candidate.ref)
            }

            for (const candidate of (await getDocs(answersRef)).docs) {
                deleteDoc(candidate.ref)
            }
        
            deleteDoc(userDocRef)
            
            alert("You left the room!")
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
        <div className={`flex flex-col w-full m-5`}>
            <div className={`flex flex-col space-y-5 items-center ${userCount > 2 ? "" : "sm:flex-row sm:space-x-5 sm:space-y-0"} sm:w-full sm:h-full h-full w-full`}>
                {/* { userCount > 2 &&
                <div>
                    <div className='w-full flex flex-row space-x-3 justify-center'>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                        <div className='participant w-full max-w-[10rem] h-[6rem] bg-color-2nd rounded-xl'></div>
                    </div>
                    <div className='w-full h-full sm:w-fit rounded-xl bg-color-2nd'>
                        <video ref={remoteVideoRef} className='video'></video>
                    </div>
                </div>
                } */}

                {
                    virtualRoom.members.map((member: Member) => {
                        return (
                            <div className='w-full h-full sm:w-fit rounded-xl bg-color-2nd' key={member.id}>
                                <Video srcObject={member.videoStream!} autoPlay={true} className='video' />
                            </div>
                        )
                    })
                }

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
        <VirtualRoomChat />
    </div>
  )
}

export default VirtualRoom