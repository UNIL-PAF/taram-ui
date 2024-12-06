import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";

function getAllTemplates() {
    return axios.get(globalConfig.urlBackend + "template")
}

function deleteTemplateCall(templateId) {
    return axios.delete(globalConfig.urlBackend + "template/" + templateId)
}

export const deleteTemplate = createAsyncThunk('templates/delete', async (templateId, thunkApi) => {
    try {
        await deleteTemplateCall(templateId )
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

function addTemplateCall(templateObj) {
    return axios.post(globalConfig.urlBackend + "template/from-analysis/" + templateObj.analysisId + "?name=" + encodeURIComponent(templateObj.name) + "&description=" + encodeURIComponent(templateObj.description))
}

export const addTemplate = createAsyncThunk('templates/add', async (templateObj, thunkApi) => {
    try {
        const response = await addTemplateCall(templateObj)
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

function runTemplateCall(templateObj) {
    return axios.post(globalConfig.urlBackend + "template/run/" + templateObj.templateId + "/analysis/" + templateObj.analysisId)
}

export const runTemplate = createAsyncThunk('templates/run', async (templateObj, thunkApi) => {
    try {
        const response = await runTemplateCall(templateObj)
        return response.data
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        return thunkApi.rejectWithValue(error.response.data)
    } finally {
        setTimeout(() => {
            thunkApi.dispatch(fetchAnalysisByResultId(templateObj.resultsId))
        }, 2000);
    }
})

