import React from "react";
import {Modal} from "antd";
import '../../analysis/analysis.css'
import BoxPlotParams from "../boxplot/BoxPlotParams";
import FilterParams from "../filter/FilterParams";
import GroupFilterParams from "../group_filter/GroupFilterParams";
import LogTransformationParams from "../log_transformation/LogTransformationParams";
import ImputationParams from "../imputation/ImputationParams";
import TTestParams from "../t_test/TTestParams";
import VolcanoPlotParams from "../volcano_plot/VolcanoPlotParams";
import RemoveImputedParams from "../remove_imputed/RemoveImputedParams"
import RemoveColumnsParams from "../remove_columns/RemoveColumnsParams"
import PcaPlotParams from "../pca/PcaPlotParams";
import ScatterPlotParams from "../scatter_plot/ScatterPlotParams";
import NormalizationParams from "../normalization/NormalizationParams";
import SummaryStatParams from "../summary_stat/SummaryStatParams";
import OrderColumnsParams from "../order_columns/OrderColumnsParams";

export default function ParametersModal(props) {

    const getParamContent = (type) => {
        // eslint-disable-next-line
        switch (type) {
            case 'remove-columns':
                return <RemoveColumnsParams commonResult={props.commonResult}
                                            params={props.params}
                                            setParams={props.setParams}
                                            intCol={props.intCol}
                                            stepId={props.stepId}
                ></RemoveColumnsParams>
            case 'remove-imputed':
                return <RemoveImputedParams commonResult={props.commonResult}
                                            params={props.params}
                                            setParams={props.setParams}
                                            intCol={props.intCol}
                                            stepId={props.stepId}
                ></RemoveImputedParams>
            case 'boxplot':
                return <BoxPlotParams commonResult={props.commonResult}
                                      params={props.params}
                                      setParams={props.setParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></BoxPlotParams>
            case 'pca':
                return <PcaPlotParams commonResult={props.commonResult}
                                      params={props.params}
                                      setParams={props.setParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></PcaPlotParams>
            case 'filter':
                return <FilterParams commonResult={props.commonResult}
                                     params={props.params}
                                     setParams={props.setParams}
                                     intCol={props.intCol}
                                     resType={props.resType}
                ></FilterParams>
            case 'group-filter':
                return <GroupFilterParams commonResult={props.commonResult}
                                          params={props.params}
                                          setParams={props.setParams}
                                          intCol={props.intCol}
                ></GroupFilterParams>
            case 'log-transformation':
                return <LogTransformationParams commonResult={props.commonResult}
                                                params={props.params}
                                                setParams={props.setParams}
                                                intCol={props.intCol}
                ></LogTransformationParams>
            case 'normalization':
                return <NormalizationParams commonResult={props.commonResult}
                                            params={props.params}
                                            setParams={props.setParams}
                                            intCol={props.intCol}
                ></NormalizationParams>
            case 'summary-stat':
                return <SummaryStatParams commonResult={props.commonResult}
                                          params={props.params}
                                          setParams={props.setParams}
                                          intCol={props.intCol}
                ></SummaryStatParams>
            case 'imputation':
                return <ImputationParams commonResult={props.commonResult}
                                         params={props.params}
                                         setParams={props.setParams}
                                         intCol={props.intCol}
                ></ImputationParams>
            case 't-test':
                return <TTestParams commonResult={props.commonResult}
                                    params={props.params}
                                    setParams={props.setParams}
                                    experimentDetails={props.experimentDetails}
                                    intCol={props.intCol}
                ></TTestParams>
            case 'volcano-plot':
                return <VolcanoPlotParams commonResult={props.commonResult}
                                          params={props.params}
                                          setParams={props.setParams}
                ></VolcanoPlotParams>
            case 'scatter-plot':
                return <ScatterPlotParams commonResult={props.commonResult}
                                          params={props.params}
                                          setParams={props.setParams}
                                          intCol={props.intCol}
                ></ScatterPlotParams>
            case 'order-columns':
                return <OrderColumnsParams commonResult={props.commonResult}
                                           params={props.params}
                                           setParams={props.setParams}
                                           experimentDetails={props.experimentDetails}
                                           intCol={props.intCol}
                ></OrderColumnsParams>

        }
    }

    return (
        <Modal title={"Parameters"} onOk={() => props.handleOk()}
               onCancel={() => props.handleCancel()}
               width={1000}
               visible={true}
        >
            {getParamContent(props.type)}
        </Modal>
    )
}
