import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'
import analysisStepParamsReducer from "./analysis_steps/analysisStepParamsSlice";

export default configureStore({
    reducer: {
        analysis: analysisReducer,
        analysisStepParams: analysisStepParamsReducer
    }
})