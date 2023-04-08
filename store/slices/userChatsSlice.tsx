import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { DocumentData } from 'firebase/firestore';

interface UserChatsState {
    value: DocumentData[];
}

const initialState = {
    value: [],
}

export const userChatsSlice = createSlice({
    name: 'userChats',
    initialState,
    reducers: {
        setUserChats: (state: any, action: PayloadAction<DocumentData[]>) => {
            state.value = action.payload
        }
    }
})

export const { setUserChats } = userChatsSlice.actions

export const selectUserChats = (state: RootState) => state.userChats.value

export default userChatsSlice.reducer


