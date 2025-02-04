import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productCoverType } from "../Components/Types/product"



export const getSuggestedProducts = createAsyncThunk('suggestedProducts/getSuggestedProduct',
    async (cat: string) => {
        return fetch(`https://api.neynegar1.ir/products/category/${cat}`).then(res => res.json()).then(data => data)
    }
)

const suggestedProductsSlice = createSlice({
    name: 'suggestedProducts',
    initialState: <productCoverType>[],
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getSuggestedProducts.pending, (state, action) => {
            return []
        })
        builder.addCase(getSuggestedProducts.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
    }
})

export default suggestedProductsSlice.reducer;