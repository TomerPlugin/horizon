import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"


interface VirtualRoomState{
    title: string,
    isActive: boolean,
    id: string,
    peerConnection: RTCPeerConnection | null,
    isWebcamActive: boolean,
    isMicActive: boolean,
}

const initialState: VirtualRoomState = {
    title: "",
    isActive: false,
    id: "",
    peerConnection: null,
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
        setPeerConnection: (state, action: PayloadAction<RTCPeerConnection>) => {
            state.peerConnection = action.payload
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

export const {setTitle, setIsActive, setId, setPeerConnection, setIsWebcamActive, setIsMicActive, clearVirtualRoom} = virtualRoomSlice.actions

export const selectVirtualRoom = (state: RootState) => state.virtualRoom

export default virtualRoomSlice.reducer
