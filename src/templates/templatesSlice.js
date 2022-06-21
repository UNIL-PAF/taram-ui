import {createSlice} from '@reduxjs/toolkit'
import {fetchAllTemplates} from "./BackendTemplates";

export const templateSlice = createSlice({
    name: 'templates',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTemplates.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchAllTemplates.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const data = action.payload.map( d => {return {...d, nrSteps: d.templateSteps.length, key: d.id}})
                state.data = data
            })
            .addCase(fetchAllTemplates.rejected, (state, action) => {
                state.status = 'failed'
                if (action.payload) {
                    state.error = action.payload.message
                } else {
                    state.error = action.error.message
                }
            })
    },
})

export default templateSlice.reducer