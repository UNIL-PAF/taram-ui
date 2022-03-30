import {createSlice} from '@reduxjs/toolkit'
import {setStepParameters} from "./BackendAnalysisSteps";

export const analysisStepParamsSlice = createSlice({
    name: 'analysis-step-params',
    initialState: {
        data: null,
        status: 'idle',
        error: null
    },
    reducers: {
        setData(state, action){
            state.data = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setStepParameters.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(setStepParameters.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = null
            })
            .addCase(setStepParameters.rejected, (state, action) => {
                state.status = 'failed'
                if (action.payload) {
                    state.error = action.payload.message
                } else {
                    state.error = action.error.message
                }
            })
    },
})

export const { setData } = analysisStepParamsSlice.actions

export default analysisStepParamsSlice.reducer