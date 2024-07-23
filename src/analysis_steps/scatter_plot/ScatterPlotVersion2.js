import {getXYLines, computeLogData, computeColLimits} from './ScatterPlotVersion1'

export default function getOptionsV2(results, params, mySelProteins, logTrans, showRegrLine, showXYLine){
    const myData = computeLogData(results.data, logTrans)
    const colLimits = (params.colorBy) ? computeColLimits(results.data) : null
    const defSelProts = (mySelProteins ? mySelProteins : params.selProteins).map(a => a.split(";")[0])

    const dataWithLabel = myData.d.map(d => {
        const showLab = defSelProts && defSelProts.includes(d.ac)
        return {...d, showLab: showLab}
    })

    const otherField = myData.d[0].other.length > 0 ? myData.d[0].other[0].name : undefined

    const options = {
        title: {text: params.xAxis + " - " + params.yAxis, left: "center", textStyle: {fontSize: 14}},
        dataset: [
            {
                dimensions: ["x", "y", "name", "ac", "col", "showLab"].concat(otherField ? 'peptides' : []),
                source: dataWithLabel.map(p => {
                    return [p.x, p.y, p.n, p.ac, p.d, p.showLab].concat(otherField ? p.other[0].value : [])
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
                const text2 = p.data[3] + "<br>"
                const text3 = params.xAxis + ": <strong>" + String(p.data[0].length > 5 ? p.data[0].toExponential(1) : p.data[0].toFixed(1)) + "</strong><br>"
                const text4 = params.yAxis + ": <strong>" + String(p.data[1].length > 5 ? p.data[1].toExponential(1) : p.data[1].toFixed(1)) + "</strong><br>"
                const text5 = (params.colorBy) ? (params.colorBy + ": <strong>" + p.data[4].toFixed(1) + "</strong><br>") : ""
                const text6 = otherField ? (otherField + ": <strong>" + p.data[6] + "</strong><br>") : ""
                return text1 + text2 + text3 + text4 + text5 + text6
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
            dimension: 4,
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