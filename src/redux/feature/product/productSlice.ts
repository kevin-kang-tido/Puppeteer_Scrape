import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

const initialState:any = {
    product: {}
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct:(state, action: PayloadAction<string> )=> {
            state.product = action.payload;
        }
    },
});

export const {setProduct} = productSlice.actions;
export default productSlice.reducer;

export const selectProductImage = (state: RootState) => state.product.image.image;
export const selectCategoryImage= (state: RootState) => state.product.category.image;