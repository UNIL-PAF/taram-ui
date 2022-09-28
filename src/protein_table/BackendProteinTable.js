import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

function getProteinTableCall(stepId) {
    return axios.get(globalConfig.urlBackend + "analysis-step/protein-table/" + stepId)
}

export const getProteinTable = createAsyncThunk(
    'analysis-step/protein-table',
    async (stepObj, thunkApi) => {
        try {
            const response = await getProteinTableCall(stepObj.stepId)
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



