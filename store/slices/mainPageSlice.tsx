import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface MainPageTitleState {
    title: string
    component: JSX.Element
}

const initialState: MainPageTitleState = {
    title: '',
    component: <></>
}

export const mainPageSlice = createSlice({
    name: 'mainPage',
    initialState,
    reducers: {
        setMainPageTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        setMainPageComponent: (state, action: PayloadAction<JSX.Element>) => {
            state.component = action.payload
        }
    }
})

export const { setMainPageTitle, setMainPageComponent } = mainPageSlice.actions

export const selectMainPage = (state: RootState) => state.mainPage

export default mainPageSlice.reducer    