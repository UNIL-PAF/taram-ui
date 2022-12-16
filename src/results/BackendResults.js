import axios from 'axios';
import globalConfig from "../globalConfig";

function getAvailableDirs(setVisible, setAvailableDirs){
    axios.get(globalConfig.urlBackend + "result/available-dirs")
        .then((response) => {
            // handle success
            // add a unique key
            const results = response.data.map((r) => {
                r.key = r.id
                return r
            })
            setVisible(true)
            setAvailableDirs(results)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

function deleteResult(resultId, refreshResults){
    axios.delete(globalConfig.urlBackend + 'result/' + resultId)
        .then((response) => {
            // handle success
            console.log("ok");
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

function addResult(result, refreshResults){
    axios.post(globalConfig.urlBackend + 'result/add', result)
        .then((response) => {
            // handle success
            console.log("ok");
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




export {getAvailableDirs, getResults, addResult, deleteResult}