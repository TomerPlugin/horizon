import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { DocumentData } from "firebase/firestore"

interface Member {
    id: string,
    username: string,
    info: DocumentData,
    peer: RTCPeerConnection | null,
    videoStream: MediaStream | null,
}    

interface VirtualRoomState{
    title: string,
    isActive: boolean,
    id: string,
    localInfo: {
        username: string,
        offer: {
            sdp: string,
            type: RTCSdpType,
        }
    } | any,
    members: Member[] | any[],
    isAddedExistingMembers: boolean,
    isWebcamActive: boolean,
    isMicActive: boolean,
}

const initialState: VirtualRoomState = {
    title: "",
    isActive: false,
    id: "",
    localInfo: {},
    members: [],
    isAddedExistingMembers: false,
    isWebcamActive: true,
    isMicActive: false,
}

export const virtualRoomSlice = createSlice({
    name: 'virtualRoom',
    initialState,
    reducers:{
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        setIsActive: (state, action: PayloadAction<boolean>) => {
            state.isActive = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setLocalInfo: (state, action: PayloadAction<any>) => {
            state.localInfo = action.payload
        },
        setMembers: (state, action: PayloadAction<any[]>) => {
            state.members = action.payload
        },
        addMember: (state, action: PayloadAction<Member>) => {
            if(state.members.find((m) => m.id == action.payload?.id)) return

            state.members.push(action.payload)
        },
        removeMember: (state, action: PayloadAction<string>) => {
            state.members = state.members.filter((m) => m.id != action.payload)
        },
        replaceMember: (state, action: PayloadAction<Member>) => {
            const member = state.members.find((m) => m.id == action.payload?.id)
            if(!member) return
            
            const i = state.members.indexOf(member)
            state.members[i] = action.payload
        },
        setIsAddedExistingMembers: (state, action: PayloadAction<boolean>) => {
            state.isAddedExistingMembers = action.payload
        },
        setIsWebcamActive: (state, action: PayloadAction<boolean>) => {
            state.isWebcamActive = action.payload
        },
        setIsMicActive: (state, action: PayloadAction<boolean>) => {
            state.isWebcamActive = action.payload
        },
        clearVirtualRoom: (state) => {
            state = initialState
        },
    }
})

export const {
    setTitle,
    setIsActive,
    setId,
    setLocalInfo,
    setMembers,
    addMember,
    removeMember,
    replaceMember,
    setIsAddedExistingMembers,
    setIsWebcamActive,
    setIsMicActive,
    clearVirtualRoom,
} = virtualRoomSlice.actions

export const selectVirtualRoom = (state: RootState) => state.virtualRoom

export default virtualRoomSlice.reducer
