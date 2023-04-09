import { configureStore } from '@reduxjs/toolkit'
import mainPageReducer from './slices/mainPageSlice'
import virtualRoomReducer from './slices/virtualRoomSlice'
import chatInfoReducer from './slices/chatInfoSlice'
<<<<<<< HEAD
=======
import userChatsReducer from './slices/userChatsSlice'
>>>>>>> fe75cd997e348633fa40c113fda410f0b97f2b05

export const store = configureStore({
  reducer: {
    mainPage: mainPageReducer,
    virtualRoom: virtualRoomReducer,
    chatInfo: chatInfoReducer,
<<<<<<< HEAD
=======
    userChats: userChatsReducer,
>>>>>>> fe75cd997e348633fa40c113fda410f0b97f2b05
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch