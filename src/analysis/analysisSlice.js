import {createSelector, createSlice} from '@reduxjs/toolkit'
import {fetchAnalysisByResultId} from './BackendAnalysis'

export const analysisSlice = createSlice({
    name: 'analysis',
    initialState: {
        resultId: null,
        data: null,
        status: 'idle',
        error: null,
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

export let selectCols = createSelector([state => state.analysis.data], (d) => {
    if(d){
        return d.map( i => i.idx)
    }else{
        return []
    }

})

export default analysisSlice.reducer