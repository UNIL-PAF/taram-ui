import { createSlice } from '@reduxjs/toolkit'
import {addAnalysisStep} from './BackendAnalysisSteps'

const parseError = function(action){
    if (action.payload) {
        return action.payload.message
    } else {
        return action.error.message
    }
}

export const analysisStepsSlice = createSlice({
    name: 'analysis_steps',
    initialState: {
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAnalysisStep.rejected, (state, action) => {
                state.status = 'failed'
                state.error = parseError(action)
            })
    },
})

export const { addCol } = analysisStepsSlice.actions

export default analysisStepsSlice.reducer