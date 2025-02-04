import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { change, clear, clearCat } from '../../Redux/Inputs'
import { productSingleType } from "../Types/product"
import { reduxType } from "../Types/redux"
// import axios from 'axios';


function CMSForm({ article = false, put = false, id }: { article?: boolean, put?: boolean, id?: string }) {
    const { links } = useSelector((state: reduxType) => state.pagination)
    const [product, setProduct] = useState<{ product: productSingleType }>()
    const [Author, setAuthor] = useState<{ firstname: string, lastname: string, _id: string }[]>([])
    const [img, setImg] = useState<any>()
    const dispatch = useDispatch<any>()
    const state = useSelector((state: reduxType) => state.inputs)
    const jwt = localStorage.getItem("jwt")

    useEffect(() => {
        fetch(`https://api.neynegar1.ir/authors`)
            .then(res => res.json())
            .then(data => setAuthor(data))
    }, [])

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!article) {
            let product = new FormData()
            if (img) {
                product.append("img", img[0])
                img[1] && product.append("img", img[1])
                img[2] && product.append("img", img[2])
                img[3] && product.append("img", img[3])
            }
            state.title && product.append("title", state.title)
            state.desc && product.append("desc", state.desc)
            state.price && product.append("price", state.price)
            state.cost && product.append("cost", state.cost)
            state.count && product.append("count", state.count)
            state.showCount && product.append("showCount", state.showCount)
            state.discount && state.discountDate && product.append("discount", `${state.discount},${state.discountDate}`)
            state.majorCat && product.append("majorCat", state.majorCat)
            state.category && product.append("minorCat", state.category)
            state.brand && product.append("brand", state.brand)
            if (jwt && state.author && state.author.includes("/")) {
                let name = state.author.split("/")
                await fetch(`https://api.neynegar1.ir/authors/post`, {
                    headers: {
                        'authorization': jwt,
                        "content-type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        firstname: name[0],
                        lastname: name[1]
                    })
                })
                    .then(res => res.json())
                    .then(data => { console.log(data); product.append("authorId", data.author._id) })
            } else if (state.author) {
                product.append("authorId", state.author)
            }
            state.publisher && product.append("publisher", state.publisher)
            state.publishDate && product.append("publishDate", state.publishDate)
            state.size && product.append("size", state.size)
            state.weight && product.append("weight", state.weight)
            state.status && product.append("status", state.status)

            if (jwt) {
                if (state.id) {
                    await fetch(`https://api.neynegar1.ir/products/update/${state.id}`, {
                        headers: {
                            'authorization': jwt,
                        },
                        method: "PUT",
                        body: product
                    })
                        .then(res => res.json())
                        .then(data => console.log(data))
                }else{
                    await fetch(`https://api.neynegar1.ir/products`, {
                        headers: {
                            'authorization': jwt,
                        },
                        method: "POST",
                        body: product
                    })
                        .then(res => res.json())
                        .then(data => console.log(data))
                }
            }
        } else {
            let article = {
                title: state.title,
                desc: state.desc,
                articleBody: state.articleBody,
                author: state.author,
                majorCat: state.majorCat,
                img: state.img,
            }
            // setArticle(article)
        }
        dispatch(clear())
        setImg(undefined)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const imgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImg(e.target.files)
        }
    }

    return (
        <>
            <form action="" className="md:grid grid-cols-2 flex flex-col justify-center items-center gap-y-4 gap-x-4 mt-20 dark:text-white w-[90%] mx-auto" onSubmit={submitHandler}>

                <div className="flex items-center justify-between sm:w-80 w-72">
                    <label htmlFor="name" className="">
                        {article ? 'نام مقاله' : "نام محصول"}
                    </label>
                    <input value={state.title} onChange={e => dispatch(change({ input: 'title', value: e.target.value }))} type="text" className=" rounded text-black py-2 px-4 w-2/3" id="name" required autoComplete="true" />
                </div>

                <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                    <label htmlFor="desc" className="">
                        {article ? 'مقدمه' : "توضیحات"}
                    </label>
                    <textarea value={state.desc} onChange={e => dispatch(change({ input: 'desc', value: e.target.value }))} className=" rounded text-black py-2 px-4 w-2/3" id="desc" required />
                </div>

                {!article ?
                    <>
                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="cost" className="">قیمت خرید</label>
                            <input value={state.cost} onChange={e => dispatch(change({ input: 'cost', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="cost" required />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="price" className="">قیمت فروش</label>
                            <input value={state.price} onChange={e => dispatch(change({ input: 'price', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="price" required />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="discount" className="">تخفیف</label>
                            <input value={state.discount} onChange={e => dispatch(change({ input: 'discount', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="discount" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="discountDate" className="">مدت تخفیف</label>
                            <input value={state.discountDate} onChange={e => dispatch(change({ input: 'discountDate', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="discountDate" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="count" className="">تعداد</label>
                            <input value={state.count} onChange={e => dispatch(change({ input: 'count', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="count" required />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="showCount" className="">تعداد نمایشی</label>
                            <input value={state.showCount} onChange={e => dispatch(change({ input: 'showCount', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="showCount" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="majorCat" className="">دسته‌بندی کلی</label>
                            <select value={state.majorCat} onChange={e => { dispatch(change({ input: 'majorCat', value: e.target.value })); dispatch(clearCat()) }} name="دسته‌بندی" id="majorCat" className="text-black w-2/3 py-2 px-4 rounded" required>
                                <option value="">__ انتخاب کنید __</option>
                                {links.map((c, i) => (
                                    <option value={c.txt} key={i}>{c.txt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="category" className="">دسته‌بندی</label>
                            <select value={state.category} onChange={e => dispatch(change({ input: 'category', value: e.target.value }))} name="دسته‌بندی" id="category" className="text-black w-2/3 py-2 px-4 rounded" required>
                                {state.majorCat ?
                                    <option value="">__ انتخاب کنید __</option> :
                                    <option value="">دسته‌بندی را انتخاب کنید</option>}
                                {state.majorCat &&
                                    links.filter(c => (
                                        c.txt === state.majorCat
                                    ))[0].subLinks
                                        .map((c, i) => (
                                            <option value={c.link} key={i + 20}>{c.link}</option>
                                        ))
                                }
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="brand" className="">مدل</label>
                            <select value={state.brand} onChange={e => dispatch(change({ input: 'brand', value: e.target.value }))} name="مدل" id="brand" className="text-black w-2/3 py-2 px-4 rounded" required >
                                {state.category ?
                                    <option value="">__ انتخاب کنید __</option> :
                                    <option value="">دسته‌بندی را انتخاب کنید</option>}
                                {state.category &&
                                    links.filter(c => (
                                        c.txt === state.majorCat
                                    ))[0].subLinks.filter(c => (
                                        c.link === state.category
                                    ))[0].brand
                                        .map((c, i) => (
                                            // c != "همه" &&
                                            <option value={c} key={i + 40}>{c}</option>
                                        ))
                                }
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="size" className="">سایز</label>
                            {state.category === "کتاب" ?
                                <select value={state.size} onChange={e => dispatch(change({ input: 'size', value: e.target.value }))} name="سایز" id="size" className="text-black w-2/3 py-2 px-4 rounded">
                                    <option value="">__ انتخاب کنید __</option>
                                    <option value="رحلی">رحلی‌بزرگ</option>
                                    <option value="رحلی">رحلی</option>
                                    <option value="نیم‌رحلی">نیم‌رحلی</option>
                                    <option value="وزیری">وزیری</option>
                                    <option value="وزیری">پالتویی</option>
                                    <option value="وزیری">جیبی</option>
                                </select> :
                                <input value={state.size} onChange={e => dispatch(change({ input: 'size', value: e.target.value }))} type="text" className=" rounded text-black py-2 px-4 w-2/3" id="size" />
                            }
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="status" className="">وضعیت</label>
                            <select value={state.status} onChange={e => dispatch(change({ input: 'status', value: e.target.value }))} name="وضعیت" id="status" className="text-black w-2/3 py-2 px-4 rounded">
                                <option value="">__ انتخاب کنید __</option>
                                <option value="نو">نو</option>
                                <option value="درحد‌نو">درحد‌نو</option>
                                <option value="دسته‌دوم">دسته‌دوم</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="author" className="">نویسنده</label>
                            <div className="flex w-2/3">
                                <input value={state.author} onChange={e => dispatch(change({ input: 'author', value: e.target.value }))} type="text" className=" rounded-r text-black py-2 px-4 w-full" id="author" />
                                <select value={state.author} onChange={e => dispatch(change({ input: 'author', value: e.target.value }))} name="وضعیت" className="text-black w-0 py-2 px-4 rounded-l">
                                    <option value="">__ انتخاب کنید __</option>
                                    {state.author &&
                                        Author.filter((i) => (
                                            i.lastname.includes(state.author.trim()) ||
                                            i.firstname.includes(state.author.trim())
                                        ))
                                            .map((c) => (
                                                <option value={c._id} key={c._id}>{`${c.firstname} ${c.lastname}`}</option>
                                            ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="publisher" className="">انتشارات</label>
                            <input value={state.publisher} onChange={e => dispatch(change({ input: 'publisher', value: e.target.value }))} type="text" className=" rounded text-black py-2 px-4 w-2/3" id="publisher" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="publishDate" className="">نوبت چاپ</label>
                            <input value={state.publishDate} onChange={e => dispatch(change({ input: 'publishDate', value: e.target.value }))} type="text" className=" rounded text-black py-2 px-4 w-2/3" id="publishDate" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="weight" className="">وزن محصول</label>
                            <input value={state.weight} onChange={e => dispatch(change({ input: 'weight', value: e.target.value }))} type="number" className=" rounded text-black py-2 px-4 w-2/3" id="weight" />
                        </div>
                    </>
                    :
                    <>
                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="author" className="">نویسنده</label>
                            <input value={state.author} onChange={e => dispatch(change({ input: 'author', value: e.target.value }))} type="text" className=" rounded text-black py-2 px-4 w-2/3" id="author" />
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                            <label htmlFor="articleBody" className="">
                                متن مقاله
                            </label>
                            <textarea value={state.articleBody} onChange={e => dispatch(change({ input: 'articleBody', value: e.target.value }))} className=" rounded text-black py-2 px-4 w-2/3" id="articleBody" />
                        </div>
                    </>
                }

                <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                    <label htmlFor="img" className="">تصاویر</label>
                    <input onChange={e => imgHandler(e)} type="file" multiple className=" rounded text-black py-2 px-4 w-2/3" id="img" />
                </div>

                <button className={`py-2.5 md:mt-6 mt-10 w-full rounded-full col-start-1 col-end-3 bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                    type='submit'
                >
                    {article ? 'ثبت مقاله' : "ثبت محصول"}
                </button>
            </form>
        </>
    );
}

export default CMSForm;