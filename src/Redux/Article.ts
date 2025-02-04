import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { articleCoverType, articleType } from "../Components/Types/article"


export const getArticles = createAsyncThunk('articles/getArticles',
    async (cat: string) => {
        return fetch(`https://api.neynegar1.ir/articles/category/${cat}`).then(res => res.json()).then(data => data)
    }
)

export const getSugArticles = createAsyncThunk('category/getSugProducts',
    async (cat?: string) => {        
        return fetch(`https://api.neynegar1.ir/articles/suggestion/${cat}`).then(res => res.json()).then(data => data
        )
    }
)

const articleSlice = createSlice({
    name: 'articles',
    initialState: <articleCoverType>[],
    reducers: {
        addArticle: (state, action) => {
            state.push(action.payload)
        },
        removeArticle: (state, action) => {
            state.filter(p => (
                p._id !== action.payload.id
            ))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getArticles.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
        builder.addCase(getSugArticles.pending, (state, action) => {
            return []
        })
        builder.addCase(getSugArticles.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
    }
})

export default articleSlice.reducer;
export const {
    addArticle,
    removeArticle
} = articleSlice.actions