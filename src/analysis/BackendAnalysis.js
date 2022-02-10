import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

function getAnalysisByResultId(resultId){
    console.log(resultId)
    return axios.get(globalConfig.urlBackend + "analysis?resultId=" + resultId)
}

export const fetchAnalysisByResultId = createAsyncThunk(
    'analysis/fetchById',
    async (resultId, { rejectWithValue }) => {
        try {
            const response = await getAnalysisByResultId(resultId)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return rejectWithValue(error.response.data)
        }
    }
)
