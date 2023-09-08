import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";


function deleteAnalysisStepCall(id) {
    return axios.delete(globalConfig.urlBackend + "analysis-step/" + id)
}

export const deleteAnalysisStep = createAsyncThunk(
    'analysis-step/delete',
    async (stepObj, thunkApi) => {
        try {
            const response = await deleteAnalysisStepCall(stepObj.stepId)
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

function setStepParametersWithoutRunningCall(paramsObj){
    return axios.post(globalConfig.urlBackend + "analysis-step/parameters/" + paramsObj.stepId + "?doNotRun=true", paramsObj.params)
}

export const setStepParametersWithoutRunning = createAsyncThunk(
        'analysis-step/parameters-without-running',
        async (stepObj, thunkApi) => {
            try {
                const response = await setStepParametersWithoutRunningCall(stepObj)
                return response.data
            } catch (err) {
                let error = err // cast the error for access
                if (!error.response) {
                    throw err
                }
                return thunkApi.rejectWithValue(error.response.data)
            } finally {
                if(stepObj.callback) stepObj.callback()
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
    if(stepObj.comment != null){
        return axios.post(globalConfig.urlBackend + "analysis-step/comment/" + stepObj.stepId, stepObj.comment,
            {
                headers: {
                    'Content-Type': 'application/text'
                }
            })
    }else{
        return axios.delete(globalConfig.urlBackend + "analysis-step/comment/" + stepObj.stepId)
    }

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

function switchSelCall(stepObj) {
    return axios.post(globalConfig.urlBackend + "analysis-step/switch-sel/" + stepObj.selId + "/step-id/" + stepObj.stepId)
}

export const switchSel = createAsyncThunk(
    'analysis-step/switch-sel',
    async (stepObj, thunkApi) => {
        try {
            const response = await switchSelCall(stepObj)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        } finally {
            stepObj.callback()
        }
    }
)



