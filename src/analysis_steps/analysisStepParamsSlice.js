import {createSelector, createSlice} from '@reduxjs/toolkit'

export const analysisStepParamsSlice = createSlice({
    name: 'analysis-step-params',
    initialState: {
        data: null,
    },
    reducers: {
        setData(state, action){
            console.log(action)
            state.data = action.payload
        }
    }
})

export let selectCols = createSelector([state => state.analysis.data], (d) => {
    if(d){
        return d.map( i => i.idx)
    }else{
        return []
    }
})

export const { setData } = analysisStepParamsSlice.actions

export default analysisStepParamsSlice.reducer