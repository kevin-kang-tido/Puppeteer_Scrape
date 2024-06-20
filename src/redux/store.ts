import { configureStore } from '@reduxjs/toolkit'
import { iDataApi } from './api'
import authSlice from "@/redux/features/auth/authSlice";

// create store
export const makeStore = () => {
    return configureStore({
        reducer: {
            // Add the generated reducer as a specific top-level slice
            [iDataApi.reducerPath]: iDataApi.reducer,
            auth: authSlice
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(iDataApi.middleware),
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']