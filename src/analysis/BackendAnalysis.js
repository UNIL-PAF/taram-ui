import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

function callDeleteAnalysis(analysisId){
    return axios.delete(globalConfig.urlBackend + "analysis/" + analysisId)
}

export const deleteAnalysis = createAsyncThunk(
    'analysis/delete-analysis',
    async (analysisObj, thunkApi) => {
        try {
            const response = await callDeleteAnalysis(analysisObj.analysisId)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            setTimeout(() => {
                thunkApi.dispatch(fetchAnalysisByResultId(analysisObj.resultsId))
            }, 2000);
        }
    }
)

function getAnalysisByResultId(resultId){
    return axios.get(globalConfig.urlBackend + "analysis?resultId=" + resultId)
}

export const fetchAnalysisByResultId = createAsyncThunk(
    'analysis/fetch-by-result-id',
    async (resultId, thunkApi) => {
        try {
            const response = await getAnalysisByResultId(resultId)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

function callDuplicateAnalysis(analysisId){
    axios.post(globalConfig.urlBackend + "analysis/duplicate/" + analysisId)
}

export const duplicateAnalysis = createAsyncThunk(
    'analysis/duplicate-analysis',
    async (analysisObj, thunkApi) => {
        try {
            const response = await callDuplicateAnalysis(analysisObj.analysisId)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            setTimeout(() => {
                thunkApi.dispatch(fetchAnalysisByResultId(analysisObj.resultsId))
            }, 2000);
        }
    }
)

function callSetAnalysisName(analysisId, analysisName){
    axios.post(globalConfig.urlBackend + "analysis/set-name/" + analysisId, analysisName,
        {headers:{
            'Content-Type': 'application/json'
        }})
}

export const setAnalysisName = createAsyncThunk(
    'analysis/set-name',
    async (analysisObj, thunkApi) => {
        try {
            const response = await callSetAnalysisName(analysisObj.analysisId, analysisObj.analysisName)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            setTimeout(() => {
                thunkApi.dispatch(fetchAnalysisByResultId(analysisObj.resultId))
            }, 2000);
        }
    }
)

function callCopyAnalysis(analysisId){
    axios.post(globalConfig.urlBackend + "analysis/copy/" + analysisId)
}

export const copyAnalysis = createAsyncThunk(
    'analysis/copy-analysis',
    async (analysisObj, thunkApi) => {
        try {
            const response = await callCopyAnalysis(analysisObj.analysisId)
            return response.data
        }catch(err){
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            return thunkApi.rejectWithValue(error.response.data)
        }finally {
            setTimeout(() => {
                thunkApi.dispatch(fetchAnalysisByResultId(analysisObj.resultsId))
            }, 2000);
        }
    }
)
