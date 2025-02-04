// @ts-check

import Basket from "../Pages/Basket";
import Category from "../Pages/Category";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Page404 from "../Pages/page404";
import Product from "../Pages/ProductPage";
import ArticlePage from "../Pages/ArticlePage";
import CmsPage from "../Pages/CmsPage"
import Account from "../Pages/Account";
import VerifyOrder from "../Pages/VerifyOrder";


const routes = [
    { path: '/', element: <Home /> },
    { path: '/category/:majorCat/:minorCat?', element: <Category/> },
    { path: '/login/:bas?', element: <Login /> },
    { path: '/article/:id', element: <ArticlePage /> },
    { path: '/basket', element: <Basket /> },
    { path: '/product/:id', element: <Product /> },
    { path: '/cms', element: <CmsPage /> },
    { path: '/account', element: <Account /> },
    { path: '/verify-order/:Authority?', element: <VerifyOrder /> },
    { path: '/account/:params', element: <Account order/> },
    { path: '/*', element: <Page404 /> },
]

export default routes