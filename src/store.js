import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'
import templateReducer from './templates/templatesSlice'
import analysisStepParamsReducer from "./analysis_steps/analysisStepParamsSlice";
import proteinTableReducer from "./protein_table/proteinTableSlice";

export default configureStore({
    reducer: {
        templates: templateReducer,
        analysis: analysisReducer,
        analysisStepParams: analysisStepParamsReducer,
        proteinTable: proteinTableReducer
    }
})