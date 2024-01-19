import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'
import templateReducer from './templates/templatesSlice'
import proteinTableReducer from "./protein_table/proteinTableSlice";
import resultsReducer from './results/ResultsSlice'
import loadingReducer from "./navigation/loadingSlice";

export default configureStore({
    reducer: {
        templates: templateReducer,
        analysis: analysisReducer,
        proteinTable: proteinTableReducer,
        results: resultsReducer,
        loading: loadingReducer
    }
})