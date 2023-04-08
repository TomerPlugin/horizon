import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface PeerState {
    id: string,
    peer: RTCPeerConnection | null,
}

const initialState: PeerState = {
    id: "",
    peer: null,
}

export const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setPeer: (state, action: PayloadAction<RTCPeerConnection>) => {
            state.peer = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { setId, setPeer } = peerSlice.actions

export const selectPeer = (state: RootState) => state.peer 

export default peerSlice.reducer