import {createSlice} from '@reduxjs/toolkit'
import {addResult} from './BackendResults'

export const resultsSlice = createSlice({
    name: 'results',
    initialState: {
        resultId: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setError(state, action) {
            state.error = action.payload
        },
        resetResults(state, action) {
            state.resultId = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addResult.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(addResult.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.resultId = action.payload
            })
            .addCase(addResult.rejected, (state, action) => {
                state.status = 'failed'
                if (action.payload) {
                    state.error = action.payload.message
                } else {
                    state.error = action.error.message
                }
            })
    },
})
export const { setError, resetResults } = resultsSlice.actions
export default resultsSlice.reducer