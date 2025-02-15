import { IconButton, Modal } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ChromeReaderModeRoundedIcon from '@mui/icons-material/ChromeReaderModeRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import PaginationBox from '../Boxes/PaginationBox'
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArticles } from "../../Redux/Article";
import { getProducts } from "../../Redux/Category";
import { search } from "../../Redux/Pagination";
import { countPerPage } from "../../Redux/Pagination";
import { reduxType } from "../Types/redux";
import { productCoverType, productSingleType } from "../Types/product";
import { articleCoverType } from "../Types/article";
import { ticketType } from "../Types/ticket";
import { orderType } from "../Types/order";
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import { change } from "../../Redux/Inputs";
import { userType } from "../Types/user";


function CMSBox({ type, row, ordersState, ticketState }: { type: string, row?: number, ordersState?: orderType[], ticketState?: ticketType[] }) {

    const jwt = localStorage.getItem("jwt")
    const dispatch = useDispatch<any>()
    const page = useSelector((state: reduxType) => state.pagination)
    const state = useSelector((state: reduxType) => state.category)
    const articleState = useSelector((state: reduxType) => state.articles)
    const [deletModal, setDeleteModal] = useState(false)
    const [Order, setOrder] = useState<orderType>()
    const [receipt, setReceipt] = useState(false)
    const [EditImg, setEditImg] = useState(false)
    const [postVerify, setPostVerify] = useState('')
    const [Id, setId] = useState<string>('')
    const [array, setArray] = useState<productCoverType | articleCoverType | ticketType[] | orderType[] | userType[]>([])
    const [orderArray, setOrderArray] = useState<orderType[]>([])
    const [UserArray, setUserArray] = useState<userType[]>([])
    const [product, setProduct] = useState<{ product: productSingleType }>()
    const [img, setImg] = useState<any>()

    const imgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImg(e.target.files)
        }
    }

    useEffect(() => {
        if (product?.product._id) {
            dispatch(change({ input: 'title', value: product.product.title }))
            dispatch(change({ input: 'desc', value: product.product.desc }))
            dispatch(change({ input: 'cost', value: product.product.cost[product.product.cost.length - 1].cost }))
            dispatch(change({ input: 'price', value: product.product.price[product.product.price.length - 1].price }))
            dispatch(change({ input: 'discount', value: product.product.discount[product.product.discount.length - 1].discount }))
            dispatch(change({ input: 'count', value: product.product.count }))
            dispatch(change({ input: 'showCount', value: product.product.showCount }))
            dispatch(change({ input: 'majorCat', value: product.product.majorCat }))
            dispatch(change({ input: 'category', value: product.product.minorCat }))
            dispatch(change({ input: 'brand', value: product.product.brand }))
            dispatch(change({ input: 'size', value: product.product.size }))
            dispatch(change({ input: 'status', value: product.product.status }))
            dispatch(change({ input: 'publisher', value: product.product.publisher }))
            dispatch(change({ input: 'publishDate', value: product.product.publishDate }))
            dispatch(change({ input: 'weight', value: product.product.weight }))
            dispatch(change({ input: 'id', value: product.product._id }))
        }
    }, [product])

    useEffect(() => {
        switch (type) {
            case "محصولات":
                let a = [...state]
                    .filter((i) => (
                        i.title.includes(page.search.trim())
                    ))
                setArray(a)
                break;
            case "مقالات":
                let b = [...articleState]
                    .filter((i) => (
                        i.title.includes(page.search.trim())
                    ))
                setArray(b)
                break;
            case "تیکت‌ها":
                if (ticketState) {
                    let c = [...ticketState]
                        .filter((i) => (
                            !i.response
                        ))
                        .filter((i) => (
                            i.userId.name.includes(page.search.trim())
                        ))
                    setArray(c)
                }
                break;
            case "سفارشات":
                if (ordersState) {
                    let d = [...ordersState]
                        .filter((i) => (
                            i.status == "در حال آماده‌سازی"
                        ))
                        .filter((i) => (
                            i.userId?.name.includes(page.search.trim())
                        ))

                    let e = [...ordersState]
                        .filter((i) => (
                            i.userId?.name.includes(page.search.trim())
                        ))
                    setArray(d)
                    setOrderArray(e)
                }
                break;
            case "کاربران":
                if (UserArray) {
                    let f = [...UserArray]
                        .filter((i) => (
                            i.name.includes(page.search.trim())
                        ))
                    setArray(f)
                }
                break;

            default:
                setArray([...state].filter((i) => (
                    i.title.includes(page.search.trim())
                )))
                break;
        }
    }, [state, articleState, ticketState, page.search, ordersState, UserArray])

    const searchHandler = (e: string) => {
        dispatch(search({ txt: e }))
    }

    const editHandler = async (id: string) => {
        if (type == "تیکت‌ها") {

        } else if (type == "محصولات") {
            fetch(`https://api.neynegar1.ir/products/${id}`)
                .then(res => res.json())
                .then(data => { setProduct(data); window.scrollTo({ top: 0, behavior: "smooth" }) })
        } else if (type == "سفارشات") {

        }
    }

    const editPhoto = async () => {
        if (jwt) {
            if (type == "محصولات") {
                let product = new FormData()
                if (img) {
                    product.append("img", img[0])
                    img[1] && product.append("img", img[1])
                    img[2] && product.append("img", img[2])
                    img[3] && product.append("img", img[3])
                }
                await fetch(`https://api.neynegar1.ir/products/add-imgs/${Id}`, {
                    method: "PUT",
                    headers: {
                        'authorization': jwt,
                    },
                    body: product
                })
                    .then(res => res.json())
                    .then(data => {
                        setId("")
                        if (!data.state) {
                            console.log(data.msg)
                        }
                    })
                setEditImg(false)
            }
        }
    }

    const modalHandler = async () => {
        if (jwt) {
            if (type == "محصولات") {
                await fetch(`https://api.neynegar1.ir/products/remove/${Id}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': jwt,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setId("")
                        if (!data.state) {
                            console.log(data.msg)
                        }
                    })
            } else if (type == "سفارشات") {
                await fetch(`https://api.neynegar1.ir/orders/submit-order/${Id}`, {
                    method: "PUT",
                    headers: {
                        'authorization': jwt,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        postVerify
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        setId("")
                        if (!data.state) {
                            console.log(data.msg)
                        }
                    })
                setPostVerify("")
            }
        }
        setDeleteModal(false)
    }

    useMemo(async () => {
        switch (type) {
            case "محصولات":
                dispatch(getProducts(""))
                break;
            case "مقالات":
                dispatch(getArticles(""))
                break;
            case "کاربران":
                if (jwt) {
                    await fetch(`https://api.neynegar1.ir/users`, {
                        headers: {
                            'authorization': jwt
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            setUserArray(data)
                        })
                }
                break;
            default:
                break;
        }

        dispatch(search({ txt: '' }))
        dispatch(countPerPage({ num: 12 }))
    }, [type])

    return (
        <>
            <div className={`bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid relative border-white dark:border-slate-800 rounded-xl p-4 lg:col-start-2 col-end-5 col-start-1 ${row == 2 ? "lg:row-start-1 row-start-2" : "lg:row-start-2 row-start-3"} pt-20`}>

                <h3 className="text-lg font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                    {type}
                </h3>

                {/* searchBox start */}
                <div className="flex justify-center absolute top-6 left-3 items-center gap-2 bg-sky-200 dark:bg-slate-800 transition-all w-fit rounded-lg shadow-md">
                    <div className="text-slate-700">
                        <input type="text"
                            className="py-1 px-4 outline-none rounded-full bg-sky-200 transition-all dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-200 placeholder:text-slate-600 md:w-full w-36"
                            placeholder={`جستجو ${type}`}
                            value={page.search}
                            onChange={e => searchHandler(e.target.value)}
                            id="search"
                        />
                    </div>
                    <IconButton >
                        <div className="dark:text-white h-6 -translate-y-1">
                            <SearchRoundedIcon />
                        </div>
                    </IconButton>
                </div>
                {/* searchBox end */}

                {/* (product , article , ...) section start  */}
                {array && array
                    .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                    .map((c: any) => (
                        <div className="mt-5 border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 bg-white outline-white shadow-cs py-2 px-4 outline-[4px] outline border-2 border-solid rounded-xl flex justify-between items-center sm:flex-row flex-col gap-3 dark:text-white"
                            key={c._id}>
                            <img src={`https://api.neynegar1.ir/imgs/${c.cover}`} alt="" className={`${type === 'مقالات' ? 'w-40 rounded-lg' : 'w-20 rounded-full'} ${type === 'محصولات' && 'rounded-lg'} h-20 object-cover ${c.cover ? 'block' : 'hidden'}`} />
                            <div className={`${c.cover ? 'hidden' : 'block'} text-slate-500 dark:text-white transition-all`}>
                                <AccountCircleTwoToneIcon sx={{ fontSize: '4rem' }} />
                            </div>
                            <h2 className="">{type == "تیکت‌ها" || type === 'سفارشات' ? c.userId.name : (type == "کاربران" ? c.name : c.title.split(":")[0])}</h2>
                            {type === 'مقالات' || type === 'سفارشات' &&
                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">آیدی: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c._id}</span></p>
                            }
                            {type === 'تیکت‌ها' &&
                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">عنوان: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c.title}</span></p>
                            }
                            {type === 'کاربران' &&
                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">شماره تماس: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c.phone}</span></p>
                            }
                            {type === 'کاربران' &&
                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">وضعیت : <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c.status}</span></p>
                            }
                            {type === 'محصولات' && c.price && c.discount &&
                                <>
                                    <p className="">موجودی: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c.count.toLocaleString('fa-IR')}</span></p>
                                    <p className="">قیمت: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{(c.price[c.price.length - 1].price * ((100 - c.discount[c.discount.length - 1].discount) / 100)).toLocaleString('fa-IR')}</span></p>
                                </>
                            }
                            {type != "کاربران" &&
                                <div className="bg-sky-200 dark:bg-slate-600 rounded-md flex-wrap w-fit">

                                    {type !== 'سفارشات' &&
                                        <IconButton onClick={() => editHandler(c._id)}>
                                            <div className=" w-6 h-6 dark:text-white -translate-y-1">
                                                <EditRoundedIcon />
                                            </div>
                                        </IconButton>
                                    }

                                    {(type !== 'تیکت‌ها' && type !== 'سفارشات') &&
                                        <IconButton
                                            onClick={() => { setEditImg(true); setId(c._id) }}>
                                            <div className=" w-6 h-6 dark:text-white -translate-y-1">
                                                <AddPhotoAlternateRoundedIcon />
                                            </div>
                                        </IconButton>
                                    }

                                    <IconButton
                                        onClick={() => {
                                            if (type == 'سفارشات') {
                                                setReceipt(true)
                                                setOrder(c)
                                            }
                                        }}>
                                        <div className=" w-6 h-6 dark:text-white -translate-y-1">
                                            <ChromeReaderModeRoundedIcon />
                                        </div>
                                    </IconButton>

                                    <IconButton onClick={() => { setDeleteModal(true); setId(c._id) }}>
                                        <div className={`w-6 h-6 ${type !== 'سفارشات' ? 'text-red-500' : 'text-green-500'} -translate-y-1`}>
                                            {type !== 'سفارشات' ?
                                                <DeleteForeverRoundedIcon /> :
                                                <CheckCircleOutlineRoundedIcon />
                                            }
                                        </div>
                                    </IconButton>

                                </div>
                            }
                        </div>
                    ))}
                {/* (product , article , ...) section start  */}
                {array.length > page.countPerPage &&
                    <PaginationBox count={Math.ceil(array.length / page.countPerPage)} />
                }
            </div>

            {type == "سفارشات" &&
                <div className={`bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid relative border-white dark:border-slate-800 rounded-xl p-4 lg:col-start-2 col-end-5 col-start-1 ${row == 2 ? "lg:row-start-2 row-start-3" : "lg:row-start-3 row-start-4"} pt-20`}>

                    <h3 className="text-lg font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                        {`همه ${type}`}
                    </h3>

                    {/* searchBox start */}
                    <div className="flex justify-center absolute top-6 left-3 items-center gap-2 bg-sky-200 dark:bg-slate-800 transition-all w-fit rounded-lg shadow-md">
                        <div className="text-slate-700">
                            <input type="text"
                                className="py-1 px-4 outline-none rounded-full bg-sky-200 transition-all dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-200 placeholder:text-slate-600 md:w-full w-36"
                                placeholder={`جستجو ${type}`}
                                value={page.search}
                                onChange={e => searchHandler(e.target.value)}
                                id="search"
                            />
                        </div>
                        <IconButton >
                            <div className="dark:text-white h-6 -translate-y-1">
                                <SearchRoundedIcon />
                            </div>
                        </IconButton>
                    </div>
                    {/* searchBox end */}

                    {/* (product , article , ...) section start  */}
                    {orderArray && orderArray
                        .reverse()
                        .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                        .map((c: any) => (
                            <div className="mt-5 border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 bg-white outline-white shadow-cs py-2 px-4 outline-[4px] outline border-2 border-solid rounded-xl flex justify-between items-center sm:flex-row flex-col gap-3 dark:text-white"
                                key={c._id}>

                                <h2 className="">{c.userId.name}</h2>
                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">آیدی: <span className='bg-sky-200 dark:bg-slate-600 py-1 px-2 rounded-md'>{c._id}</span></p>

                                <p className="flex sm:flex-row flex-col gap-2 justify-center items-center">وضعیت: <span className={`py-1 px-2 rounded-md ${c.status == "پرداخت نشده" ? "bg-red-300 dark:text-slate-800" : (c.status == "ارسال شد" ? "bg-lime-300 dark:text-slate-800" : "bg-sky-200 dark:bg-slate-600 ")}`}>{c.status}</span></p>

                                <div className="bg-sky-200 dark:bg-slate-600 rounded-md flex-wrap w-fit">

                                    <IconButton onClick={() => editHandler(c._id)}>
                                        <div className=" w-6 h-6 dark:text-white -translate-y-1">
                                            <EditRoundedIcon />
                                        </div>
                                    </IconButton>

                                    <IconButton
                                        onClick={() => {
                                            if (type == 'سفارشات') {
                                                setReceipt(true)
                                                setOrder(c)
                                            }
                                        }}>
                                        <div className=" w-6 h-6 dark:text-white -translate-y-1">
                                            <ChromeReaderModeRoundedIcon />
                                        </div>
                                    </IconButton>

                                </div>
                            </div>
                        ))}
                    {/* (product , article , ...) section start  */}
                    {array.length > page.countPerPage &&
                        <PaginationBox count={Math.ceil(array.length / page.countPerPage)} />
                    }
                </div >
            }

            {/* delete modal start */}
            <Modal
                open={deletModal}
                onClose={() => setDeleteModal(false)}
            >
                <div className=" top-1/2 -translate-y-1/2 absolute left-1/2 -translate-x-1/2 w-fit outline-[4px] outline border-2 border-solid border-[rgba(0,0,0,0.4)] rounded-xl p-4 bg-sky-100 outline-sky-100 dark:bg-slate-400 dark:outline-slate-400 font-[vazir]">
                    <p className=" text-black">
                        {type == "محصولات" ?
                            "آیا از حذف محصول اطمینان دارید؟" :
                            "آیا از ثبت سفارش اطمینان دارید؟"
                        }
                    </p>
                    {type == 'سفارشات' &&
                        <input type="text"
                            className="py-1 px-4 outline-none mt-3 rounded-md bg-sky-300 transition-all dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-200 placeholder:text-slate-600 md:w-full w-36"
                            placeholder={`کد رهگیری`}
                            value={postVerify}
                            onChange={e => setPostVerify(e.target.value)}
                        />
                    }
                    <div className=" flex gap-4 justify-center">
                        <button className={`py-2.5 md:mt-6 mt-10 px-6 rounded-full col-start-1 col-end-3 ${type == "محصولات" ? "bg-red-500 border-red-400 hover:bg-red-600" : "bg-lime-500 border-lime-400 hover:bg-lime-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900"} active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400`}
                            onClick={() => modalHandler()}
                        >
                            {type == "محصولات" ?
                                "حذف" :
                                "ثبت"
                            }
                        </button>
                        <button className={`py-2.5 md:mt-6 mt-10 px-6 rounded-full col-start-1 col-end-3 bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                            onClick={() => setDeleteModal(false)}
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            </Modal>
            {/* delete modal end */}

            {/* receipt modal starts */}
            <Modal
                open={receipt}
                onClose={() => setReceipt(false)}
            >
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-[Vazir] w-[95vw] h-[80vh] overflow-y-scroll scroll-smooth scrollbar-hidden flex flex-col justify-between" dir="rtl">
                    <div className="">
                        <h1 className="font-bold text-2xl my-3 text-center text-blue-600 dark:text-blue-300">فروشگاه نی‌نگار</h1>
                        <hr className="mb-4" />
                        <div className="flex justify-between mb-4">
                            <div className="text-gray-700 dark:text-white leading-7">
                                <div>{`تاریخ: ${Order?.createdAt}`}</div>
                                <div>{`سفارش: ${Order?._id.slice(0, 5)}`}</div>
                                <div>{`کد رهگیری پرداخت: ${Order?.paymentId}`}</div>
                                {Order?.submition != "پیک موتوری" &&
                                    <div>{`کد رهگیری پست: ${Order?.postVerify}`}</div>
                                }
                            </div>
                            <div className=" text-slate-800 dark:text-white">
                                <ReceiptRoundedIcon />
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="text-gray-700 dark:text-white mb-4">{Order?.userId && Order.userId.name}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{`${Order?.userId && Order.userId.address.split("%%")[0]}/${Order?.userId && Order.userId.address.split("%%")[1]}`}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{Order?.userId && Order.userId.address.split("%%")[2]}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{`شماره تماس: ${Order?.userId && Order.userId.phone}`}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{`کدپستی: ${Order?.userId && Order.userId.postCode}`}</div>
                            <div className="text-gray-700 bg-sky-100 border-sky-200 border-solid border-2 rounded-md w-fit px-2 py-1">{Order?.submition}</div>
                        </div>
                        <table className="w-full mb-8 px-8">
                            <thead>
                                <tr>
                                    <th className="text-right font-bold text-gray-700 dark:text-white">محصول</th>
                                    <th className="text-left font-bold text-gray-700 dark:text-white">قیمت</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Order?.products.map(p => (
                                    <tr>
                                        <td className="text-right text-gray-700 dark:text-white">{`${p.productId.title}(${p.count.toLocaleString('fa-IR')})`}</td>
                                        <td className="text-left text-gray-700 dark:text-white">{p.price ? p.price.toLocaleString('fa-IR') : p.productId.price[p.productId.price.length - 1].price.toLocaleString('fa-IR')}
                                            <span className=" text-xs font-mono"> تومان</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="text-right font-bold text-gray-700 dark:text-white">تخفیف</td>
                                    <td className="text-left font-bold text-gray-700 dark:text-white">{Order?.discount.toLocaleString('fa-IR')}
                                        <span className=" text-xs font-mono"> تومان</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold text-gray-700 dark:text-white">جمع کل</td>
                                    <td className="text-left font-bold text-gray-700 dark:text-white">{`${Order?.totalPrice && ((Order.totalPrice / 10).toLocaleString('fa-IR'))} `}
                                        <span className="text-xs font-mono">تومان</span>
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                    <div className="text-gray-700 dark:text-white">از سفارش شما سپاس‌گذاریم. ❤️</div>
                </div>
            </Modal>
            {/* receipt modal ends */}

            <Modal
                open={EditImg}
                onClose={() => setEditImg(false)}
            >
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-[Vazir] w-[95vw] h-[80vh] overflow-y-scroll scroll-smooth scrollbar-hidden flex flex-col justify-between" dir="rtl">
                    <div className="flex items-center justify-between gap-4 sm:w-80 w-72">
                        <label htmlFor="img" className="">تصاویر</label>
                        <input onChange={e => imgHandler(e)} type="file" multiple className=" rounded text-black py-2 px-4 w-2/3" id="img" />
                    </div>
                    <div className=" flex gap-4 justify-center">
                        <button className={`py-2.5 md:mt-6 mt-10 px-6 rounded-full col-start-1 col-end-3 bg-lime-500 border-lime-400 hover:bg-lime-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400`}
                            onClick={() => editPhoto()}
                        >
                            ثبت
                        </button>
                        <button className={`py-2.5 md:mt-6 mt-10 px-6 rounded-full col-start-1 col-end-3 bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                            onClick={() => setEditImg(false)}
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CMSBox;