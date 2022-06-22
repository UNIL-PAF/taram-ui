import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";

function getAllTemplates() {
    return axios.get(globalConfig.urlBackend + "template")
}

export function deleteAnalysis(analysisId) {
    return axios.delete(globalConfig.urlBackend + "analysis/" + analysisId)
}

export const fetchAllTemplates = createAsyncThunk('templates/fetch-all', async (resultId, thunkApi) => {
    try {
        const response = await getAllTemplates()
        return response.data
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        return thunkApi.rejectWithValue(error.response.data)
    }
})

function updateTemplateCall(templateObj) {
    return axios.post(globalConfig.urlBackend + "template/update/" + templateObj.id + "?name=" + templateObj.name + "&value=" + encodeURIComponent(templateObj.value))
}

export const updateTemplate = createAsyncThunk('templates/update', async (templateObj, thunkApi) => {
    try {
        const response = await updateTemplateCall(templateObj)
        return response.data
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        return thunkApi.rejectWithValue(error.response.data)
    } finally {
        thunkApi.dispatch(fetchAllTemplates())
    }
})

