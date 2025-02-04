import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { articleType } from "../Components/Types/article"


export const getArticle = createAsyncThunk('article/getArticle',
    async (id?: string) => {        
        return fetch(`https://api.neynegar1.ir/articles/${id}`).then(res => res.json()).then(data => data
        )
    }
)

const articleSlice = createSlice({
    name: 'article',
    initialState: <articleType>{},
    reducers: {
        // removearticle: (state, action) => {
        //     state.filter(p => (
        //         p._id !== action.payload.id
        //     ))
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(getArticle.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export default articleSlice.reducer;
export const {
    // removearticle
} = articleSlice.actions