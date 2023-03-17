import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

function getFullProteinTableCall(stepId) {
    return axios.get(globalConfig.urlBackend + "analysis-step/full-protein-table/" + stepId)
}

export const getFullProteinTable = createAsyncThunk(
    'analysis-step/full-protein-table',
    async (stepObj, thunkApi) => {
        try {
            const response = await getFullProteinTableCall(stepObj.stepId)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)



