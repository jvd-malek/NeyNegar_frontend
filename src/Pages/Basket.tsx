import { useEffect, useState } from 'react';
import BoxHeader from '../Components/Boxes/BoxHeader';
import BasketBox from '../Components/Boxes/BasketBox';
import PaginationBox from '../Components/Boxes/PaginationBox'
import TxtBox from '../Components/Boxes/TxtBox';
import { userType } from '../Components/Types/user';
import { useDispatch, useSelector } from 'react-redux';
import { reduxType } from '../Components/Types/redux';
import { countPerPage } from '../Redux/Pagination';
import { productCoverSingleType, productSingleType } from '../Components/Types/product';
import FavBox from '../Components/Boxes/FavBox';
import { useNavigate } from 'react-router-dom';
import AlertBox from "../Components/Boxes/AlertBox"

function Basket() {
    let navigate = useNavigate()
    const [productConf, setProductConf] = useState(true)
    const [infoConf, setInfoConf] = useState(false)
    const [payment, setPayment] = useState(false)
    const [postPish, setPostPish] = useState(false)
    const [postFast, setPostFast] = useState(false)
    const [bike, setBike] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [User, setUser] = useState<userType>()
    const [HREF, setHREF] = useState('')
    const [FirstName, setFirstName] = useState('')
    const [Num, setNum] = useState('')
    const [City, setCity] = useState('')
    const [State, setState] = useState('')
    const [Discount, setDiscount] = useState('')
    const [isValidDiscount, setIsValidDiscount] = useState<{ msg: string, state: boolean }>()
    const [PostCode, setPostCode] = useState('')
    const [Address, setAddress] = useState('')
    const [TotalPrice, setTotalPrice] = useState(0)
    const [TotalDiscount, setTotalDiscount] = useState(0)
    const [DiscountCode, setDiscountCode] = useState(0)
    const [shipmentPrice, setShipmentPrice] = useState(0)
    const [alert, setAlert] = useState(false);
    const [Bascket, setBascket] = useState<{ count: number, productId: productSingleType }[] | []>([])
    const [LocalBascket, setLocalBascket] = useState<{ count: number, productId: string }[] | []>([])
    const jwt = localStorage.getItem("jwt")
    const bas = localStorage.getItem("bascket")
    const page = useSelector((state: reduxType) => state.pagination)
    const dispatch = useDispatch<any>()
    const isMobile = navigator.appVersion.includes("Mobile")
    const [errTxt, setErrTxt] = useState<{ type: string, state: boolean }[]>([
        { type: "نام", state: false },
        { type: "شماره تلفن", state: false },
        { type: "کدپستی", state: false },
        { type: "استان", state: false },
        { type: "شهر", state: false },
        { type: "آدرس", state: false },
    ])

    const products = [...(User ? User.bascket : Bascket)]
        .filter(p => {
            if (page.cat === 'همه') {
                return p
            } else {
                return p.productId.minorCat == page.cat
            }
        })
        .filter(p => {
            if (page.sort === "offers") {
                return p.productId.discount[p.productId.discount.length - 1].discount > 0
            } else {
                return p
            }
        })
        .filter((i) => (
            i.productId.title.includes(page.search.trim())
        ))

    useEffect(() => {
        if (jwt) {
            fetch(`https://api.neynegar1.ir/users/verifyBascket`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state) {
                        setUser(data.user)
                        setTotalDiscount(data.totalDiscount)
                        setTotalPrice(data.totalPrice)
                    }
                })
        } else if (bas) {
            setLocalBascket(JSON.parse(bas))
        }
        if (isMobile) {
            dispatch(countPerPage({ num: 5 }))
        } else {
            dispatch(countPerPage({ num: 3 }))
        }
    }, [refresh])

    useEffect(() => {
        if (LocalBascket.length > 0) {
            let newBas: { count: number, productId: productSingleType }[] = []
            LocalBascket.forEach(async (b) => {
                await fetch(`https://api.neynegar1.ir/products/${b.productId}`).then(res => res.json()).then((data) => {
                    newBas = [{ count: b.count, productId: data.product }, ...newBas]
                    setBascket(newBas)
                })
            })
        }
    }, [LocalBascket])

    useEffect(() => {
        if (User) {
            setFirstName(User.name)
            setNum(String(User.phone))
            if (User.address) {
                let Address = User.address.split("%%")
                setState(Address[0])
                setCity(Address[1])
                setAddress(Address[2])
            }
            if (User.postCode) {
                setPostCode(String(User.postCode))
            }
        }
    }, [User])

    useEffect(() => {
        if (products.length > 0) {
            let TotalShipment = 0
            products.forEach(p => {
                if (postFast) {
                    TotalShipment = TotalShipment + (p.count * p.productId.weight * 7)
                }
                if (postPish) {
                    TotalShipment = TotalShipment + (p.count * p.productId.weight * 5)
                }
            })
            if (postFast) {
                setShipmentPrice(TotalShipment + 70000)
            }
            if (postPish) {
                setShipmentPrice(TotalShipment + 60000)
            }
        }
    })

    const productConfirmation = () => {
        setProductConf(true)
        setInfoConf(false)
        setPayment(false)
    }

    const infoConfirmation = () => {
        if (jwt) {
            setInfoConf(true)
            setProductConf(false)
            setPayment(false)
        } else {
            navigate("/login/1")
        }
    }

    const paymentHandler = async () => {
        if (jwt) {
            if (FirstName.trim() &&
                Num.trim() &&
                PostCode.trim() &&
                State.trim() &&
                City.trim() &&
                Address.trim()) {
                await updateInfoUser({ name: FirstName, postCode: +PostCode.trim(), address: `${State.trim()}%%${City.trim()}%%${Address.trim()}` })
                setInfoConf(false)
                setProductConf(false)
                setPayment(true)
            }
        } else {
            navigate("/login/1")
        }
    }

    const submitHandler = async () => {
        if (productConf) {
            infoConfirmation()
            window.scrollTo({ top: 200, behavior: "smooth" })
        } else if (infoConf) {
            infoHandler()
            window.scrollTo({ top: 200, behavior: "smooth" })
        } else {
            if (jwt && (postPish || postFast || bike)) {
                await fetch("https://api.neynegar1.ir/checkout", {
                    method: "POST",
                    headers: {
                        'authorization': jwt,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ shipment: shipmentPrice, submition: bike ? "پیک موتوری" : postFast ? "پست سفارشی" : postPish && "پست پیشتاز" })
                })
                    .then(res => res.json())
                    .then(data => window.location.href = data.paymentURL)

            } else {
                setAlert(true)
            }
        }
    }

    const infoHandler = () => {
        if (!FirstName.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "نام"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "نام"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (!Num.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "شماره تلفن"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "شماره تلفن"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (!PostCode.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "کدپستی"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "کدپستی"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (!State.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "استان"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "استان"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (!City.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "شهر"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "شهر"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (!Address.trim()) {
            let ERR = errTxt.filter(e => (
                e.type == "آدرس"
            ))
            let filteredErr = errTxt.filter(e => (
                e.type != "آدرس"
            ))
            ERR[0].state = true
            setErrTxt([...filteredErr, ...ERR])
        }
        if (FirstName.trim() &&
            Num.trim() &&
            PostCode.trim() &&
            State.trim() &&
            City.trim() &&
            Address.trim()) {
            paymentHandler()
            window.scrollTo({ top: 200, behavior: "smooth" })
        }
    }

    const updateInfoUser = async (body: object) => {
        if (jwt) {
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
    }

    const setDiscountHandler = (val: string) => {
        setDiscount(val)
        if (!DiscountCode) {
            setIsValidDiscount(undefined)
        }
    }

    const discountHandler = () => {
        if (jwt) {
            if (Discount && !DiscountCode) {
                let isValid = User?.discount.filter(d => (
                    d.code == Discount
                ))
                if (isValid && isValid.length > 0 && isValid[0].date > Date.now()) {
                    setDiscountCode(isValid[0].discount)
                    setIsValidDiscount({ state: true, msg: "تخفیف اعمال شد." })
                } else if (isValid && isValid.length < 0 && isValid[0].date > Date.now()) {
                    setIsValidDiscount({ state: false, msg: "تخفیف منقضی شده است." })
                } else {
                    setIsValidDiscount({ state: false, msg: "تخفیفی با این کد برای شما فعال نیست." })
                }
            }
        } else {
            setIsValidDiscount({ state: false, msg: "ابتدا وارد حساب کاربری خود شوید." })
        }
    }

    switch (page.sort) {
        case 'expensive':
            products.sort((a, b) => {
                let Aprice = a.productId.discount[a.productId.discount.length - 1].discount > 0 ? (a.productId.price[a.productId.price.length - 1].price * ((100 - a.productId.discount[a.productId.discount.length - 1].discount) / 100)) : a.productId.price[a.productId.price.length - 1].price
                let Bprice = b.productId.discount[b.productId.discount.length - 1].discount > 0 ? (b.productId.price[b.productId.price.length - 1].price * ((100 - b.productId.discount[b.productId.discount.length - 1].discount) / 100)) : b.productId.price[b.productId.price.length - 1].price
                return Bprice - Aprice
            })
            break;

        case 'cheap':
            products.sort((a, b) => {
                let Aprice = a.productId.discount[a.productId.discount.length - 1].discount > 0 ? (a.productId.price[a.productId.price.length - 1].price * ((100 - a.productId.discount[a.productId.discount.length - 1].discount) / 100)) : a.productId.price[a.productId.price.length - 1].price
                let Bprice = b.productId.discount[b.productId.discount.length - 1].discount > 0 ? (b.productId.price[b.productId.price.length - 1].price * ((100 - b.productId.discount[b.productId.discount.length - 1].discount) / 100)) : b.productId.price[a.productId.price.length - 1].price
                return Aprice - Bprice
            })
            break;

        case 'popular':
            products.sort((a, b) => (b.productId.popularity - a.productId.popularity))
            break;

        case 'offers':
            products.sort((a, b) => (b.productId.discount[b.productId.discount.length - 1].discount - a.productId.discount[a.productId.discount.length - 1].discount))
            break;
    }

    return (
        <div className='mt-32 relative'>
            <BoxHeader
                title={'سبد خرید شما'}
                color={"gr1"}
                all={false}
                searchBar={productConf}
                count={isMobile ? [5, 10, 15] : [3, 6, 9]}
                bascket={true}
            />

            <div className="lg:w-[85vw] md:w-[90vw] w-[98vw] mx-auto relative mt-16">

                {/* starts of header button of basket boxes */}
                <div className="flex gap-4 sm:justify-start justify-between">
                    <button onClick={() => productConfirmation()} className={`outline-sky-100 dark:bg-slate-600 dark:outline-slate-600 dark:text-white outline-[6px] outline border-x-2 border-t-2 border-solid border-white dark:border-slate-800 px-4 py-2.5 bg-sky-100 rounded-t-xl text-zinc-800 transition-all ${productConf ? " opacity-100 translate-y-0" : "opacity-60 translate-y-1.5 mb-6 rounded-b-xl border-none"}`}>تایید محصولات</button>
                    <button onClick={() => infoConfirmation()} className={`outline-sky-100 dark:bg-slate-600 dark:outline-slate-600 dark:text-white outline-[6px] outline border-x-2 border-t-2 border-solid border-white dark:border-slate-800 px-4 py-2.5 bg-sky-100 rounded-t-xl text-zinc-800 transition-all  ${infoConf ? " opacity-100 translate-y-0" : "opacity-60 translate-y-1.5 mb-6 rounded-b-xl border-none"}`}>اطلاعات تکمیلی</button>
                    <button onClick={() => paymentHandler()} className={`outline-sky-200 dark:bg-slate-600 dark:outline-slate-600 dark:text-white outline-[6px] outline border-x-2 border-t-2 border-solid border-white dark:border-slate-800 px-4 py-2.5 bg-sky-200 rounded-t-xl text-zinc-800 transition-all ${payment ? " opacity-100 translate-y-0 z-10" : "opacity-60 translate-y-1.5 mb-6 rounded-b-xl border-none"}`}>تکمیل خرید</button>
                </div>
                {/* ends of header button of basket boxes */}

                {/* starts of data box */}
                <div className={`bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all ${infoConf ? "w-full opacity-100 outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid border-white dark:border-slate-800" : "h-0 opacity-60 w-0 overflow-hidden z-0"} transition-opacity rounded-xl`}>
                    <div className={`w-[90%] md:pb-16 pt-16 pb-10 mx-auto transition-all duration-700 ${infoConf ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                        {
                            User ?
                                <form action="#" className="flex md:flex-row flex-col gap-16 justify-between" onSubmit={e => e.preventDefault()}>
                                    <div className="flex-1">
                                        <h2 className="text-slate-700 dark:text-white text-lg">
                                            اطلاعات گیرنده:
                                        </h2>

                                        <div className="flex flex-col h-full justify-between">
                                            <div className="flex flex-col gap-2 mt-4 w-full transition-all rounded-xl  pt-6 pb-6 h-full">
                                                <TxtBox errTxt={errTxt}
                                                    setErrTxt={setErrTxt} type={"string"} bascket val={FirstName} setVal={setFirstName} txt="نام" />
                                                <TxtBox errTxt={errTxt}
                                                    readOnly setErrTxt={setErrTxt} type={"number"} bascket val={Num} setVal={setNum} txt="شماره تلفن" />
                                                <TxtBox errTxt={errTxt}
                                                    setErrTxt={setErrTxt} type={"number"} bascket val={PostCode} setVal={setPostCode} txt="کدپستی" />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-slate-700 dark:text-white text-lg">
                                            آدرس گیرنده:
                                        </h2>

                                        <div className="flex flex-col h-full justify-between">
                                            <div className="flex flex-col gap-2 mt-4 w-full transition-all rounded-xl pt-6 pb-6 h-full">
                                                <TxtBox errTxt={errTxt}
                                                    setErrTxt={setErrTxt} type={"string"} bascket val={State} setVal={setState} txt="استان" />
                                                <TxtBox errTxt={errTxt}
                                                    setErrTxt={setErrTxt} type={"string"} bascket val={City} setVal={setCity} txt="شهر" />
                                                <TxtBox errTxt={errTxt}
                                                    setErrTxt={setErrTxt} type={"string"} bascket val={Address} setVal={setAddress} txt="آدرس" />
                                            </div>

                                            <button className={`py-2.5 md:mt-6 mt-10 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                                                onClick={() => infoHandler()}
                                            >ثبت اطلاعات</button>
                                        </div>

                                    </div>
                                </form> :
                                <div className="flex justify-center items-center w-full flex-col">
                                    <p className="">
                                        برای ادامه خرید به حسابتان وارد شوید.
                                    </p>
                                    <button className={`py-2.5 md:mt-6 mt-10 lg:w-1/3 md:w-2/3 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                                        onClick={() => navigate("/login/1")}
                                    >
                                        ورود به حساب
                                    </button>

                                </div>

                        }

                    </div>
                </div>
                {/* ends of data box */}

                {/* starts of shipping boxes */}
                <div className={`bg-sky-200 dark:bg-slate-600 dark:outline-slate-600 transition-all ${payment ? "w-full opacity-100 outline-sky-200 outline-[6px] outline border-x-2 border-y-2 border-solid border-white dark:border-slate-800" : "h-0 opacity-60 w-0 overflow-hidden z-0"} transition-opacity sm:rounded-xl rounded-b-xl rounded-r-xl relative`}>

                    <h2 className="text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                        روش ارسال
                    </h2>

                    <div className={`w-[90%] md:pb-16 pt-16 pb-10 mx-auto text-slate-700 transition-all duration-700 ${payment ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>

                        <div className="grid w-full lg:gap-16 md:gap-8 gap-16 mt-10">

                            <button className={`cursor-pointer col-start-1 md:col-end-3 row-start-1 p-4 lg:p-8 shadow-cs hover:shadow-css hover:-translate-y-1 outline-[4px] outline border-2 border-solid border-sky-200 dark:border-slate-600 flex sm:flex-row flex-col justify-center lg:gap-8 gap-4 items-center  h-56 transition-all duration-500 rounded-xl sm:w-[75%] md:w-fit w-full mx-auto ${postPish ? 'bg-lime-100 outline-lime-100' : 'outline-sky-50 bg-sky-50 dark:outline-slate-300'}`}
                                onClick={() => { setShipmentPrice(0); setPostPish(true); setBike(false); setPostFast(false) }}
                            >
                                <div className="lg:w-52 w-40">
                                    <svg
                                        id="Layer_1"
                                        xmlns="https://www.w3.org/2000/svg"
                                        xmlnsXlink="https://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 397 267"
                                        xmlSpace="preserve"
                                    >
                                        <style type="text/css">
                                            {"\n    .st0{fill:none;}\n\t.st1{fill:#504F4F;}\n  "}
                                        </style>
                                        <g>
                                            <path
                                                className="st0"
                                                d="M268.06,64.65c0-23.23-18.89-42.11-42.11-42.11c-23.21,0-42.09,18.88-42.09,42.11v13.1h84.21V64.65z"
                                            />
                                            <path
                                                className="st1"
                                                d="M141.27,220.96h3.84l21.45-136.67h10.71v-6.55h-13.51c-1.61,0-2.99,1.18-3.25,2.76l-22.47,143.22 c-0.02,0.07,0,0.15,0,0.2C138.2,222.27,139.56,220.96,141.27,220.96z"
                                            />
                                            <path
                                                className="st1"
                                                d="M313.79,223.4L291.53,80.52c-0.22-1.6-1.61-2.78-3.23-2.78h-13.7v6.55h10.9l21.28,136.67h3.83 c1.79,0,3.28,1.46,3.28,3.26v0.17c0-0.06,0.02-0.11,0.02-0.17C313.91,223.94,313.85,223.68,313.79,223.4z"
                                            />
                                            <rect x={183.85} y={77.74} className="st1" width={84.21} height={6.55} />
                                            <path
                                                className="st1"
                                                d="M177.28,84.29v25.08c0,1.8,1.48,3.26,3.28,3.26c1.8,0,3.28-1.46,3.28-3.26V84.29v-6.55v-13.1 c0-23.23,18.88-42.11,42.09-42.11c23.23,0,42.11,18.88,42.11,42.11v13.1v6.55v25.08c0,1.8,1.47,3.26,3.27,3.26 c1.82,0,3.28-1.46,3.28-3.26V84.29v-6.55v-13.1c0-26.84-21.81-48.66-48.66-48.66c-26.83,0-48.66,21.83-48.66,48.66v13.1V84.29z"
                                            />
                                            <path
                                                className="st1"
                                                d="M310.61,220.96h-3.83H145.11h-3.84c-1.71,0-3.08,1.31-3.23,2.96c-0.02,0.12-0.04,0.21-0.04,0.3v22.71 c0,1.81,1.46,3.27,3.26,3.27h169.34c1.79,0,3.28-1.47,3.28-3.27v-22.55v-0.17C313.89,222.42,312.41,220.96,310.61,220.96z  M307.32,243.67H144.56V227.5h162.77V243.67z"
                                            />
                                            <path
                                                className="st1"
                                                d="M146.07,84.7c1.82,0,3.28-1.46,3.28-3.28c0-1.8-1.47-3.28-3.28-3.28h-35.11c-1.82,0-3.29,1.49-3.29,3.28 c0,1.82,1.47,3.28,3.29,3.28H146.07z"
                                            />
                                            <path
                                                className="st1"
                                                d="M86.34,131.73c-1.82,0-3.28,1.46-3.28,3.28c0,1.8,1.46,3.26,3.28,3.26h54.93c1.82,0,3.28-1.47,3.28-3.26 c0-1.82-1.46-3.28-3.28-3.28H86.34z"
                                            />
                                            <path
                                                className="st1"
                                                d="M136.46,184.53c0-1.82-1.47-3.29-3.28-3.29H89.68c-1.8,0-3.28,1.47-3.28,3.29c0,1.79,1.48,3.28,3.28,3.28 h43.49C134.99,187.81,136.46,186.32,136.46,184.53z"
                                            />
                                            <path
                                                className="st1"
                                                d="M92.04,78.13H80.64c-1.8,0-3.25,1.49-3.25,3.28c0,1.82,1.46,3.28,3.25,3.28h11.41c1.82,0,3.26-1.46,3.26-3.28 C95.31,79.62,93.86,78.13,92.04,78.13z"
                                            />
                                            <path
                                                className="st1"
                                                d="M48.97,107.55c0,1.82,1.48,3.28,3.28,3.28H143c1.82,0,3.28-1.46,3.28-3.28c0-1.82-1.46-3.26-3.28-3.26H52.25 C50.45,104.29,48.97,105.73,48.97,107.55z"
                                            />
                                            <path
                                                className="st1"
                                                d="M140.83,157.72c0-1.8-1.47-3.26-3.28-3.26H32.44c-1.82,0-3.28,1.46-3.28,3.26c0,1.82,1.47,3.28,3.28,3.28 h105.1C139.36,161,140.83,159.53,140.83,157.72z"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-4 sm:text-start text-center ">
                                    <h2 className="text-lg">پست پیشتاز</h2>
                                    <p className="text-sm">تحویل 2 الی 3 روزه</p>
                                </div>
                            </button>

                            <button className={`cursor-pointer md:col-start-3 md:col-end-6 col-start-1 md:row-start-1 row-start-2 p-4 lg:p-8 shadow-cs hover:shadow-css hover:-translate-y-1 outline-[4px] outline border-2 border-solid border-sky-200 dark:border-slate-600 flex justify-center sm:flex-row flex-col lg:gap-8 gap-4 items-center  h-56 transition-all duration-500 rounded-xl sm:w-[75%] md:w-fit w-full mx-auto ${postFast ? 'bg-lime-100 outline-lime-100' : 'outline-sky-50 bg-sky-50 dark:bg-slate-300 dark:outline-slate-300'}`}
                                onClick={() => { setShipmentPrice(0); setPostPish(false); setBike(false); setPostFast(true) }}
                            >
                                <div className="lg:w-52 w-40">
                                    <svg
                                        id="Layer_1"
                                        xmlns="https://www.w3.org/2000/svg"
                                        x={0}
                                        y={0}
                                        viewBox="0 0 344 206"
                                        xmlSpace="preserve"
                                    >
                                        <style>{"\n    .st0{fill:none}.st1{fill:#504f4f}\n  "}</style>
                                        <path
                                            className="st0"
                                            d="m236 169.82 12.46.23c2.31-6.98 7.85-12.48 14.82-14.73H236z"
                                        />
                                        <path
                                            className="st0"
                                            d="M290.75 148.76c1.8 0 3.26 1.47 3.26 3.28 0 1.8-1.46 3.28-3.26 3.28H277.4c7.24 2.32 12.93 8.16 15.07 15.49l12.21.21v-34.11c-4.01-1.6-12.38-5.05-15.87-7.56-8.38-6.04-22.3-36.9-26.18-45.73H236v65.13h54.75zm-48.31-57.62h13.38c1.22 0 2.34.7 2.9 1.78l14.39 27.92c.34.51.52 1.13.52 1.79 0 1.8-1.46 3.28-3.26 3.28h-27.93c-1.8 0-3.26-1.49-3.26-3.28v-28.2a3.267 3.267 0 0 1 3.26-3.29"
                                        />
                                        <path className="st0" d="M253.82 97.69h-8.11v21.65h19.26z" />
                                        <path
                                            className="st1"
                                            d="M229.43 172.99c.04-1.78 1.5-3.23 3.28-3.23h.06l3.23.06v-14.5h-3.28c-1.8 0-3.28-1.49-3.28-3.28v19.43h-71.21c.46 1.84.73 3.78.73 5.77 0 .26 0 .52-.02.79h73.79c1.22 0 2.25-.66 2.82-1.65l-2.88-.04c-1.83-.05-3.27-1.54-3.24-3.35m-115.83-1.52h-11.03V134.2a55 55 0 0 1-6.55-6.23v46.77c0 1.83 1.46 3.29 3.26 3.29h13.6v-.79c.01-1.99.25-3.93.72-5.77m74.94-87.85h40.9v68.42c0-1.82 1.49-3.28 3.28-3.28H236V83.62h-3.28c-1.8 0-3.28-1.47-3.28-3.28 0-1.82 1.49-3.28 3.28-3.28H187c.65 2.12 1.16 4.33 1.54 6.56"
                                        />
                                        <path
                                            className="st1"
                                            d="M158.22 171.47c-2.58-9.92-11.59-17.27-22.31-17.27-10.71 0-19.74 7.35-22.31 17.27-.47 1.84-.71 3.78-.71 5.77v.79c.43 12.34 10.58 22.25 23.02 22.25s22.59-9.9 23.02-22.25c.02-.26.02-.53.02-.79 0-1.99-.27-3.93-.73-5.77m-22.31 22.25c-9.08 0-16.47-7.41-16.47-16.48 0-9.09 7.39-16.49 16.47-16.49 9.1 0 16.47 7.41 16.47 16.49s-7.37 16.48-16.47 16.48"
                                        />
                                        <path
                                            className="st1"
                                            d="M145.93 177.24c0-5.54-4.48-10.02-10.02-10.02s-10 4.48-10 10.02c0 5.53 4.46 10.01 10 10.01s10.02-4.48 10.02-10.01m148.08-25.2c0-1.82-1.46-3.28-3.26-3.28h-58.03c-1.8 0-3.28 1.47-3.28 3.28 0 1.8 1.49 3.28 3.28 3.28h30.55c2.24-.74 4.6-1.13 7.07-1.13 2.46 0 4.82.39 7.05 1.13h13.34c1.81.01 3.28-1.48 3.28-3.28M134.41 39.19V35.1h-6.57v4.68c2.16-.35 4.34-.53 6.57-.59m3.9-4.09v4.11c2.21.12 4.4.34 6.54.72V35.1z"
                                        />
                                        <path
                                            className="st1"
                                            d="M102.14 134.2c8.96 7.32 20.28 11.73 32.62 11.73 28.8 0 52.24-23.96 52.24-53.4 0-3.04-.28-6-.75-8.91-.37-2.24-.86-4.44-1.51-6.57a53.45 53.45 0 0 0-14.79-23.92l-2.43 2.49c-.64.63-1.45.95-2.28.95-.81 0-1.63-.32-2.25-.95-1.25-1.28-1.25-3.36 0-4.63l1.94-1.99c-6.26-4.54-13.55-7.73-21.43-9.08-2.09-.38-4.24-.6-6.4-.72-.79-.03-1.56-.05-2.35-.05-.5 0-.99.02-1.47.03-2.18.06-4.31.24-6.43.58-25.05 3.88-44.33 26.08-44.33 52.75 0 3.02.26 5.99.72 8.85.42.57.66 1.24.66 1.97 0 .28-.05.54-.11.82 1.97 8.99 6.13 17.14 11.94 23.79a54 54 0 0 0 6.41 6.26m78.43-41.67c0 25.84-20.54 46.83-45.81 46.83-25.26 0-45.82-20.99-45.82-46.83 0-25.81 20.56-46.83 45.82-46.83 25.27 0 45.81 21.02 45.81 46.83"
                                        />
                                        <path
                                            className="st1"
                                            d="M93.4 92.53c0 1.82 1.47 3.28 3.28 3.28 1.27 0 2.4-.75 2.93-1.84.22-.43.34-.92.34-1.44 0-19.81 16.14-35.95 35.97-35.95s35.95 16.14 35.95 35.95c0 17.79-12.96 32.59-29.94 35.46l4.39-7.49c1.05.96 2.65 1.14 3.9.36a3.28 3.28 0 0 0 1.07-4.53l-2.36-3.79c-.6-.97-1.67-1.57-2.83-1.53-1.13 0-2.19.62-2.78 1.61l-1.32 2.23-8.91 15.27c-.6 1.01-.6 2.28 0 3.28a3.28 3.28 0 0 0 2.83 1.64c23.45 0 42.51-19.06 42.51-42.51 0-23.43-19.06-42.49-42.51-42.49-23.44 0-42.52 19.06-42.52 42.49"
                                        />
                                        <path
                                            className="st1"
                                            d="M139.2 82.66V64.41c0-1.8-1.47-3.28-3.28-3.28-1.8 0-3.26 1.48-3.26 3.28v18.57c1.14-.45 2.4-.71 3.71-.71.97 0 1.92.14 2.83.39m-4.79-47.56h11.07c1.8 0 3.28-1.46 3.28-3.27V18.35c0-6.85-5.55-12.42-12.4-12.42s-12.42 5.57-12.42 12.42v13.47c0 1.82 1.48 3.27 3.28 3.27h7.19zm1.95-22.6c3.23 0 5.85 2.62 5.85 5.86v10.2h-11.7v-10.2a5.86 5.86 0 0 1 5.85-5.86m28.41 43.13c.63.63 1.47.95 2.3.95.85 0 1.67-.32 2.33-.95l2.48-2.49 2.77-2.78c-2.05-.92-3.73-2.49-4.8-4.47L166.76 49l-1.99 1.99a3.283 3.283 0 0 0 0 4.64"
                                        />
                                        <path
                                            className="st1"
                                            d="M174.65 50.36c1.3.59 2.72.94 4.24.94 5.67 0 10.27-4.61 10.27-10.26 0-5.69-4.6-10.28-10.27-10.28s-10.26 4.59-10.26 10.28c0 1.74.43 3.42 1.22 4.86 1.07 1.96 2.75 3.54 4.8 4.46m4.24-13.06c2.05 0 3.72 1.67 3.72 3.73 0 2.04-1.68 3.7-3.72 3.7s-3.71-1.66-3.71-3.7c0-2.06 1.67-3.73 3.71-3.73m-32.26 55.23c0-4.67-3.15-8.63-7.43-9.87-.9-.25-1.86-.39-2.84-.39-1.31 0-2.57.26-3.71.71-3.84 1.5-6.57 5.2-6.57 9.55 0 5.66 4.61 10.28 10.28 10.28s10.27-4.62 10.27-10.28m-10.27 3.71c-2.04 0-3.71-1.65-3.71-3.71 0-2.04 1.67-3.71 3.71-3.71s3.71 1.67 3.71 3.71c0 2.06-1.67 3.71-3.71 3.71m172.77 35.37c-3.51-1.35-13.34-5.31-16.49-7.58-5.85-4.21-18.34-29.83-24.83-44.99a3.33 3.33 0 0 0-3.03-1.98h-32.06c-1.8 0-3.28 1.46-3.28 3.28s1.49 3.28 3.28 3.28h29.91c3.88 8.84 17.8 39.69 26.18 45.73 3.49 2.51 11.86 5.96 15.87 7.56v34.11l-12.21-.21c.58 2.05.9 4.18.9 6.42v.15l14.54.26h.07a3.3 3.3 0 0 0 2.29-.94c.62-.62.98-1.46.98-2.34v-39.7c0-1.36-.84-2.56-2.12-3.05M236 169.82l-3.23-.06h-.06c-1.78 0-3.25 1.45-3.28 3.23a3.29 3.29 0 0 0 3.22 3.34l2.88.04 11.8.23c.05-2.29.45-4.49 1.13-6.55z"
                                        />
                                        <path
                                            className="st1"
                                            d="M242.44 125.91h27.93c1.8 0 3.26-1.49 3.26-3.28 0-.66-.19-1.28-.52-1.79l-14.39-27.92a3.3 3.3 0 0 0-2.9-1.78h-13.38c-1.8 0-3.26 1.47-3.26 3.28v28.2c-.01 1.8 1.46 3.29 3.26 3.29m3.27-28.22h8.11l11.15 21.65h-19.25V97.69zm46.76 73.13c-2.14-7.33-7.83-13.17-15.07-15.49-2.23-.74-4.59-1.13-7.05-1.13-2.47 0-4.83.39-7.07 1.13-6.97 2.25-12.5 7.75-14.82 14.73-.68 2.06-1.07 4.26-1.13 6.55-.02.2-.02.4-.02.64 0 12.69 10.34 23.03 23.04 23.03 12.65 0 22.95-10.24 23.03-22.88v-.15a23.8 23.8 0 0 0-.91-6.43m-22.12 22.9c-9.1 0-16.49-7.41-16.49-16.48 0-9.09 7.39-16.49 16.49-16.49 9.09 0 16.48 7.41 16.48 16.49s-7.4 16.48-16.48 16.48"
                                        />
                                        <path
                                            className="st1"
                                            d="M270.35 167.22c-5.53 0-10.02 4.48-10.02 10.02 0 5.53 4.48 10.01 10.02 10.01 5.53 0 10.01-4.48 10.01-10.01 0-5.54-4.49-10.02-10.01-10.02M83.27 101.38a3.27 3.27 0 0 0-2.61-1.31H62.43c-1.82 0-3.29 1.46-3.29 3.28 0 1.8 1.47 3.26 3.29 3.26h18.24a3.27 3.27 0 0 0 3.16-2.44c.06-.28.12-.54.12-.82-.01-.73-.25-1.4-.68-1.97m2.72 22.32c1.82 0 3.28-1.47 3.28-3.27 0-1.81-1.47-3.28-3.28-3.28H64.86c-1.81 0-3.3 1.47-3.3 3.28 0 1.8 1.49 3.27 3.3 3.27zm-2.32 34.32c1.8 0 3.26-1.46 3.26-3.26 0-1.82-1.47-3.28-3.26-3.28H62.52c-1.8 0-3.27 1.46-3.27 3.28 0 1.8 1.48 3.26 3.27 3.26zm-37.81-40.87a3.276 3.276 0 0 0 0 6.55h6.87a3.28 3.28 0 0 0 3.28-3.27c0-1.81-1.48-3.28-3.28-3.28zm41.37 20.09c1.81 0 3.3-1.47 3.3-3.29 0-1.8-1.49-3.26-3.3-3.26H27.08c-1.8 0-3.25 1.46-3.25 3.26 0 1.82 1.46 3.29 3.25 3.29zm-53.25 34.65c0 1.8 1.49 3.28 3.28 3.28h49.96c1.81 0 3.3-1.48 3.3-3.28 0-1.79-1.49-3.28-3.3-3.28H37.27c-1.8 0-3.29 1.48-3.29 3.28"
                                        />
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-4 sm:text-start text-center">
                                    <h2 className="text-lg">پست سفارشی</h2>
                                    <p className="text-sm">تحویل 1 الی 2 روزه</p>
                                </div>
                            </button>

                            <button className={`cursor-pointer md:col-start-2 md:col-end-4 col-start-1 md:row-start-2 row-start-3 p-4 lg:p-8 shadow-cs outline-[4px] outline border-2 border-solid border-sky-200 dark:border-slate-600 flex justify-center sm:flex-row flex-col lg:gap-8 gap-4 items-center h-56 transition-all duration-500 rounded-xl sm:w-[75%] md:w-fit w-full mx-auto ${bike && City.trim() == "تهران" ? 'bg-lime-100 outline-lime-100 hover:shadow-css hover:-translate-y-1' : 'outline-sky-50 bg-sky-50 dark:bg-slate-300 dark:outline-slate-300'}`}
                                onClick={() => { setShipmentPrice(0); setBike(true); setPostPish(false); setPostFast(false) }}
                                disabled={City.trim() == "تهران" ? false : true}
                            >
                                <div className="lg:w-52 w-40">
                                    <svg
                                        id="Layer_1"
                                        xmlns="https://www.w3.org/2000/svg"
                                        x={0}
                                        y={0}
                                        viewBox="0 0 302 155.5"
                                        xmlSpace="preserve"
                                    >
                                        <style>{"\n    .st1{fill:#504f4f}\n  "}</style>
                                        <path
                                            d="M214.29 108.3c-2.3.73-4.58 1.1-6.81 1.1-3.71 0-7.29-1.02-10.58-3.03-6.49-4.01-11.14-11.61-12.11-19.87l-.04-.34c-.19-1.44-.3-2.75-.42-3.91l-27.41-4.96h-17.8c-1.18 0-2.31.05-3.42.12L125.93 87a40.7 40.7 0 0 1 12.95-2.11c20.69 0 37.72 15.48 39.31 35.07h60.2c1.69-12.19 11.69-21.85 24.32-23.52l-35.43-6.42c-1.32 6.9-4.25 15.45-12.99 18.28"
                                            style={{
                                                fill: "none",
                                            }}
                                        />
                                        <path
                                            className="st1"
                                            d="M160.39 126.43c-1.43 10.23-10.54 18.16-21.51 18.16-11 0-20.12-7.93-21.55-18.16h-6.72c1.45 13.8 13.56 24.6 28.27 24.6 14.67 0 26.8-10.8 28.26-24.6zm-42.05-65.87h19.07v-.98h-27.95V19.93h55.75v39.65h-2.72v.98h9.42V16.72c0-1.79-1.52-3.24-3.35-3.24h-62.44c-1.86 0-3.35 1.44-3.35 3.24v46.09c0 1.79 1.49 3.23 3.35 3.23h4.11c1.2-3.19 4.4-5.48 8.11-5.48"
                                        />
                                        <path
                                            className="st1"
                                            d="M162.49 43.7c0-1.79-1.51-3.23-3.35-3.23h-18.4c-1.84 0-3.33 1.44-3.33 3.23v16.86h25.09V43.7zm-18.4 15.88V46.91h11.71v12.67zM232 36.74l24.03 52.69c.65 1.42 2.24 2.18 3.79 1.85.21-.03 19.06-3.95 27.57 9.66.42.68.82 1.38 1.19 2.12.78 1.63 2.77 2.33 4.43 1.57 1.67-.75 2.41-2.66 1.61-4.28-7.29-15.1-23.78-17.06-33.54-15.83l-23.46-51.49c-1.58 1.74-3.49 3.03-5.62 3.71m-47.76 40.55c-.09 1.31-.05 2.94.08 4.96.12 1.16.23 2.47.42 3.91l.04.34c.97 8.26 5.62 15.86 12.11 19.87 3.29 2.01 6.87 3.03 10.58 3.03 2.24 0 4.51-.37 6.81-1.1 8.74-2.83 11.67-11.38 12.99-18.27.11-.55.21-1.13.3-1.67 1.84-11.14.84-22.83-.13-34.13-.37-4.18-.71-8.12-.92-12.06-.03-.64-.05-1.31-.07-1.96-.06-1.04-.09-2.08-.17-3.14-2.81-.56-5.36-2.14-7.31-4.45.56 2.44.67 5.08.8 7.85.01.69.05 1.35.07 2.01.23 4.04.58 8.24.94 12.28.93 10.91 1.89 22.19.19 32.58-.1.53-.17 1.02-.27 1.51-1.51 7.77-4.17 11.91-8.56 13.31-4.19 1.37-8.11.94-11.67-1.23-4.76-2.95-8.32-8.88-9.07-15.15l-.04-.39c-.09-.68-.17-1.31-.23-1.9-.34-3.34-.3-5.2-.2-6.2zm54.15 42.68h-60.2c.07 1 .13 1.99.13 3.01v.23c0 1.77-1.49 3.22-3.35 3.22h63.31c-.09-.92-.15-1.86-.15-2.8-.01-1.24.1-2.46.26-3.66M113.23 94.06c.99-3.2 2.71-6.68 5.59-9.62 4.01-4.12 9.68-6.46 16.87-7.02 1.11-.07 2.24-.12 3.42-.12h-20.77c-.4 0-.79-.04-1.16-.1-1.15.87-2.22 1.77-3.22 2.81-8.2 8.39-8.86 19.78-8.86 23.28 2.18-3.48 4.93-6.59 8.13-9.23"
                                        />
                                        <path
                                            className="st1"
                                            d="M226.28 37.07c.73.14 1.45.24 2.21.24 1.22 0 2.41-.22 3.51-.58 2.13-.68 4.04-1.97 5.62-3.71.58-.6 1.09-1.29 1.57-2.01-1.99 2.05-4.57 3.32-7.42 3.32-2.52 0-4.11-1.62-5.09-3.84-2.91-1.18-5.13-5.1-5.13-9.59 0-4.53 2.22-8.44 5.17-9.6 1.38-3.12 3.46-3.82 5.05-3.82 2.85 0 5.43 1.25 7.42 3.32-2.5-3.84-6.37-6.31-10.71-6.31-7.5 0-13.61 7.36-13.61 16.41 0 1 .08 1.98.21 2.93h3.12c1.86 0 3.35 1.46 3.35 3.22 0 1.79-1.49 3.23-3.35 3.23h-.87c.49.83 1.03 1.61 1.64 2.33 1.95 2.32 4.5 3.91 7.31 4.46"
                                        />
                                        <path
                                            className="st1"
                                            d="M231.77 7.49c-1.58 0-3.67.7-5.05 3.82-.23.51-.46 1.09-.63 1.74-.62 2.11-.94 4.91-.94 7.87 0 2.81.27 6.7 1.53 9.59.98 2.22 2.56 3.84 5.09 3.84 2.85 0 5.43-1.27 7.42-3.32 2.38-2.46 3.88-6.08 3.88-10.1 0-4.04-1.51-7.64-3.88-10.1-1.99-2.09-4.57-3.34-7.42-3.34m.93 6.61c2.05.69 3.68 3.57 3.68 6.81s-1.62 6.12-3.68 6.82c-1.14-2.79-1.14-10.84 0-13.63m-11.15 12.96c0-1.76-1.49-3.22-3.35-3.22h-31.43c-1.86 0-3.34 1.46-3.34 3.22 0 1.79 1.49 3.23 3.34 3.23h31.43c1.86 0 3.35-1.44 3.35-3.23m58.76 72.6c-4.07-2.2-8.78-3.45-13.76-3.45-1.32 0-2.6.09-3.85.25-12.64 1.67-22.63 11.33-24.32 23.52-.15 1.2-.26 2.42-.26 3.65 0 .94.06 1.88.15 2.8 1.46 13.8 13.59 24.6 28.28 24.6 15.65 0 28.39-12.28 28.39-27.4.01-10.31-5.9-19.28-14.63-23.97m-13.76 44.93c-11.98 0-21.73-9.4-21.73-20.96s9.75-20.96 21.73-20.96c11.96 0 21.72 9.4 21.72 20.96s-9.76 20.96-21.72 20.96"
                                        />
                                        <path
                                            className="st1"
                                            d="M266.55 111.21c-7.1 0-12.85 5.58-12.85 12.41s5.75 12.41 12.85 12.41c7.08 0 12.84-5.57 12.84-12.41 0-6.82-5.75-12.41-12.84-12.41m0 18.36c-3.4 0-6.18-2.66-6.18-5.94 0-3.29 2.77-5.95 6.18-5.95 3.38 0 6.14 2.66 6.14 5.95 0 3.28-2.75 5.94-6.14 5.94m-129.21 6.46c6.08 0 11.19-4.12 12.49-9.61h-7.06a6.24 6.24 0 0 1-5.44 3.14c-2.36 0-4.4-1.27-5.44-3.14h-7.08c1.33 5.49 6.44 9.61 12.53 9.61"
                                        />
                                        <path
                                            className="st1"
                                            d="M178.32 123.2v-.23c0-1.01-.06-2.01-.13-3.01-1.59-19.6-18.62-35.07-39.31-35.07-4.55 0-8.88.74-12.95 2.11-4.7 1.59-9 3.99-12.69 7.05-3.19 2.64-5.95 5.75-8.14 9.23a36.8 36.8 0 0 0-5.69 19.69v.23c0 1.77 1.49 3.22 3.35 3.22h72.23c1.84.01 3.33-1.45 3.33-3.22m-72.08-3.23c1.57-16.04 15.6-28.63 32.63-28.63 17 0 31.05 12.59 32.61 28.63zm32.87-42.68h53.4c4.77 0 8.67-3.75 8.67-8.37 0-4.6-3.9-8.36-8.67-8.36h-74.18c-3.71 0-6.91 2.29-8.11 5.48-.36.91-.56 1.86-.56 2.88 0 4.23 3.27 7.72 7.51 8.27.38.06.76.1 1.16.1zm-22.75-8.36c0-1.05.88-1.9 1.97-1.9h74.18c1.09 0 1.97.84 1.97 1.9 0 1.05-.88 1.92-1.97 1.92h-74.17c-1.1 0-1.98-.87-1.98-1.92M62.81 38.42c-1.83 0-3.33 1.44-3.33 3.23 0 1.77 1.5 3.21 3.33 3.21h33.46c1.84 0 3.33-1.44 3.33-3.21 0-1.79-1.49-3.23-3.33-3.23zm39.97 48.72c0-1.79-1.49-3.23-3.33-3.23H65.99c-1.83 0-3.32 1.44-3.32 3.23 0 1.77 1.5 3.21 3.32 3.21h33.46c1.84 0 3.33-1.45 3.33-3.21m-1.2-70.73c0-1.79-1.49-3.23-3.33-3.23H26.21c-1.85 0-3.34 1.43-3.34 3.23 0 1.79 1.49 3.23 3.34 3.23h72.03c1.85 0 3.34-1.44 3.34-3.23m-3.52 46.11c0-1.79-1.49-3.23-3.33-3.23H7.35C5.5 59.29 4 60.73 4 62.52c0 1.78 1.5 3.21 3.35 3.21h87.38c1.83 0 3.33-1.43 3.33-3.21"
                                        />
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-4 sm:text-start text-center">
                                    <h2 className="text-lg">پیک موتوری</h2>
                                    <div>
                                        <p className="text-sm">فقط برای آدرس‌های تهران</p>
                                        <p className="text-sm ">دریافت هزینه ارسال در مقصد</p>
                                    </div>
                                </div>
                            </button>

                        </div>
                    </div>

                </div>
                {/* ends of shipping boxes */}

                {/* starts of cost & discount boxes */}
                <div className="grid gap-12 justify-center">

                    {/* starts of products box */}
                    <div className={`bg-sky-100 col-start-1 lg:col-end-3 md:col-end-5 dark:bg-slate-600 dark:outline-slate-600 transition-all ${productConf ? "w-full opacity-100 outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid border-white dark:border-slate-800" : "h-0 opacity-60 w-0 overflow-hidden z-0"} flex flex-col justify-between transition-opacity rounded-l-xl rounded-b-xl`}>

                        <div className={`md:w-[90%] w-[80%] lg:pt-16 py-10 mx-auto transition-all duration-700 flex flex-col justify-center items-center gap-8 ${productConf ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                            {products.length > 0 ?
                                products
                                    .slice(page.page * page.countPerPage - page.countPerPage, page.page * page.countPerPage)
                                    .map((b: { count: number, productId: productCoverSingleType }) => (
                                        <div className="" key={b.productId
                                            ._id}>
                                            <BasketBox {...b.productId
                                            } count={b.count} refresh={refresh}
                                                setRefresh={setRefresh} />
                                        </div>
                                    )) :
                                page.search ?
                                    <p className="">
                                        {`محصولی در سبد خرید شما با \" ${page.search} \" مطابقت ندارد.`}
                                    </p> :
                                    <p className="">
                                        هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.
                                    </p>
                            }
                        </div>
                        {User && User?.bascket.length > page.countPerPage &&
                            <div className={`mb-10 transition-all duration-700 ${productConf ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                <PaginationBox basket={true} count={Math.ceil(User.bascket.length / page.countPerPage)} />
                            </div>
                        }
                    </div>
                    {/* ends of products box */}

                    {/* starts of favorite products */}
                    <div className={`bg-sky-100 lg:col-start-3 lg:col-end-5 pt-9 pb-4 px-6 p lg:row-start-1 md:col-end-5 col-start-1 md:row-start-3 row-start-4 dark:bg-slate-600 dark:outline-slate-600 transition-all ${productConf ? "w-full block opacity-100 outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid border-white dark:border-slate-800" : "hidden overflow-hidden z-0"} transition-opacity rounded-xl relative h-fit`}>
                        {(User && User.favorite.length > 0) ?
                            <FavBox fav={User.favorite} /> :
                            <>
                                <h3 className="text-slate-700 text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 dark:text-white bg-white absolute transition-all">
                                    محصولات مورد علاقه
                                </h3>
                                <p className="mt-14 text-center mb-2">هنوز محصولی به لیست مورد علاقه خود اضافه نکرده‌اید.</p>
                            </>
                        }
                    </div>
                    {/* starts of favorite products */}

                    {/* starts of discount box */}
                    <div className={`md:col-start-1 md:col-end-3 col-start-1 row-start-2 p-4 flex flex-col justify-around outline-[6px] outline border-2 border-solid transition-all border-white dark:border-slate-800 w-full rounded-xl dark:bg-slate-600 dark:outline-slate-600 ${infoConf && "bg-sky-100 outline-sky-100"} ${productConf && "bg-sky-100 outline-sky-100"} ${payment && "bg-sky-200 outline-sky-200"}`}>

                        <div className="flex md:items-center md:gap-8 gap-4 md:flex-row flex-col my-6 md:my-0">

                            <input type="text" className={`py-2 pl-4 pr-6 rounded-full bg-sky-100 border-2 focus:shadow-cs border-solid outline-none transition-all dark:bg-slate-400 dark:text-white dark:placeholder:text-slate-200 dark:border-slate-300 ${infoConf && "border-sky-400 bg-sky-50 placeholder:text-sky-500"} ${productConf && "border-sky-400 bg-sky-50 placeholder:text-sky-500"} ${payment && "border-sky-500 bg-sky-100 placeholder:text-sky-600"}`} placeholder='کد تخفیف'
                                value={Discount}
                                onChange={e => setDiscountHandler(e.target.value)}
                                readOnly={Boolean(DiscountCode)}
                            />

                            <button className={`py-2 px-6 rounded-full text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 ${infoConf && "bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100"} ${productConf && "hover:bg-sky-500 bg-sky-400 active:border-sky-100 border-sky-300"} ${payment && "bg-sky-500 active:border-sky-200 border-sky-400 hover:bg-sky-600"}`}
                                onClick={() => discountHandler()}>اعمال</button>

                            <p className={`${isValidDiscount?.state ? "text-lime-500" : "text-rose-500"} dark:text-white text-xs`}>{isValidDiscount && isValidDiscount.msg}</p>

                        </div>
                        <h3 className={`font-bold text-sky-800 dark:text-sky-200`}>
                            امکان ارسال با پیک موتوری برای ساکنین تهران
                        </h3>
                        <p className="text-slate-700 dark:text-white">
                            افزودن کالا به سبد خرید به معنی رزرو آن نیست با توجه به محدودیت موجودی سبد خود را ثبت و خرید را تکمیل کنید.
                        </p>
                    </div>
                    {/* ends of discount box */}

                    {/* starts of cost box */}
                    <div className={`md:col-start-3 col-start-1 text-slate-700 md:col-end-5 flex flex-col items-center gap-6 p-4 md:row-start-2 row-start-3 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 w-full rounded-xl dark:bg-slate-600 dark:outline-slate-600 transition-all dark:text-white ${infoConf && "bg-sky-100 outline-sky-100"} ${productConf && "bg-sky-100 outline-sky-100"} ${payment && "bg-sky-200 outline-sky-200"}`}>

                        <div className="flex justify-around w-full items-center gap-6 md:mt-0 mt-2">
                            <h3 className="">قیمت کل سفارش:</h3>
                            <h2>
                                <strong>{(TotalPrice + TotalDiscount).toLocaleString('fa-IR')} </strong><span className='text-sm'>تومان</span>
                            </h2>
                        </div>
                        <div className="flex justify-around w-full items-center gap-6">
                            <h3 className="">بسته‌بندی و ارسال:</h3>
                            {
                                bike &&
                                <span className=' text-sm'>دریافت هزینه ارسال در مقصد</span>
                            }
                            {
                                !bike && !postFast && !postPish &&
                                <span className=' text-sm'>وابسته به نوع ارسال</span>
                            }
                            {
                                (postFast || postPish) &&
                                <h3>
                                    <strong>{shipmentPrice.toLocaleString('fa-IR')} </strong><span className='text-sm'>تومان</span>
                                </h3>
                            }
                        </div>
                        <div className="flex justify-around w-full items-center gap-6 md:mt-0 mt-2">
                            <h3 className="">تخفیف:</h3>
                            <h2>
                                <strong>{(TotalDiscount + DiscountCode).toLocaleString('fa-IR')} </strong><span className='text-sm'>تومان</span>
                            </h2>
                        </div>
                        <div className="flex justify-around w-full items-center gap-6 font-bold text-sky-800 dark:text-sky-200">
                            <h3 className="">قیمت قابل پرداخت:</h3>
                            <h2>
                                <strong>{(TotalPrice + shipmentPrice - DiscountCode) > 0 ? (TotalPrice + shipmentPrice - DiscountCode).toLocaleString('fa-IR') : 0} </strong><span className='text-sm'>تومان</span>
                            </h2>
                        </div>

                        <button className={`py-2.5 w-full rounded-full text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 ${infoConf && "bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100"} ${productConf && "hover:bg-sky-500 bg-sky-400 border-sky-300 active:border-sky-100"} ${payment && "bg-sky-500 border-sky-400 hover:bg-sky-600 active:border-sky-200"}`}
                            onClick={() => submitHandler()}
                        >
                            {payment ? "پرداخت" : "گام بعدی"}
                        </button>

                    </div>
                    {/* ends of cost box */}

                </div>
                {/* ends of cost & discount boxes */}

                <AlertBox txt="لطفا نحوه ارسال را انتخاب کنید." open={alert} setOpen={setAlert} status="no" time={4000} />
            </div>

        </div>
    );
}

export default Basket;