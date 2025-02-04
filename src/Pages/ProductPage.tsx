import { IconButton, Modal } from '@mui/material';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import { useEffect, useRef, useState } from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import Rating from '@mui/material/Rating';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link } from 'react-router-dom';
import CommentInput from '../Components/Comment/CommentInput';
import SuggestionBox from '../Components/Boxes/SuggestionBox';
import CommentBox from '../Components/Comment/CommentBox';
import { useParams } from 'react-router-dom';
import { getProduct } from '../Redux/productPage'
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton';
import { reduxType } from '../Components/Types/redux';
import AlertBox from "../Components/Boxes/AlertBox"

type bas = {
    productId: string,
    count: number
}

function Product() {
    const dispatch = useDispatch<any>()
    const state = useSelector((state: reduxType) => state.product)

    const { id } = useParams()
    const [img, setImg] = useState("")
    const [AppVersion, setAppVersion] = useState(false)
    const [ban, setBan] = useState(false);
    const [contact, setContact] = useState(false);
    const [replyId, setReplyId] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [replyComment, setReplyComment] = useState<{ _id: string, user: string } | undefined>(undefined);
    const [alert, setAlert] = useState(false);
    const [alertTxt, setAlertTxt] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const commentScroll = useRef<HTMLDivElement>(null)
    const commentBoxScroll = useRef<HTMLDivElement>(null)
    const jwt = localStorage.getItem("jwt")

    useEffect(() => {
        dispatch(getProduct(id))
        if (jwt) {
            fetch(`https://api.neynegar1.ir/users/verify`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state && data.user.status == "notifUser") {
                        setBan(true)
                    }
                })
        }
    }, [replyId, refresh])

    useEffect(() => {
        if (state.product?.cover) {
            setImg(`https://api.neynegar1.ir/imgs/${state.product?.cover}`)
        }
        if (navigator.appVersion.includes("Mobile")) {
            setAppVersion(true)
        }
    }, [state])

    useEffect(() => {
        if (state.comments && replyId.length > 0) {
            let com = state.comments.filter(c => (
                c._id == replyId
            ))
            setReplyComment({ _id: replyId, user: com[0].userId.name })
        }
    }, [replyId])

    const Handler = async (jwt: string, body: object) => {
        await fetch(`https://api.neynegar1.ir/users/update-user`, {
            method: "PUT",
            headers: {
                'authorization': jwt,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                if (!data.state) {
                    console.log(data.msg)
                }
            })
    }

    const favoriteHandler = () => {
        if (jwt) {
            Handler(jwt, {
                favorite: [{
                    productId: id
                }]
            })
            setAlertStatus("yes")
            setAlertTxt("این محصول به لیست علاقه‌مندی‌های شما اضافه شد.")
            setAlert(true)
        }
        else {
            setAlertStatus("no")
            setAlertTxt("لطفا ابتدا وارد حساب کاربری خود شوید.")
            setAlert(true)
        }
    }

    const notifHandler = () => {
        if (jwt) {
            Handler(jwt, {
                status: "notifUser"
            })
            setAlertStatus("yes")
            setAlertTxt("اعلان محصولات برای شما فعال شد.")
            setAlert(true)
        }
        else {
            setAlertStatus("no")
            setAlertTxt("لطفا ابتدا وارد حساب کاربری خود شوید.")
            setAlert(true)
        }
    }

    const notifAndFavHandler = () => {
        if (jwt) {
            Handler(jwt, {
                status: "notifUser"
            })
            Handler(jwt, {
                favorite: [{
                    productId: id
                }]
            })
            setAlertStatus("yes")
            setAlertTxt("اعلان محصولات برای شما فعال شد.")
            setAlert(true)
        }
        else {
            setAlertStatus("no")
            setAlertTxt("لطفا ابتدا وارد حساب کاربری خود شوید.")
            setAlert(true)
        }
    }

    const shareHandler = () => {
        navigator.clipboard.writeText(`https://neynegar1.ir/product/${id}`)
        setAlertStatus("yes")
        setAlertTxt("لینک این محصول در حافظه شما کپی شد.")
        setAlert(true)
    }

    const commentScrollHandler = () => {
        commentScroll.current?.scrollIntoView({ behavior: "smooth" })
    }

    const valueHandler = (val: number) => {
        if (val > 0 && val <= 0.5) {
            return 'ضعیف'
        }
        else if (val > 0.5 && val <= 1) {
            return '+ ضعیف'
        }
        else if (val > 1 && val <= 1.5) {
            return 'متوسط'
        }
        else if (val > 1.5 && val <= 2) {
            return '+ متوسط'
        }
        else if (val > 2 && val <= 2.5) {
            return 'خوب'
        }
        else if (val > 2.5 && val <= 3) {
            return '+ خوب'
        }
        else if (val > 3 && val <= 3.5) {
            return 'خیلی‌خوب'
        }
        else if (val > 3.5 && val <= 4) {
            return '+ خیلی‌خوب'
        }
        else if (val > 4 && val <= 4.5) {
            return 'عالی'
        }
        else if (val > 4.5 && val <= 5) {
            return '+ عالی'
        }
    }

    const addLocalBascket = async (bas: bas) => {
        let bascket = localStorage.getItem("bascket")
        if (bascket) {
            let newBas
            let validBascket: bas[] = JSON.parse(bascket)

            let filBas = validBascket.filter((b: bas) => (
                b.productId == bas.productId
            ))

            if (filBas.length > 0) {
                // filBas[0].count = filBas[0].count + 1
                let notFilBas = validBascket.filter((b: bas) => (
                    b.productId != filBas[0].productId
                ))

                newBas = [...notFilBas, filBas[0]]
            } else {
                newBas = [...validBascket, bas]
            }

            localStorage.setItem("bascket", JSON.stringify(newBas))
        } else {
            localStorage.setItem("bascket", JSON.stringify([bas]))
        }
    }

    const addToBascket = () => {
        if (jwt) {
            fetch(`https://api.neynegar1.ir/users/add-bascket-single`, {
                method: "PUT",
                headers: {
                    'authorization': jwt,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bas: [{
                        productId: id,
                        count: 1
                    }]
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.state) {
                        console.log(data.msg)
                    }
                })
        }
        else {
            addLocalBascket({ productId: id ? id : '', count: 1 })
        }
        setAlertStatus("yes")
        setAlertTxt("این محصول به سبد خرید شما اضافه شد.")
        setAlert(true)
    }

    return (
        <div className="sm:w-[85vw] w-[98vw] mx-auto mt-32 grid gap-10 relative">
            {/* starts of fixed buy button */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 shadow-css sm:hidden w-full bg-sky-100 dark:gr2dark rounded-t-2xl p-4 text-center z-50">
                {state.product &&
                    <button className={`transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 py-2.5 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1`}
                        onClick={() => { state.product.showCount > 0 ? addToBascket() : notifAndFavHandler() }}
                    >
                        {state.product.showCount > 0 ? "اضافه به سبد خرید" : "موجود شد خبر بده"}
                    </button>
                }
            </div>
            {/* ends of fixed buy button */}

            {/* starts of products images */}
            <div className="col-start-1 lg:col-end-4 col-end-8 row-start-1 lg:row-end-3 w-full bg-sky-100 dark:gr2dark dark:outline-slate-600 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 rounded-xl pt-10 pb-4 px-4 flex flex-col justify-between dark:text-white">
                <div className="lg:block md:flex block gap-8">
                    <div className="rounded-xl outline-[4px] outline border-2 border-solid py-8 pl-6 pr-12 border-sky-100 dark:border-slate-600 shadow-cs bg-white outline-white relative w-fit mx-auto lg:mb-0 md:mb-4">
                        {state.product?.cover ?
                            <img src={img} alt="" className="bg-contain rounded-xl" /> :
                            <div className="md:w-[288px] w-[200px] md:h-[384px] h-[300px] rounded-lg overflow-hidden">
                                <Skeleton variant="rectangular" className='rounded-lg' width={288} height={384} />
                            </div>
                        }

                        <div className=" absolute top-10 right-1">
                            <div className="[&>p]:hover:block relative">
                                <IconButton onClick={() => favoriteHandler()} color='primary'>
                                    <FavoriteRoundedIcon />
                                </IconButton>
                                <p className=" absolute top-1/2 -translate-y-1/2 right-12 hidden text-nowrap py-1 px-2 dark:gr2dark dark:text-white bg-sky-200 shadow-md rounded-lg text-sky-900">اضافه به علاقه‌مندی‌ها</p>
                            </div>
                            <div className="[&>p]:hover:block relative">
                                <IconButton onClick={() => notifHandler()} color='primary'>
                                    <NotificationsActiveRoundedIcon />
                                </IconButton>
                                <p className=" absolute top-1/2 -translate-y-1/2 right-12 hidden text-nowrap py-1 px-2 dark:gr2dark dark:text-white bg-sky-200 shadow-md rounded-lg text-sky-900">اطلاع‌رسانی شگفت‌انگیز‌ها</p>
                            </div>
                            <div className="[&>p]:hover:block relative">
                                <IconButton onClick={() => shareHandler()} color='primary'>
                                    <ShareRoundedIcon />
                                </IconButton>
                                <p className=" absolute top-1/2 -translate-y-1/2 right-12 hidden text-nowrap py-1 px-2 dark:gr2dark dark:text-white bg-sky-200 shadow-md rounded-lg text-sky-900">اشتراک‌گذاری محصول</p>
                            </div>
                            <div className="[&>p]:hover:block relative">
                                <IconButton onClick={() => commentScrollHandler()} color='primary'>
                                    <CommentRoundedIcon />
                                </IconButton>
                                <p className=" absolute top-1/2 -translate-y-1/2 right-12 hidden text-nowrap py-1 px-2 dark:gr2dark dark:text-white bg-sky-200 shadow-md rounded-lg text-sky-900">ثبت دیدگاه</p>
                            </div>
                        </div>
                    </div>
                    <div className=" w-fit mx-auto flex flex-col justify-between">
                        <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hidden border-sky-100 dark:border-slate-600 mt-8 bg-white outline-white shadow-cs py-2 px-4 outline-[4px] outline border-2 border-solid rounded-xl  h-fit">
                            < img src={`https://api.neynegar1.ir/imgs/${state.product?.cover}`} alt="" className="w-20 h-22 bg-contain cursor-pointer rounded-lg" onClick={e => setImg(e.currentTarget.src)} />
                            {state.product?.imgs &&
                                state.product.imgs.split(",").map((i: string) => (
                                    < img src={`https://api.neynegar1.ir/imgs/${i}`} alt="" className="w-20 h-22 bg-contain cursor-pointer rounded-lg" onClick={e => setImg(e.currentTarget.src)} key={i} />

                                ))
                            }
                        </div>
                        <div className=" w-[90%] text-center mx-auto mt-12 mb-8 lg:hidden md:block hidden ">
                            <p className="">
                                در صورت هرگونه سوال در مورد این محصول <br />با ما تماس بگیرید <span className="">:)</span>
                            </p>
                            <button className={`transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 py-2.5 mt-6 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1`}
                                onClick={() => setContact(true)}>
                                تماس با ما
                            </button>
                        </div>
                    </div>
                </div>

                <div className=" w-[90%] text-center mx-auto mt-12 mb-4 lg:block md:hidden">
                    <p className="">
                        در صورت هرگونه سوال در مورد این محصول <br />با ما تماس بگیرید <span className="">:)</span>
                    </p>
                    <button className={`transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 py-2.5 mt-6 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1`} onClick={() => setContact(true)}>
                        تماس با ما
                    </button>
                </div>


            </div>
            {/* ends of products images */}

            {/* starts of products details*/}
            <div className="lg:col-start-4 col-start-1 col-end-8 lg:row-start-1 lg:row-end-2 row-start-2 w-full bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:gr2dark dark:outline-slate-600 dark:text-white dark:border-slate-800 transition-all rounded-xl pt-10 pb-4 px-4 flex flex-col justify-between">

                <div className="">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {
                            state.product ?
                                state.product.title :
                                <Skeleton variant="text" width={150} height={45} />
                        }

                    </h2>
                    <div className="mt-4">
                        <p className="text-lg whitespace-pre-line">
                            {state.product ?
                                state.product.desc :
                                <Skeleton variant="text" width={350} height={35} />
                            }
                        </p>
                        <p className="leading-8 mt-2">
                            {state.product ?
                                (state.product.majorCat === "کتاب" ?
                                    `انتشارات: ${state.product.publisher}` :
                                    `مدل: ${state.product.brand}`) :
                                <Skeleton variant="text" width={250} />
                            }
                        </p>
                        <p className="leading-8">
                            {state.product ?
                                (state.product.majorCat === "کتاب" ? `نوبت چاپ: ${state.product.publishDate}` :
                                    state.product.color && `رنگ: ${state.product.color}`) :
                                <Skeleton variant="text" width={250} />
                            }
                        </p>
                        <p className="leading-8">
                            {state.product ?
                                `${state.product.majorCat === "کتاب" ? "قطع:" : "سایز:"} ${state.product.size}` :
                                <Skeleton variant="text" width={250} />
                            }
                        </p>
                    </div>
                </div>

                <div className="">
                    <div className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl grid gap-6 items-center justify-between">
                        {state.product ?
                            <div className="flex gap-4 col-start-2 col-end-3 row-start-1" dir='ltr'>
                                <Rating
                                    name="hover-feedback"
                                    value={state.product.popularity}
                                    precision={0.5}
                                    emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                                    icon={<StarRoundedIcon fontSize="inherit" />}
                                    readOnly
                                />
                                <p className="sm:block hidden">{valueHandler(state.product.popularity)}</p>
                            </div> :
                            <Skeleton variant="rectangular" className='rounded-md col-start-2 col-end-3 row-start-1' width={252.5} height={30} />
                        }
                        {state.product ?
                            <p className="col-start-1 col-end-2 row-start-1">موجودی: <span className={`text-lg text-nowrap ${state.product.showCount == 0 && " text-red-700 bg-red-200 p-1 rounded-md text-base"}`}>{state.product.showCount > 0 ? `${state.product.showCount.toLocaleString('fa-IR')} عدد` : `ناموجود`}</span></p> :
                            <Skeleton variant="rectangular" className='rounded-md col-start-1 col-end-2 row-start-1' width={252.5} height={30} />}

                        {state.product ?
                            <p className="col-start-2 col-end-3 row-start-2 place-self-center">وضعیت: <span className="text-lg text-nowrap">{state.product.status}</span></p> :
                            <Skeleton variant="rectangular" className='rounded-md col-start-2 col-end-3 row-start-2' width={252.5} height={30} />}
                        {state.product ?
                            <div className="col-start-1 col-end-2 row-start-2">
                                <p className={`${state.product.discount[state.product.discount.length - 1].discount > 0 ? 'block' : 'hidden'} line-through text-gray-500 text-sm leading-3`}>
                                    {state.product.price[state.product.price.length - 1].price.toLocaleString('fa-IR')}
                                </p>
                                <h2 className="text-xl leading-3">
                                    {state.product.discount[state.product.discount.length - 1].discount > 0 ? (state.product.price[state.product.price.length - 1].price * ((100 - state.product.discount[state.product.discount.length - 1].discount) / 100)).toLocaleString('fa-IR') : state.product.price[state.product.price.length - 1].price.toLocaleString('fa-IR')}
                                    <span className="text-base"> تومان</span></h2>
                            </div> :
                            <Skeleton variant="rectangular" className='rounded-md col-start-1 col-end-2 row-start-2' width={252.5} height={30} />}
                    </div>
                    {state.product &&
                        <button className={`transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 py-2.5 mt-6 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1`}
                            onClick={() => { state.product.showCount > 0 ? addToBascket() : notifAndFavHandler() }}
                        >
                            {state.product.showCount > 0 ? "اضافه به سبد خرید" : "موجود شد خبر بده"}
                        </button>
                    }
                </div>
            </div>
            {/* ends of products details*/}

            {/* starts of details box*/}
            <div className="lg:col-start-4 col-start-1 col-end-8 lg:row-start-2 lg:row-end-3 row-start-3 w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 dark:gr2dark dark:outline-slate-600 dark:text-white">

                <h3 className="absolute top-4 -right-2 bg-white text-slate-700 text-xl font-bold rounded-l-xl pr-6 pl-4 py-2 dark:bg-slate-800 dark:text-white transition-all">مشخصات</h3>

                <div className='mt-10'>
                    <Accordion defaultExpanded>
                        <div className='dark:bg-slate-400 dark:text-white'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                در باب محصول
                            </AccordionSummary>
                        </div>
                        <div className="dark:bg-slate-400">
                            <AccordionDetails>
                                {state.product ?
                                    <p className=" text-sky-900 line-clamp-2 dark:text-white">
                                        {
                                            (state.product.productArticleId) ?
                                                state.product.productArticleId?.desc :
                                                "مقاله‌ای در این باب موجود نمی‌باشد."
                                        }
                                    </p> :
                                    <>
                                        <Skeleton variant="text" className=' rounded-md' />
                                        <Skeleton variant="text" className=' rounded-md' width={250} />
                                    </>
                                }
                            </AccordionDetails>
                        </div>
                        <div className={`dark:bg-slate-400 ${!state.product?.productArticleId && "hidden"}`}>
                            <AccordionActions>
                                <Link
                                    to={`/article/${(state.product?.productArticleId) && state.product.productArticleId._id}`}
                                    className="flex items-center gap-x-1.5 cursor-pointer text-sm text-sky-600 dark:text-white"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    مشاهده مقاله
                                    <div className="dark:text-slate-600">
                                        <KeyboardBackspaceRoundedIcon fontSize='small' />
                                    </div>
                                </Link>
                            </AccordionActions>
                        </div>
                    </Accordion>
                    <Accordion>
                        <div className='dark:bg-slate-400 dark:text-white'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                در باب نویسنده
                            </AccordionSummary>
                        </div>
                        <div className='dark:bg-slate-400'>
                            <AccordionDetails>
                                {state.product ?
                                    <p className=" text-sky-900 line-clamp-2 dark:text-white">
                                        {
                                            (state.product.authorArticleId) ?
                                                state.product.authorArticleId.desc :
                                                "مقاله‌ای در این باب موجود نمی‌باشد."
                                        }
                                    </p> :
                                    <>
                                        <Skeleton variant="text" className=' rounded-md' />
                                        <Skeleton variant="text" className=' rounded-md' width={250} />
                                    </>
                                }
                            </AccordionDetails>
                        </div>
                        <div className={`dark:bg-slate-400 ${!state.product?.authorArticleId && "hidden"}`}>
                            <AccordionActions>
                                <Link
                                    to={`/article/${(state.product?.authorArticleId) && state.product.authorArticleId._id}`}
                                    className="flex items-center gap-x-1.5 text-sm cursor-pointer text-sky-600 dark:text-white"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    مشاهده مقاله
                                    <div className="dark:text-slate-600" >
                                        <KeyboardBackspaceRoundedIcon fontSize='small' />
                                    </div>
                                </Link>
                            </AccordionActions>
                        </div>
                    </Accordion>
                    <Accordion>
                        <div className='dark:bg-slate-400 dark:text-white'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                در باب انتشارات
                            </AccordionSummary>
                        </div>
                        <div className='dark:bg-slate-400'>
                            <AccordionDetails>
                                {state.product ?
                                    <p className=" text-sky-900 line-clamp-2 dark:text-white">
                                        {
                                            (state.product.publisherArticleId) ?
                                                state.product.publisherArticleId.desc :
                                                "مقاله‌ای در این باب موجود نمی‌باشد."
                                        }
                                    </p> :
                                    <>
                                        <Skeleton variant="text" className=' rounded-md' />
                                        <Skeleton variant="text" className=' rounded-md' width={250} />
                                    </>
                                }
                            </AccordionDetails>
                        </div>
                        <div className={`dark:bg-slate-400 ${!state.product?.publisherArticleId && "hidden"}`}>
                            <AccordionActions>
                                <Link
                                    to={`/article/${(state.product?.publisherArticleId) && state.product.publisherArticleId._id}`}
                                    className="flex items-center gap-x-1.5 text-sm cursor-pointer text-sky-600 dark:text-white"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    مشاهده مقاله
                                    <div className="dark:text-slate-600">
                                        <KeyboardBackspaceRoundedIcon fontSize='small' />
                                    </div>
                                </Link>
                            </AccordionActions>
                        </div>
                    </Accordion>
                </div>

            </div>
            {/* ends of details box*/}

            {/* starts of suggestion box*/}
            {
                state.product &&
                <SuggestionBox cat={state.product?.majorCat} catB={state.product?.majorCat === 'کتاب' ? (state.product?.authorId?._id ? state.product?.authorId._id : state.product?.minorCat) : (state.product?.brand ? state.product?.brand : state.product?.minorCat)} bascket={false} id={state.product?._id} ban={ban} />
            }
            {/* ends of suggestion box*/}

            {/* starts of comments box*/}
            {jwt && !ban &&
                <div ref={commentScroll} className="lg:col-start-4 col-start-1 col-end-8 lg:row-start-3 row-start-5 w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-10 pb-4 px-4 dark:gr2dark dark:outline-slate-600 dark:text-white">
                    <CommentInput commentBoxScroll={commentBoxScroll} replyComment={replyComment} refresh={refresh} setRefresh={setRefresh} setReplyComment={setReplyComment} setReplyId={setReplyId} productId={id} />
                </div>
            }
            {/* ends of comments box*/}

            {/* starts of comments box */}
            <div ref={commentBoxScroll} className="col-start-1 col-end-8 lg:row-start-4 row-start-6 w-full relative bg-sky-100 dark:gr2dark dark:outline-slate-600 dark:text-white outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-10 pb-4 px-4">
                <h3 className="text-slate-700 text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 dark:text-white bg-white absolute transition-all ">
                    نظرات
                </h3>
                {
                    state.comments && state.comments.length > 0 ?
                        [...state.comments].reverse().map(c => (
                            <div key={c._id} >
                                <CommentBox account={false} ticket={false} {...c} commentScrollHandler={commentScrollHandler} setReplyId={setReplyId} />
                            </div>
                        ))
                        :
                        <p className="lg:mt-0 mt-12 text-center mb-4">هنوز دیدگاهی درباره این محصول ثبت نشده است.</p>
                }
            </div>
            {/* ends of comments box */}

            {/* contact modal start */}
            <Modal
                open={contact}
                onClose={() => setContact(false)}
            >
                <div className=" top-1/2 -translate-y-1/2 absolute left-1/2 -translate-x-1/2 w-fit outline-[4px] outline border-2 border-solid border-[rgba(0,0,0,0.4)] rounded-xl p-4 bg-sky-100 outline-sky-100 dark:bg-slate-400 dark:outline-slate-400 font-[vazir] text-cente">
                    <p className=" whitespace-pre-wra grid justify-center items-center gap-4 whitespace-pre-line">
                        <span className=" col-start-1 row-start-1">تلفن:</span>
                        <span className="col-start-2 row-start-1">02133334434</span>

                        {AppVersion &&
                            <>
                                <a href="tel:09934242315" className=" row-start-2 py-2.5 px-6 rounded-full col-start-3 bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900">تماس</a>
                                <a href="tel:02133334434" className="col-start-3 row-start-1 py-2.5 px-6 rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900">تماس</a>
                            </>
                        }
                        <span className="col-start-1 row-start-2">موبایل:</span>
                        <span className="col-start-2 row-start-2">09934242315</span>

                        <span className="col-start-1 row-start-3">آدرس:</span>
                        <span className="col-start-2 row-start-3 whitespace-pre-line">
                            تهران، نارمک، نبوت
                        </span>
                    </p>
                    <div className=" flex gap-4 justify-center">
                        <button className={`py-2.5 md:mt-6 mt-10 px-6 rounded-full col-start-1 col-end-3 bg-red-500 border-red-400 hover:bg-red-600 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-400`}
                            onClick={() => setContact(false)}
                        >بستن</button>
                    </div>
                </div>
            </Modal>
            {/* contact modal end */}

            {/* alert modal start */}
            <AlertBox txt={alertTxt} open={alert} setOpen={setAlert} status={alertStatus} time={4000} />
            {/* alert modal end */}

        </div>
    );
}

export default Product;