export const formNum = (n) => {
    if(typeof(n) !== "number" || n === 0) {
        return n
    } else if(Math.abs(n) > 1e4){
        return n.toExponential(3)
    } else if(Math.abs(n) < 1e-2){
        return n.toExponential(3)
    } else{
        return n.toFixed(3)
    }
}

