import { createSlice } from '@reduxjs/toolkit'
import {getFullProteinTable} from './BackendFullProteinTable'

const parseError = function(action){
    if (action.payload) {
        return action.payload.message
    } else {
        return action.error.message
    }
}

export const fullProteinTableSlice = createSlice({
    name: 'full_protein_table',
    initialState: {
        error: null,
    },
    reducers: {
        clearFullTable(state){
            state.data = undefined
            state.error = null
            state.status = undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFullProteinTable.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getFullProteinTable.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(getFullProteinTable.rejected, (state, action) => {
                state.status = 'failed'
                state.error = parseError(action)
            })
    },
})

export const {clearFullTable} = fullProteinTableSlice.actions

export default fullProteinTableSlice.reducer