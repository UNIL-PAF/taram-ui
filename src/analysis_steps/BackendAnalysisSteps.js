import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";

function addAnalysisStepCall(stepObj){
    return axios.post(globalConfig.urlBackend + "analysis-step/add-to/" + stepObj.stepId, stepObj.newStep)
}

function setStepParametersCall(paramsObj){
    console.log("paramsObj", paramsObj)
    return axios.post(globalConfig.urlBackend + "analysis-step/parameters/" + paramsObj.stepId, paramsObj.params)
}

export const addAnalysisStep = createAsyncThunk(
    'analysis-step/add-to',
    async (stepObj, thunkApi) => {
        try {
            const response = await addAnalysisStepCall(stepObj)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            thunkApi.dispatch(fetchAnalysisByResultId(stepObj.resultId))
        }
    }
)

export const setStepParameters = createAsyncThunk(
    'analysis-step/parameters',
    async (paramsObj, thunkApi) => {
        try {
            const response = await setStepParametersCall(paramsObj)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            thunkApi.dispatch(fetchAnalysisByResultId(paramsObj.resultId))
        }
    }
)


