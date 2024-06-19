import { configureStore } from '@reduxjs/toolkit'
import {scrapingTable} from "./api";
import productSlice from "@/redux/feature/product/productSlice";
import authSlice from "@/redux/feature/auth/authSlice";
// import cartSlice from './feature/cart/cartSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            product: productSlice,
            auth:authSlice
        },
        // Adding the api middleware enables caching, invalidation, polling,
        // and other useful features of `rtk-query`.
        // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ecommerceApi.middleware),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']