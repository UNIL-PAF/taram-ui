import axios from 'axios';
import globalConfig from "../globalConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

function getAvailableDirs(setVisible, setAvailableDirs, setStatus){
    setStatus("loading")
    axios.get(globalConfig.urlBackend + "result/available-dirs")
        .then((response) => {
            // handle success
            // add a unique key
            const results = response.data.map((r) => {
                r.key = r.id
                return r
            })
            setAvailableDirs(results)
            setStatus("done")
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            setStatus("error")
        })
        .then(function () {
            // always executed
        });
}

function deleteResult(resultId, refreshResults){
    axios.delete(globalConfig.urlBackend + 'result/' + resultId)
        .then((response) => {
            // handle success
            //console.log("ok");
        })
        .catch(function (error) {
            // handle error
            console.log("error")
            console.log(error);
        })
        .then(function () {
            refreshResults()
        });
}

function updateInfo(resultId, name, description, refreshResults){
    const encodedName = encodeURIComponent(name);
    const encodedDescription = description ? encodeURIComponent(description) : null;
    axios.put(globalConfig.urlBackend + 'result/update-info/' + resultId + "?name=" + encodedName + (description ? ("&description="+encodedDescription) : ""))
        .then((response) => {
            // handle success
        })
        .catch(function (error) {
            // handle error
            console.log("error")
            console.log(error);
        })
        .then(function () {
            refreshResults()
        });
}

function getResults(setState) {
    axios.get(globalConfig.urlBackend + 'result/list')
        .then((response) => {
            // handle success
            // add a unique key
            const results = response.data.map((r) => {
                r.key = r.id
                return r
            })
            setState(results)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

export const addResult = createAsyncThunk(
    'result/add',
    async (result, thunkApi) => {
        try {
            const response = await axios.post(globalConfig.urlBackend + 'result/add', result)
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

export {getAvailableDirs, getResults, deleteResult, updateInfo}