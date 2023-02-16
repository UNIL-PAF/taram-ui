export const formNum = (n) => {
    if(n == 0){
        return n
    } else if(Math.abs(n) > 1e6){
        return n.toExponential(2)
    }else{
        return n.toFixed(2)
    }
}

