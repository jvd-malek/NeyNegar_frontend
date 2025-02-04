import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { paginationType } from "../Components/Types/pagination"

export const getLinks = createAsyncThunk('pagination/getLinks',
    async () => {
        return fetch("https://api.neynegar1.ir/links").then(res => res.json()).then(data => data)
    }
)

const paginationSlice = createSlice({
    name: 'pagination',
    initialState: <paginationType>{ page: 1, countPerPage: 24, search: '', sort: 'latest', cat: 'همه', links: [] },
    reducers: {
        page: (state, action) => {
            state.page = action.payload.num
        },
        countPerPage: (state, action) => {
            state.countPerPage = action.payload.num
            state.page = 1
        },
        search: (state, action) => {
            state.search = action.payload.txt
            state.page = 1
        },
        sort: (state, action) => {
            state.sort = action.payload.value
        },
        cat: (state, action) => {
            state.cat = action.payload.value
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLinks.fulfilled, (state, action) => {
            state.links = action.payload
        })
    }
})

export default paginationSlice.reducer;
export const {
    page,
    countPerPage,
    search,
    sort,
    cat,
} = paginationSlice.actions