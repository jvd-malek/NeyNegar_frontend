import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { commentType } from "../Components/Types/comment"
const jwt = localStorage.getItem("jwt")


export const getComments = createAsyncThunk('comment/getComments',
    async (id?: string) => {
        return fetch(`https://api.neynegar1.ir/comments/:${id}`).then(res => res.json()).then(data => data)
    }
)

export const getTotalComments = createAsyncThunk('comment/getTotalComments',
    async () => {
        if (jwt) {
            return fetch(`https://api.neynegar1.ir/comments`, {
                headers: {
                    'authorization': jwt
                }
            }).then(res => res.json()).then(data => data)
        }
    }
)


// export const addComment = createAsyncThunk('comment/addComment',
//     async (comment) => {
//         let file = new FormData()
//         file.append('form', comment)
//         return fetch(`https://localhost:8000/api/comments/`, {
//             method: 'POST',
//             // headers: {
//             //     'Content-Type': 'application/json'
//             // },
//             body: file
//         })
//             // .then(res => res.json())
//             .then(resault => {
//                 console.log(resault)
//                 console.log(comment)
//             })
//     }
// )

const commentSlice = createSlice({
    name: 'comment',
    initialState: <commentType[]>[],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTotalComments.pending, (state, action) => {
            return []
        })
        builder.addCase(getTotalComments.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
        builder.addCase(getComments.pending, (state, action) => {
            return []
        })
        builder.addCase(getComments.fulfilled, (state, action) => {
            const newState = [...action.payload]
            return newState
        })
        // builder.addCase(addComment.fulfilled, (state, action) => {
        //     console.log(action);
        // })
    }
})

export default commentSlice.reducer;