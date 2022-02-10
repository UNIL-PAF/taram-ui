import { createSlice } from '@reduxjs/toolkit'
import {fetchAnalysisByResultId} from './BackendAnalysis'

export const analysisSlice = createSlice({
    name: 'analysis',
    initialState: {
        value: 0,
        data: null,
        status: 'idle',
        error: null
    },
    reducers: {
        increment: state => {
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(fetchAnalysisByResultId.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchAnalysisByResultId.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Add any fetched posts to the array
                state.data = action.payload
            })
            .addCase(fetchAnalysisByResultId.rejected, (state, action) => {
                state.status = 'failed'
                if (action.payload) {
                    // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    state.error = action.payload.message
                } else {
                    state.error = action.error.message
                }
            })
    },
})

export const { increment, decrement, incrementByAmount } = analysisSlice.actions

export const selectCount = (state) => state.analysis.value;

export default analysisSlice.reducer