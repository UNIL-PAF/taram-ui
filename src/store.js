import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from './analysis/analysisSlice'

export default configureStore({
    reducer: {
        analysis: analysisReducer
    }
})