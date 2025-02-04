import { createSlice } from "@reduxjs/toolkit"

const inputsSlice = createSlice({
    name: 'input',
    initialState: {
        title: '',
        desc: '',
        articleBody: '',
        count: '',
        size: '',
        author: '',
        category: '',
        brand: '',
        weight: '',
        publisher: '',
        price: '',
        cost: '',
        img: '',
        publishDate: '',
        status: '',
        discount: '',
        majorCat: '',
        discountDate: "",
        showCount: "",
        id: '',
    },
    reducers: {
        change: (state, action) => {
            // if (action.payload.fileName) {
            //     let file = new FormData()
            //     file.append(action.payload.input, action.payload.value)
            //     state[action.payload.input] = file
            // } else {
            state[action.payload.input] = action.payload.value
            // }
        },
        clear: (state) => {
            state.title = ''
            state.desc = ''
            state.articleBody = ''
            state.count = ''
            state.size = ''
            state.author = ''
            state.category = ''
            state.brand = ''
            state.weight = ''
            state.publisher = ''
            state.price = ''
            state.cost = ''
            state.img = ''
            state.publishDate = ''
            state.status = ''
            state.discount = ''
            state.majorCat = ''
            state.minorCat = ''
            state.discountDate = ''
            state.showCount = ''
            state.id = ""
        },
        clearCat: (state) => {
            state.category = ''
            state.brand = ''
        }
    }
})

export default inputsSlice.reducer;
export const {
    change,
    clear,
    clearCat
} = inputsSlice.actions