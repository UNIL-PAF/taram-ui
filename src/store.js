import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'
import templateReducer from './templates/templatesSlice'
import analysisStepParamsReducer from "./analysis_steps/analysisStepParamsSlice";

export default configureStore({
    reducer: {
        templates: templateReducer,
        analysis: analysisReducer,
        analysisStepParams: analysisStepParamsReducer
    }
})