import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { IconButton } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useEffect, useState } from 'react';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { useDispatch, useSelector } from 'react-redux';
import { countPerPage, search, sort, cat, getLinks, page } from '../../Redux/Pagination'
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { reduxType } from "../Types/redux"
import { useLocation } from 'react-router-dom';
import AlertBox from './AlertBox';


type BoxHeaderType = {
    title: string,
    txt1?: string,
    txt2?: string,
    color: string,
    all: boolean,
    link?: string,
    searchBar: boolean,
    count?: number[],
    searchCat?: boolean
    article?: boolean,
    setArticle?: React.Dispatch<React.SetStateAction<boolean>>
    bascket?: boolean
}
type sortType = { txt: string, val: string, id: number }

function BoxHeader({ title, txt1, txt2, color, all = true, link = "/", searchBar = false, bascket = false, count = [24, 36, 48], article = false, setArticle, searchCat = false }: BoxHeaderType) {

    const allSort: sortType[] = [
        { txt: "جدیدترین‌ها", val: "latest", id: 1 },
        { txt: "تخفیفی‌ها", val: "offers", id: 2 },
        { txt: "گرانترین‌ها", val: "expensive", id: 3 },
        { txt: "ارزانترین‌ها", val: "cheap", id: 4 },
        { txt: "محبوبیت", val: "popular", id: 5 }
    ]

    const loc = useLocation().pathname.split("/")
    const [selection, setSelection] = useState(false)
    const [selectionFilter, setSelectionFilter] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [category, setCategory] = useState<string[]>()
    const [Sort, setSort] = useState<sortType[]>(allSort)

    const dispatch = useDispatch<any>()
    const state = useSelector((state: reduxType) => state.pagination)

    useEffect(() => {
        dispatch(getLinks())
    }, [])

    useEffect(() => {
        if (searchBar) {
            const minCat: string = decodeURIComponent(loc[3])
            const majorCat: string = decodeURIComponent(loc[2])
            if (majorCat === "search") {
                if (article) {
                    const sort = allSort.filter(s => (
                        [1, 5].includes(s.id)
                    ))
                    setSort(sort)
                } else {
                    setSort(allSort)
                }
            } else {
                let majorLinks: string[] = ["همه"]

                const majorSub = state.links.filter(l => (
                    l.txt === majorCat
                ))[0]

                if (majorSub) {

                    majorSub.subLinks.forEach(s => {
                        majorLinks.push(s.link)
                    })

                    const sort = allSort.filter(s => (
                        majorSub.sort.includes(s.id)
                    ))

                    setSort(sort)

                    if (minCat !== "undefined" && minCat !== undefined) {

                        let minorLinks: string[] = []

                        const minorSub = majorSub.subLinks.filter(b => (
                            b.link === minCat
                        ))[0]

                        minorSub.brand.forEach(s => {
                            minorLinks.push(s)
                        })

                        setCategory(minorLinks)
                    } else {
                        setCategory(majorLinks)
                    }
                }
            }
        }
    }, [state.links, loc[2], loc[3], article])


    return (
        <>
            <AlertBox txt='فیلتر اعمال شد.' status='yes' open={alertOpen} setOpen={setAlertOpen} time={1500} />
            <div className="flex items-end sm:items-center justify-between mb-8 gap-4 sm:flex-row flex-col mt-20 mx-auto w-[81vw]">

                <div className="space-y-2.5 self-start">
                    <div className="flex items-baseline gap-x-2.5 sm:gap-x-3.5">
                        <span className={`min-w-4 min-h-4 lg:w-6 ${color} rounded-sm`}></span>
                        <h3 className="text-zinc-700 dark:text-white text-2xl font-bold sm:text-3xl">{title}</h3>
                    </div>
                    {txt1 &&
                        <div className="text-slate-500 dark:text-slate-400 sm:text-xl font-[vazir]">
                            <Typewriter
                                options={{
                                    strings: [txt1, txt2 ? txt2 : ""],
                                    autoStart: true,
                                    loop: true,
                                }}
                            />
                        </div>
                    }
                </div>
                {all &&
                    <Link to={link} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center w-fit gap-x-1 rounded-xl px-2.5 py-2 text-sky-500 hover:bg-sky-500/10 dark:text-white  transition-colors">
                        <span className="font-[vazir] inline-block">مشاهده همه</span>
                        <KeyboardBackspaceRoundedIcon />
                    </Link>
                }

            </div>
            {searchBar &&
                <div className="flex md:flex-wrap lg:flex-row flex-col gap-4 justify-between sm:items-center w-[82vw] mx-auto font-[vazir] mt-10">

                    <div className="sm:flex-row flex-col flex gap-4 sm:items-center">

                        <div className=" flex gap-4">

                            <div className={`bg-sky-200 dark:bg-slate-600 transition-all flex items-center overflow-hidden shadow-md ${selection ? "w-40 rounded-r-3xl rounded-l-lg" : 'w-10 rounded-full'}`}>
                                <IconButton onClick={() => { setSelection(!selection); setSelectionFilter(false) }}>
                                    <div className="dark:text-white h-6 -translate-y-1 text-slate-700" >
                                        <FilterListRoundedIcon />
                                    </div>
                                </IconButton>
                                <div className={`p-2 transition-all outline-none dark:bg-slate-600 dark:text-white bg-sky-200 rounded-md overflow-hidden text-slate-700 ${selection ? "w-full opacity-100" : "w-0 opacity-0"}`}>
                                    <select name="مرتب‌سازی"
                                        value={state.sort}
                                        onChange={e => { dispatch(sort({ value: e.target.value })); window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true); dispatch(page({ num: 1 })) }}
                                        className="bg-sky-200 dark:bg-slate-600 transition-all outline-none">
                                        {Sort.map((s => (
                                            <option value={s.val} key={s.id} >{s.txt}</option>
                                        )))}
                                    </select>
                                </div>
                            </div>

                            {!searchCat && !bascket &&
                                <div className={`bg-sky-200 dark:bg-slate-600 transition-all flex items-center justify-between gap-2 overflow-hidden shadow-md ${selectionFilter ? "w-36 rounded-r-3xl rounded-l-lg" : 'w-10 rounded-full'}`}>
                                    <IconButton onClick={() => { setSelectionFilter(!selectionFilter); setSelection(false) }} >
                                        <div className="dark:text-white h-6 -translate-y-1 text-slate-700" >
                                            <FilterAltRoundedIcon />
                                        </div>
                                    </IconButton>

                                    <div className={`py-2 transition-all outline-none dark:bg-slate-600 dark:text-white bg-sky-200 rounded-md overflow-hidden text-slate-700 ${selectionFilter ? "w-full opacity-100" : "w-0 opacity-0"}`}>
                                        <select name="دسته‌بندی"
                                            value={state.cat}
                                            onChange={e => { dispatch(cat({ value: e.target.value })); window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true); dispatch(page({ num: 1 })) }}
                                            className="bg-sky-200 dark:bg-slate-600 transition-all outline-none"
                                        >
                                            {category &&
                                                category.map((c, i) => (
                                                    <option value={c} key={i}>{c}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className="p-2 bg-sky-200 dark:bg-slate-600 transition-all dark:text-white rounded-lg text-slate-700 flex items-center w-fit shadow-md whitespace-nowrap">
                            تعداد در صفحه:
                            <select name="مرتب‌سازی"
                                value={state.countPerPage}
                                onChange={e => { dispatch(countPerPage({ num: +e.target.value })); window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true); dispatch(page({ num: 1 })) }}
                                className="bg-sky-200 dark:bg-slate-600 transition-all outline-none">
                                {count.map(i => (
                                    <option value={i} key={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                        {searchCat &&
                            <div className=" text-lg dark:text-white shadow-md rounded-lg w-fit overflow-hidden text-slate-700 font-[vazir] flex justify-center">

                                <button className={`p-[0.4rem] hover:bg-blue-300 hover:text-blue-950 dark:text-white dark:hover:bg-[#3F6CD8] dark:hover:text-white w-24 transition-colors border-l-2 border-solid border-white dark:border-slate-800 ${!article ? "dark:bg-[#3F6CD8] bg-blue-300  text-blue-950" : "bg-sky-200 dark:bg-slate-600"}`}
                                    onClick={() => { setArticle && setArticle(false); window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true) }}>
                                    محصولات
                                </button>
                                <button className={`p-[0.4rem] hover:bg-blue-300 hover:text-blue-950 dark:text-white dark:hover:bg-[#3F6CD8] dark:hover:text-white w-24 transition-colors ${article ? "bg-blue-300 text-blue-950 dark:bg-[#3F6CD8]" : "bg-sky-200 dark:bg-slate-600"}`}
                                    onClick={() => { setArticle && setArticle(true); window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true) }}>
                                    مقالات
                                </button>

                            </div>
                        }

                    </div>

                    <div className="flex justify-center items-center gap-2 bg-sky-200 dark:bg-slate-600 transition-all rounded-lg shadow-md h-fit w-fit">
                        <div className="text-slate-700">
                            <input type="text"
                                className="py-1 px-4 outline-none rounded-full bg-sky-200 transition-all dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-200 placeholder:text-slate-600 sm:w-full"
                                placeholder={`جستجو در ${title.includes("|") ? title.split(" | ")[1] : title.includes(":") ? title.split(": ")[1] : title}`}
                                value={state.search}
                                onChange={e => dispatch(search({ txt: e.target.value }))}
                                onKeyUp={(e) => e.code === "Enter" && window.scrollTo({ top: 300, behavior: "smooth" })}
                            />
                        </div>
                        <IconButton onClick={(e) => { window.scrollTo({ top: 300, behavior: "smooth" }); setAlertOpen(true) }}>
                            <div className="dark:text-white h-6 -translate-y-1">
                                <SearchRoundedIcon />
                            </div>
                        </IconButton>
                    </div>
                </div >
            }
        </>
    );
}

export default BoxHeader;