import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";


export function deleteAnalysisStep(id) {
    return axios.delete(globalConfig.urlBackend + "analysis-step/" + id)
}

function updatePlotOptionsCall(plotObj) {
    return axios.post(globalConfig.urlBackend + "analysis-step/plot-options/" + plotObj.stepId, plotObj.params)
}

export const updatePlotOptions = createAsyncThunk(
    'analysis-step/plot-options',
    async (stepObj, thunkApi) => {
        try {
            const response = await updatePlotOptionsCall(stepObj)
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

function addAnalysisStepCall(stepObj) {
    return axios.post(globalConfig.urlBackend + "analysis-step/add-to/" + stepObj.stepId, stepObj.newStep)
}

export const addAnalysisStep = createAsyncThunk(
    'analysis-step/add-to',
    async (stepObj, thunkApi) => {
        try {
            const response = await addAnalysisStepCall(stepObj)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        } finally {
            thunkApi.dispatch(fetchAnalysisByResultId(stepObj.resultId))
        }
    }
)

function setStepParametersCall(paramsObj) {
    return axios.post(globalConfig.urlBackend + "analysis-step/parameters/" + paramsObj.stepId, paramsObj.params)
}

export const setStepParameters = createAsyncThunk(
    'analysis-step/parameters',
    async (paramsObj, thunkApi) => {
        try {
            const response = await setStepParametersCall(paramsObj)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        } finally {
            thunkApi.dispatch(fetchAnalysisByResultId(paramsObj.resultId))
        }
    }
)

function updateCommentCall(stepObj) {
    return axios.post(globalConfig.urlBackend + "analysis-step/comment/" + stepObj.stepId, stepObj.comment,
        {
            headers: {
                'Content-Type': 'application/text'
            }
        }
    )
}

export const updateComment = createAsyncThunk(
    'analysis-step/comment',
    async (stepObj, thunkApi) => {
        try {
            const response = await updateCommentCall(stepObj)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        } finally {
            thunkApi.dispatch(fetchAnalysisByResultId(stepObj.resultId))
        }
    }
)


