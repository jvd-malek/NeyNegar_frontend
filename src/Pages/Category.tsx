import BoxHeader from "../Components/Boxes/BoxHeader";
import { memo } from "react";
import ProductBox from "../Components/Boxes/ProductBox";
import PaginationBox from "../Components/Boxes/PaginationBox";
import ArticleBox from "../Components/Boxes/ArticleBox";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getProducts } from '../Redux/Category'
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import { cat, countPerPage, search, sort } from "../Redux/Pagination";
import { getArticles } from "../Redux/Article"
import { reduxType } from "../Components/Types/redux";
import { useLocation } from "react-router-dom";

const Category = memo(() => {

    const loc = useLocation().pathname.split("/")
    const dispatch = useDispatch<any>()
    const state = useSelector((state: reduxType) => state.category)
    const articleState = useSelector((state: reduxType) => state.articles)
    const page = useSelector((state: reduxType) => state.pagination)
    const [article, setArticle] = useState(decodeURIComponent(loc[2]) === "مقالات" ? true : false)

    useEffect(() => {
        if (article) {
            if (loc[3]) {
                dispatch(getArticles(`${decodeURIComponent(loc[2])}/${decodeURIComponent(loc[3])}`))
            } else {
                dispatch(getArticles(decodeURIComponent(loc[2])))
            }
        }

        else {
            if (loc[3]) {
                dispatch(getProducts(`${decodeURIComponent(loc[2])}/${decodeURIComponent(loc[3])}`))
            } else {
                dispatch(getProducts(decodeURIComponent(loc[2])))
            }
        }

        dispatch(sort({ value: 'latest' }))
        dispatch(cat({ value: 'همه' }))
        dispatch(countPerPage({ num: 24 }))
        dispatch(search({ txt: '' }))

    }, [loc[2], loc[3], article])

    useEffect(() => {
        setArticle(decodeURIComponent(loc[2]) === "مقالات" ? true : false)
    }, [loc[2]])
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
                let Bprice = b.discount[b.discount.length - 1].discount > 0 ? (b.price[b.price.length - 1].price * ((100 - b.discount[b.discount.length - 1].discount) / 100)) : b.price[b.price.length - 1].price
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
        <div className="pt-32">
            <BoxHeader
                title={loc[2] !== "search" ? `${decodeURIComponent(loc[2])}${loc[3] ? ` | ${decodeURIComponent(loc[3])}` : ""}` : (loc[2].trim() ? `جستجو: ${decodeURIComponent(loc[3].trim())}` : "نی‌نگار")}
                txt1={'خلاقیت خود را متمرکز کنید'}
                color={"gr1"}
                all={false}
                searchBar={true}
                article={article}
                setArticle={setArticle}
                searchCat={loc[2] === "search"}
            />

            <ul className="flex flex-wrap justify-center sm:gap-[3.5rem] gap-4 w-[90vw] mx-auto mt-16">
                {!article ?
                    products
                        .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                        .map(i => (
                            <li key={i._id} className="sm:w-52 w-40">
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
    );
});

export default Category;