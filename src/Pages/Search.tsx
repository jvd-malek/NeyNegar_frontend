import BoxHeader from "../Components/Boxes/BoxHeader";
import ProductBox from "../Components/Boxes/ProductBox";
import PaginationBox from "../Components/Boxes/PaginationBox";
import ArticleBox from "../Components/Boxes/ArticleBox";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getProducts } from '../Redux/Category'
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import { cat, search, sort } from "../Redux/Pagination";
import { getArticles } from "../Redux/Article"
import { reduxType } from "../Components/Types/redux";
import { useLocation } from "react-router-dom";
import { productCoverType } from "../Components/Types/product";
import { articleCoverType } from "../Components/Types/article";
import { getSearch } from "../Redux/search";


function Search() {

    const loc = useLocation().pathname.split("/")
    const dispatch = useDispatch<any>()
    const searchState = useSelector((state: reduxType) => state.search)
    const state = useSelector((state: reduxType) => state.category)
    const articleState = useSelector((state: reduxType) => state.articles)
    const page = useSelector((state: reduxType) => state.pagination)
    const [article, setArticle] = useState(false)
    const [articles, setArticles] = useState<articleCoverType>([] as articleCoverType)
    const [products, setProducts] = useState<productCoverType>([] as productCoverType)

    useEffect(() => {
        if (loc[1] === "search") {
            dispatch(getSearch(decodeURIComponent(loc[2])))
        } else {
            if (decodeURIComponent(loc[2]) === "مقالات") {
                setArticle(true)
                if (loc[3]) {
                    dispatch(getArticles(`${decodeURIComponent(loc[2])}/${decodeURIComponent(loc[3])}`))
                } else {
                    dispatch(getArticles(decodeURIComponent(loc[2])))
                }
            }

            else {
                setArticle(false)
                if (loc[3]) {
                    dispatch(getProducts(`${decodeURIComponent(loc[2])}/${decodeURIComponent(loc[3])}`))
                } else {
                    dispatch(getProducts(decodeURIComponent(loc[2])))
                }
            }
        }

        dispatch(sort({ value: 'latest' }))
        dispatch(cat({ value: 'همه' }))
        dispatch(search({ txt: '' }))

    }, [loc[2], loc[3]])

    useEffect(() => {
        if (loc[1] !== "search") {
            const products = [...state]
                .filter(p => {
                    if (page.cat === 'همه') {
                        return p
                    } else if (loc[3]) {
                        return p.brand === page.cat
                    }
                    else {
                        return p.minorCat == page.cat
                    }
                })
                .filter(p => {
                    if (page.sort === "offers") {
                        return p.discount[p.discount.length - 1].discount > 0
                    } else {
                        return p
                    }
                })
                .filter((i) => (
                    i.title.includes(page.search.trim())
                ))

            const articles = [...articleState]
                .filter(p => {
                    if (page.cat === 'همه') {
                        return p
                    } else if (!loc[3]) {
                        return p.minorCat == page.cat
                    }
                    else {
                        return p.subCat === page.cat
                    }
                })
                .filter((i) => (
                    i.title.includes(page.search.trim())
                ))

            setArticles(articles)
            setProducts(products)
        } else {
            setArticles(searchState.articles)
            setProducts(searchState.products)
        }
    }, [state, articleState, searchState])

    switch (page.sort) {
        case 'expensive':
            products.sort((a, b) => {
                let Aprice = a.discount[a.discount.length - 1].discount > 0 ? (a.price[a.price.length - 1].price * ((100 - a.discount[a.discount.length - 1].discount) / 100)) : a.price[a.price.length - 1].price
                let Bprice = b.discount[b.discount.length - 1].discount > 0 ? (b.price[b.price.length - 1].price * ((100 - b.discount[b.discount.length - 1].discount) / 100)) : b.price[b.price.length - 1].price
                return Bprice - Aprice
            })
            break;

        case 'cheap':
            products.sort((a, b) => {
                let Aprice = a.discount[a.discount.length - 1].discount > 0 ? (a.price[a.price.length - 1].price * ((100 - a.discount[a.discount.length - 1].discount) / 100)) : a.price[a.price.length - 1].price
                let Bprice = b.discount[b.discount.length - 1].discount > 0 ? (b.price[b.price.length - 1].price * ((100 - b.discount[b.discount.length - 1].discount) / 100)) : b.price[a.price.length - 1].price
                return Aprice - Bprice
            })
            break;

        case 'popular':
            products.sort((a, b) => (b.popularity - a.popularity))
            articles.sort((a, b) => (b.popularity - a.popularity))
            break;

        case 'offers':
            products.sort((a, b) => (b.discount[b.discount.length - 1].discount - a.discount[a.discount.length - 1].discount))
            break;
    }

    return (
        <>
            {products.length > 0 &&

                <div className="pt-32">
                    <BoxHeader
                        title={loc[2].trim() ? `جستجو: ${decodeURIComponent(loc[2].trim())}` : "نی‌نگار"}
                        txt1={'خلاقیت خود را متمرکز کنید'}
                        color={"gr1"}
                        all={false}
                        searchBar={false}
                    />

                    {loc[1] === "search" &&
                        <div className=" text-lg dark:text-white  text-blue-900 font-[vazir] flex justify-center">
                            <button className={`py-1 bg-blue-100 rounded-r-md hover:bg-blue-300 hover:text-blue-950 dark:text-white dark:bg-slate-600 dark:hover:bg-[#3F6CD8] dark:hover:text-white w-28 transition-colors border-l-2 border-solid border-white dark:border-slate-800 ${!article ? "bg-blue-300 dark:bg-[#3F6CD8] text-blue-950" : "bg-blue-100 dark:bg-slate-600"}`}
                                onClick={() => setArticle(false)}>
                                محصولات
                            </button>
                            <button className={`py-1 rounded-l-md hover:bg-blue-300 hover:text-blue-950 dark:text-white dark:hover:bg-[#3F6CD8] dark:hover:text-white w-28 transition-colors ${article ? "bg-blue-300 text-blue-950 dark:bg-[#3F6CD8]" : "bg-blue-100 dark:bg-slate-600"}`}
                                onClick={() => setArticle(true)}>
                                مقالات
                            </button>
                        </div>
                    }

                    <ul className="flex flex-wrap justify-center gap-[3.5rem] w-[82vw] mx-auto mt-16">
                        {!article ?
                            products
                                .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                                .map(i => (
                                    <li key={i._id} className="sm:w-52 w-72">
                                        <ProductBox box={false}  {...i} />
                                    </li>
                                ))

                            : articles
                                .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                                .map(i => (
                                    <li key={i._id} >
                                        <ArticleBox {...i} />
                                    </li>
                                ))}
                    </ul>

                    {
                        !article && products.length > page.countPerPage &&
                        < PaginationBox count={Math.ceil(products.length / page.countPerPage)} />
                    }
                    {
                        article && articles.length > page.countPerPage &&
                        < PaginationBox count={Math.ceil(articles.length / page.countPerPage)} />
                    }
                    {
                        !article && products.length === 0 &&
                        <p className=" text-2xl text-sky-700 dark:text-white text-center">
                            موردی پیدا نشد
                            <span><SentimentDissatisfiedTwoToneIcon /></span></p>
                    }
                    {
                        article && articles.length === 0 &&
                        <p className=" text-2xl text-sky-700 dark:text-white text-center">
                            موردی پیدا نشد
                            <span><SentimentDissatisfiedTwoToneIcon /></span></p>
                    }

                </div >
            }
        </>
    );
}

export default Search;