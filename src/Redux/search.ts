import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { searchType } from "../Components/Types/search"


export const getSearch = createAsyncThunk('search/getSearch',
    async (txt : string) => {        
        return fetch(`https://api.neynegar1.ir/search/${txt}`).then(res => res.json()).then(data => data)
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState: <searchType>{},
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getSearch.fulfilled, (state, action) => {            
            return action.payload
        })
    }
})

export default searchSlice.reducer;