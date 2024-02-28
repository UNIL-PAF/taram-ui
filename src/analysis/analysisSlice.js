import {createSlice} from '@reduxjs/toolkit'
import {fetchAnalysisByResultId} from './BackendAnalysis'

export const analysisSlice = createSlice({
    name: 'analysis',
    initialState: {
        resultId: null,
        data: null,
        hints: null,
        status: 'idle',
        error: null,
        globalStatus: null,
    },
    reducers: {
        setError(state, action) {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalysisByResultId.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchAnalysisByResultId.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.analysisList
                state.hints = action.payload.hints
                state.globalStatus = action.payload.status
            })
            .addCase(fetchAnalysisByResultId.rejected, (state, action) => {
                state.status = 'failed'
                if (action.payload) {
                    state.error = action.payload.message
                } else {
                    state.error = action.error.message
                }
            })
    },
})
export const { setError } = analysisSlice.actions
export default analysisSlice.reducer