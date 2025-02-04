import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productInputType, productType } from "../Components/Types/product"
const jwt = localStorage.getItem("jwt")

export const getProduct = createAsyncThunk('product/getProduct',
    async (id?: string) => {
        return fetch(`https://api.neynegar1.ir/products/${id}`).then(res => res.json()).then(data => data
        )
    }
)


export const addProduct = createAsyncThunk('product/addProduct',
    async (p: productInputType) => {
        let file = new FormData()
        file.append('title,', p.title,)
        file.append('desc,', p.desc,)
        file.append('price,', p.price,)
        file.append('cost,', p.cost,)
        file.append('discount,', p.discount,)
        file.append('count,', p.count,)
        // file.append('showCount,', p.showCount,)
        // file.append('authorId,', p.authorId,)
        file.append('publisher,', p.publisher,)
        file.append('publishDate,', p.publishDate,)
        file.append('brand,', p.brand,)
        // file.append('authorArticleId,', p.authorArticleId,)
        // file.append('publisherArticleId,', p.publisherArticleId,)
        // file.append('productArticleId,', p.productArticleId,)
        file.append('status,', p.status,)
        file.append('size,', p.size,)
        file.append('weight,', p.weight,)
        file.append('majorCat,', p.majorCat,)
        file.append('minorCat,', p.category,)
        // file.append('cover,', p.cover,)
        file.append('imgs,', p.img,)
        if (jwt) {
            return fetch(`https://api.neynegar1.ir/products`, {
                method: 'POST',
                headers: {
                    'authorization': jwt,
                    "Content-Type":"multipart/form-data; boundary=yet another boundary"
                },
                body: file
            })
                .then(res => res.json())
                .then(resault => {
                    console.log(resault)
                    console.log(p)
                })
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: <productType>{},
    reducers: {
        // removeProduct: (state, action) => {
        //     state.filter(p => (
        //         p._id !== action.payload.id
        //     ))
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(getProduct.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export default productSlice.reducer;
export const {
    // removeProduct
} = productSlice.actions