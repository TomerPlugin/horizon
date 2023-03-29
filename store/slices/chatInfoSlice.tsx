import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { RootState } from "../store";


interface ChatInfoState {
    user: DocumentData | null,
    messages: DocumentData[],
}

const initialState: ChatInfoState = {
    user: null,
    messages: []
}

export const chatInfoSlice = createSlice({
    name: "chatInfo",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<DocumentData>) => {
            state.user = action.payload
        },
        setMessages: (state, action: PayloadAction<DocumentData[]>) => {
            state.messages = action.payload
        }
    }
})

export const { setUser, setMessages } = chatInfoSlice.actions

export const selectChatInfo = (state: RootState) => state.chatInfo

export default chatInfoSlice.reducer