import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { homeType } from "../Components/Types/home"


export const getHome = createAsyncThunk('home/getHome',
    async () => {        
        return fetch(`https://api.neynegar1.ir/`).then(res => res.json()).then(data => data)
    }
)

const homeSlice = createSlice({
    name: 'home',
    initialState: <homeType>{},
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getHome.fulfilled, (state, action) => {            
            return action.payload
        })
    }
})

export default homeSlice.reducer;