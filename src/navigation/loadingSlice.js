import {createSlice} from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        status: 'idle',
        text: undefined,
        error: undefined
    },
    reducers: {
        setError(state, action) {
            state.error = action.payload
            state.status = 'error'
        },
        setText(state, action) {
            state.text = action.payload
            state.status = 'loading'
        },
        setIdle(state) {
            state.text = undefined
            state.error = undefined
            state.status = 'idle'
        }
    }
})
export const { setError, setText, setIdle} = loadingSlice.actions
export default loadingSlice.reducer