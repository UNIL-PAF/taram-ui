import axios from 'axios';

function getAvailableDirs(setVisible, setAvailableDirs){

    axios.get('http://localhost:8080/result/available-dirs')
        .then((response) => {
            // handle success
            console.log(response);
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

export default getAvailableDirs