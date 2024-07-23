export function computeLogData(d, doCompute){
    const myD = d.filter(d => d.x > 0 && d.y > 0).map(a => {
        return {...a, x: Math.log10(a.x), y: Math.log10(a.y)}
    })

    const newD = doCompute ? myD : d

    const xVals = newD.map(a => a.x)
    const yVals = newD.map(a => a.y)

    const xMin = Math.min(...xVals)
    const xMax = Math.max(...xVals)
    const yMin = Math.min(...yVals)
    const yMax = Math.max(...yVals)

    return {lims: [computeLimits(xMin, xMax), computeLimits(yMin, yMax)], d: newD}
}

const computeLimits = (min, max) => {
    const newMin = Math.abs(min) > 0 ? Math.floor(min) : min
    const newMax = Math.abs(max) > 0 ? Math.ceil(max) : max
    return [newMin-Math.ceil(Math.abs(newMin*0.05)), newMax+Math.ceil(Math.abs(newMax*0.05))]
}

export function computeColLimits(d){
    return d.reduce((acc, v) => {
        acc[0] = (!acc[0] || v.d < acc[0]) ? v.d : acc[0]
        acc[1] = (!acc[1] || v.d > acc[1]) ? v.d : acc[1]
        return acc
    }, [undefined, undefined])
}

export function getXYLines(reg, lims, params, showRegrLine, showXYLine){
        if(!showRegrLine && !showXYLine) return null
        const xyLine = (showXYLine ?  [getXYData(lims, showRegrLine)] : [])

        return {
            animation: false,
            data: xyLine.concat(showRegrLine && reg ? [getRegrData(reg, lims)] : [])
        }
    };

const getXYData = (lims, reverseOrder) => {
    const xyBase = {
        symbol: 'none',
        lineStyle: {
            type: 'solid',
            color: '#3ba272'
        },
        tooltip: {
            formatter: 'y = x'
        },
        label: {
            formatter: "y = x",
            align: 'left',
            position: 'end',
            backgroundColor: '#e4f5ed',
            borderColor: '#63c698',
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 8],
            lineHeight: 16,
        },
    }
    const xYCurve = {slope: 1, intercept: 0}

    const evXMin = compX(lims[1][0], xYCurve)
    const evXMax = compX(lims[1][1], xYCurve)

    const xMin = evXMin > lims[0][0] ? evXMin : lims[0][0]
    const xMax = evXMax < lims[0][1] ? evXMax : lims[0][1]

    const myCoords = [
        {...xyBase, coord: [xMin, compY(xMin, xYCurve)]},
        {...xyBase, coord: [xMax, compY(xMax, xYCurve)]}
    ]

    return  (!reverseOrder ? myCoords : myCoords.reverse())
}

const compY = (x, reg) => {
    return x * reg.slope + reg.intercept
}

const compX = (y, reg) => {
    return (y - reg.intercept) / reg.slope
}

const getRegrData = (reg, lims) => {
    const evXMin = compX(lims[1][0], reg)
    const evXMax = compX(lims[1][1], reg)

    const xMin = evXMin > lims[0][0] ? evXMin : lims[0][0]
    const xMax = evXMax < lims[0][1] ? evXMax : lims[0][1]

    const formatter = "y = " +
        reg.slope.toFixed(2) + "x " +
        (reg.intercept < 0 ? "- " : "+ ") +
        Math.abs(reg.intercept).toFixed(2) + "\nR2: " +
        reg.rSquare.toFixed(2)

    const regrBase = {
        symbol: 'none',
        label: {
            formatter: formatter,
            align: 'left',
            position: 'end',
            backgroundColor: '#fef4f4',
            borderColor: '#f6adad',
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 8],
            lineHeight: 16,
        },
        lineStyle: {
            type: 'solid',
            color: '#ee6666'
        },
        tooltip: {
            formatter: formatter
        },
    }

    return  [
        { ...regrBase, coord: [xMin, compY(xMin, reg)]},
        { ...regrBase, coord: [xMax, compY(xMax, reg)]}
    ]
}

export default function getOptionsV1(results, params, mySelProteins, logTrans, showRegrLine, showXYLine){
        const myData = computeLogData(results.data, logTrans)
        const colLimits = (params.colorBy) ? computeColLimits(results.data) : null
        const defSelProts = (mySelProteins ? mySelProteins : params.selProteins).map(a => a.split(";")[0])

        const dataWithLabel = myData.d.map(d => {
            const showLab = defSelProts && defSelProts.includes(d.ac)
            return {...d, showLab: showLab}
        })

        const options = {
            title: {text: params.xAxis + " - " + params.yAxis, left: "center", textStyle: {fontSize: 14}},
            dataset: [
                {
                    dimensions: ["x", "y", "name", "col", "showLab"],
                    source: dataWithLabel.map(p => {
                        return [p.x, p.y, p.n, p.d, p.showLab]
                    }),
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'showLab', value: true}
                    }
                },
            ],
            xAxis: {
                name: params.xAxis,
                nameLocation: "center",
                nameTextStyle: {
                    padding: [8, 4, 5, 6],
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: myData.lims[0][0],
                max: myData.lims[0][1]
            },
            yAxis: {
                name: params.yAxis,
                nameLocation: "center",
                nameTextStyle: {
                    padding: [8, 4, 45, 6],
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: myData.lims[1][0],
                max: myData.lims[1][1]
            },
            tooltip: {
                showDelay: 0,
                formatter: function (p) {
                    const text1 = "<strong>" + p.data[2] + "</strong><br>"
                    const text2 = params.xAxis + ": <strong>" + String(p.data[0].length > 5 ? p.data[0].toExponential(1) : p.data[0].toFixed(1)) + "</strong><br>"
                    const text3 = params.yAxis + ": <strong>" + String(p.data[1].length > 5 ? p.data[1].toExponential(1) : p.data[1].toFixed(1)) + "</strong>"
                    const text = text1 + text2 + text3
                    return (params.colorBy) ? (text + "<br>" + params.colorBy + ": <strong>" + p.data[3].toFixed(1) + "</strong>") : text
                },
            },
            legend: {},
            series: [
                {
                    datasetIndex: 0,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y',
                    },
                    itemStyle: {
                      color: '#fac858'
                    },
                    symbolSize: 5,
                    markLine: logTrans ? null : getXYLines(results.linearRegression, myData.lims, params, showRegrLine, showXYLine)
                },
                {
                    label: {
                        show: true,
                        formatter: function (v) {
                            return v.value[2]
                        },
                        position: 'right',
                        minMargin: 2,
                        //fontWeight: 'bold',
                        fontSize: 12,
                        color: 'black'

                    },
                    symbolSize: 8,
                    itemStyle: {
                        color: "rgba(0, 128, 0, 0)",
                        borderWidth: 1,
                        borderColor: 'green'
                    },
                    datasetIndex: 1,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y',
                    }
                },
            ],
            grid: {
                left: 75
            }
        };

        return (params.colorBy) ? {
            ...options, visualMap: {
                min: colLimits[0],
                max: colLimits[1],
                dimension: 3,
                orient: 'vertical',
                right: 10,
                top: 'center',
                calculable: true,
                inRange: {
                    color: ['#f2c31a', '#24b7f2']
                },
                text: [params.colorBy, ''],
            }
        } : options
    }
