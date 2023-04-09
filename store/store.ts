import { configureStore } from '@reduxjs/toolkit'
import mainPageReducer from './slices/mainPageSlice'
import virtualRoomReducer from './slices/virtualRoomSlice'
import chatInfoReducer from './slices/chatInfoSlice'
import userChatsReducer from './slices/userChatsSlice'

export const store = configureStore({
  reducer: {
    mainPage: mainPageReducer,
    virtualRoom: virtualRoomReducer,
    chatInfo: chatInfoReducer,
    userChats: userChatsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch