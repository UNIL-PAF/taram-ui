import React from "react";
import {Modal} from "antd";
import '../analysis.css'
import BoxPlotParams from "../../analysis_steps/boxplot/BoxPlotParams";
import FilterParams from "../../analysis_steps/filter/FilterParams";
import GroupFilterParams from "../../analysis_steps/group_filter/GroupFilterParams";
import LogTransformationParams from "../../analysis_steps/log_transformation/LogTransformationParams";
import ImputationParams from "../../analysis_steps/imputation/ImputationParams";
import TTestParams from "../../analysis_steps/t_test/TTestParams";
import VolcanoPlotParams from "../../analysis_steps/volcano_plot/VolcanoPlotParams";
import RemoveImputedParams from "../../analysis_steps/remove_imputed/RemoveImputedParams"
import RemoveColumnsParams from "../../analysis_steps/remove_columns/RemoveColumnsParams"
import PcaPlotParams from "../../analysis_steps/pca/PcaPlotParams";
import UmapPlotParams from "../../analysis_steps/umap/UmapPlotParams";
import ScatterPlotParams from "../../analysis_steps/scatter_plot/ScatterPlotParams";
import NormalizationParams from "../../analysis_steps/normalization/NormalizationParams";
import SummaryStatParams from "../../analysis_steps/summary_stat/SummaryStatParams";
import OrderColumnsParams from "../../analysis_steps/order_columns/OrderColumnsParams";
import RenameColumnsParams from "../../analysis_steps/rename_columns/RenameColumnsParams";
import AddColumnParams from "../../analysis_steps/add_column/AddColumnParams";
import OneDEnrichmentParams from "../../analysis_steps/one_d_enrichment/OneDEnrichmentParams";

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
                                      experimentDetails={props.experimentDetails}
                ></PcaPlotParams>
            case 'umap':
                return <UmapPlotParams commonResult={props.commonResult}
                                      params={props.params}
                                      setParams={props.setParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></UmapPlotParams>
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
                                          stepId={props.stepId}
                ></VolcanoPlotParams>
            case 'scatter-plot':
                return <ScatterPlotParams commonResult={props.commonResult}
                                          params={props.params}
                                          setParams={props.setParams}
                                          intCol={props.intCol}
                                          stepId={props.stepId}
                ></ScatterPlotParams>
            case 'order-columns':
                return <OrderColumnsParams commonResult={props.commonResult}
                                           params={props.params}
                                           setParams={props.setParams}
                                           experimentDetails={props.experimentDetails}
                                           intCol={props.intCol}
                ></OrderColumnsParams>
            case 'rename-columns':
                return <RenameColumnsParams commonResult={props.commonResult}
                                           params={props.params}
                                           setParams={props.setParams}
                                           experimentDetails={props.experimentDetails}
                                           intCol={props.intCol}
                ></RenameColumnsParams>
            case 'add-column':
                return <AddColumnParams
                    commonResult={props.commonResult}
                    params={props.params}
                    setParams={props.setParams}
                    experimentDetails={props.experimentDetails}
                    intCol={props.intCol}
                ></AddColumnParams>
            case 'one-d-enrichment':
                return <OneDEnrichmentParams
                    commonResult={props.commonResult}
                    params={props.params}
                    setParams={props.setParams}
                    experimentDetails={props.experimentDetails}
                    intCol={props.intCol}
                ></OneDEnrichmentParams>

        }
    }

    return (
        <Modal title={"Parameters"} onOk={() => props.handleOk()}
               onCancel={() => props.handleCancel()}
               width={1000}
               open={true}
        >
            {getParamContent(props.type)}
        </Modal>
    )
}
