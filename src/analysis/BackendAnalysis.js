import axios from 'axios';
import globalConfig from "../globalConfig";

function getAnalysis(analysisId, setAnalysis, setIsLoading, setError){
    setIsLoading(true)

    axios.get(globalConfig.urlBackend + "analysis/" + analysisId)
        .then((response) => {
            // handle success
            console.log(response);
            // add a unique key
            const results = response.data.map((r) => {
                r.key = r.id
                return r
            })
            setAnalysis(results)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            setError(error)
        })
        .then(function () {
            setIsLoading(false)
        });
}


export {getAnalysis}
