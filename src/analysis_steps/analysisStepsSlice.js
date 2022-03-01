import { createSlice } from '@reduxjs/toolkit'
import {fetchAnalysisByResultId} from './BackendAnalysis'

export const analysisStepsSlice = createSlice({
    name: 'analysis_steps',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
        cols: [1]
    },
    reducers: {
        addCol: state => {
            state.cols.push(state.cols[state.cols.length - 1] + 1)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalysisByResultId.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchAnalysisByResultId.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
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

export const { addCol } = analysisStepsSlice.actions

export default analysisStepsSlice.reducer