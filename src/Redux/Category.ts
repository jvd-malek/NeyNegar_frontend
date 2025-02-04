import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productCoverType} from "../Components/Types/product"


export const getProducts = createAsyncThunk('category/getProducts',
    async (cat?: string) => {        
        return fetch(`https://api.neynegar1.ir/products/category/${cat}`).then(res => res.json()).then(data => data
        )
    }
)

export const getSugProducts = createAsyncThunk('category/getSugProducts',
    async (cat?: string) => {        
        return fetch(`https://api.neynegar1.ir/products/suggestion/${cat}`).then(res => res.json()).then(data => data
        )
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: <productCoverType>[],
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, action) => {
            return []
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
        builder.addCase(getSugProducts.pending, (state, action) => {
            return []
        })
        builder.addCase(getSugProducts.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
    }
})

export default categorySlice.reducer;