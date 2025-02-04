import categoryReducer from "./Category";
import productReducer from "./productPage";
import articleReducer from "./ArticlePage";
import commentReducer from "./Comment";
import articlesReducer from "./Article";
import homeReducer from "./home";
import searchReducer from "./search";
import inputReducer from "./Inputs";
import { reduxType } from "../Components/Types/redux";
import paginationReducer from "./Pagination";
import suggestedProductsReducer from "./suggestedProduct"
import { configureStore } from '@reduxjs/toolkit'
// import { getDefaultMiddleware } from '@reduxjs/toolkit';

// const customizedMiddleware = getDefaultMiddleware({
//     serializableCheck: false
// })
export default configureStore<reduxType>({
    reducer: {
        category: categoryReducer,
        product: productReducer,
        article: articleReducer,
        articles: articlesReducer,
        pagination: paginationReducer,
        suggestedProducts: suggestedProductsReducer,
        home: homeReducer,
        search:searchReducer,
        comments: commentReducer,
        inputs: inputReducer
    },
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
})