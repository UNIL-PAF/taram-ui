import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'
import templateReducer from './templates/templatesSlice'
import proteinTableReducer from "./protein_table/proteinTableSlice";
import fullProteinTableReducer from "./full_protein_table/fullProteinTableSlice";
import resultsReducer from './results/ResultsSlice'
import loadingReducer from "./navigation/loadingSlice";

export default configureStore({
    reducer: {
        templates: templateReducer,
        analysis: analysisReducer,
        proteinTable: proteinTableReducer,
        fullProteinTable: fullProteinTableReducer,
        results: resultsReducer,
        loading: loadingReducer
    }
})