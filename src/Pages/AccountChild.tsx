import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { useEffect, useState } from "react";
import CommentBox from "../Components/Comment/CommentBox";
import CommentInput from '../Components/Comment/CommentInput';
import { accountType } from '../Components/Types/user';
import FavBox from '../Components/Boxes/FavBox';
import AccountProductBox from '../Components/Boxes/AccountProductBox';
import TxtBox from '../Components/Boxes/TxtBox';
import { ticketType } from '../Components/Types/ticket';
import moment from "jalali-moment"

type AccountChildType = {
    type: string,
    setActiveLink: React.Dispatch<React.SetStateAction<string>>
}

function AccountChild({ type, setActiveLink, user, orders, comments }: AccountChildType & accountType) {
    const jwt = localStorage.getItem("jwt")
    const [FirstName, setFirstName] = useState('')
    const [Tickets, setTickets] = useState<ticketType[]>()
    const [refresh, setRefresh] = useState(false)
    const [Num, setNum] = useState('')
    const [City, setCity] = useState('')
    const [State, setState] = useState('')
    const [PostCode, setPostCode] = useState('')
    const [Address, setAddress] = useState('')
    const [errTxt, setErrTxt] = useState<{ type: string, state: boolean }[]>([
        { type: "نام", state: false },
        { type: "شماره تلفن", state: false },
        { type: "کدپستی", state: false },
        { type: "استان", state: false },
        { type: "شهر", state: false },
        { type: "آدرس", state: false },
    ])
    const discounts = user.discount

    useEffect(() => {
        if (user) {
            setFirstName(user.name)
            setNum(String(user.phone))
            if (user.address) {
                let Address = user.address.split("%%")
                setState(Address[0])
                setCity(Address[1])
                setAddress(Address[2])
            }
            if (user.postCode) {
                setPostCode(String(user.postCode))
            }
        }
    }, [user])

    useEffect(() => {
        if (jwt) {
            fetch(`https://api.neynegar1.ir/tickets/${user._id}`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state) {
                        setTickets(data.tickets)
                    } else {
                        console.log(data.msg)
                    }
                })
        }
    }, [refresh])

    const infoHandler = async () => {
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
            await updateInfoUser({ name: FirstName, postCode: +PostCode.trim(), address: `${State.trim()}%%${City.trim()}%%${Address.trim()}` })
            window.scrollTo({ top: 200, behavior: "smooth" })
        }
    }

    const logoutHandler = async () => {
        localStorage.removeItem("jwt")
        window.location.reload()
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

    return (
        <>
            <div className="bg-sky-100 w-full dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid relative dark:text-white text-slate-700 border-white dark:border-slate-800 rounded-xl p-4 col-start-2 col-end-5 row-start-1 ">
                {
                    type !== "خانه" &&
                    <h3 className="text-lg font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                        {type}
                    </h3>
                }

                {
                    type === 'خانه' &&

                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <h2 className=" text-xl">
                                {`
                                ${user.name} عزیز؛ خوش اومدی 🙌
                                `}
                            </h2>
                            <div className="dark:text-white text-sky-500 transition-all">
                                <CircleNotificationsRoundedIcon sx={{ fontSize: '4rem' }} />
                            </div>
                        </div>

                        <div className="">

                            <div className="">
                                <div className="flex justify-between items-center border-solid border-b dark:border-white border-slate-500 mt-16 pb-3">
                                    <p className=" text-lg">
                                        مورد علاقه های من
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-8 justify-center">
                                    <FavBox fav={user.favorite} account />
                                </div>
                            </div>

                            <div className="">
                                <div className="flex justify-between items-center border-solid border-b dark:border-white border-slate-500 mt-10 pb-3">
                                    <p className=" text-lg">
                                        تخفیف‌های فعال من
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-8 justify-center">
                                    {
                                        discounts.length > 0 ?
                                            discounts.reverse().map(d => (
                                                <div key={d.date} className={`border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full flex justify-between items-center sm:flex-row flex-col`}>
                                                    <p className="">{`کد تخفیف: ${d.code}`}</p>
                                                    <p className="">{`تخفیف: ${d.discount.toLocaleString("FA-IR")}`}</p>
                                                    {d.date < Date.now() ?
                                                        <p className="">منقضی شد</p> :
                                                        <p className="">{`تاریخ انقضا: ${moment(d.date).locale('fa').format('YYYY/MM/DD')}`}</p>
                                                    }
                                                </div>
                                            )) :
                                            <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">
                                                تخفیفی برای شما فعال نشده است.
                                            </p>
                                    }
                                </div>
                            </div>

                            <div className="mt-16">
                                <div className="flex justify-between items-center border-solid border-b dark:border-white border-slate-500 mt-10 sm:mt-4 pb-3">
                                    <p className=" text-lg">
                                        سفارشات اخیر
                                    </p>
                                    <div
                                        onClick={() => { setActiveLink('سفارشات'); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                                        className="flex items-center gap-x-1.5 cursor-pointer">
                                        مشاهده همه
                                        <span className="text-slate-700 dark:text-white">
                                            <KeyboardBackspaceRoundedIcon />
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-10 w-full">
                                    <AccountProductBox orders={orders} demo user={user} />
                                </div>
                            </div>

                            <div className="">
                                <div className="flex justify-between items-center border-solid border-b dark:border-white border-slate-500 mt-20 pb-3">
                                    <p className=" text-lg">
                                        نظرات اخیر
                                    </p>
                                    <div
                                        onClick={() => { setActiveLink('نظرات'); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                                        className="flex items-center gap-x-1.5 cursor-pointer">
                                        مشاهده همه
                                        <span className="text-slate-700 dark:text-white">
                                            <KeyboardBackspaceRoundedIcon />
                                        </span>
                                    </div>
                                </div>
                                {
                                    comments.length > 0 ?
                                        comments.reverse().slice(0, 2).map(c => (
                                            <div className="" key={c._id}>
                                                <CommentBox account={true} {...c} />
                                            </div>
                                        )) :
                                        <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">هنوز نظری به اشتراک نگذاشته‌اید.</p>
                                }
                            </div>

                            <div className="">
                                <div className="flex justify-between items-center border-solid border-b dark:border-white border-slate-500 mt-20 pb-3">
                                    <p className=" text-lg">
                                        سوالات اخیر
                                    </p>
                                    <div
                                        onClick={() => { setActiveLink('تیکت‌ها'); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                                        className="flex items-center gap-x-1.5 cursor-pointer">
                                        مشاهده همه
                                        <span className="text-slate-700 dark:text-white">
                                            <KeyboardBackspaceRoundedIcon />
                                        </span>
                                    </div>
                                </div>
                                {
                                    Tickets && Tickets.length > 0 ?
                                        Tickets.reverse().slice(0, 2).map(c => (
                                            <div className="" key={c._id}>
                                                <CommentBox ticket={true} {...c} />
                                            </div>
                                        )) :
                                        <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">هنوز سوالی ثبت نکرده‌اید.</p>
                                }
                            </div>
                        </div>

                    </div>
                }

                {
                    type === 'سفارشات' &&
                    <div className="mt-24 pb-8">
                        <AccountProductBox orders={orders} user={user} />
                    </div>
                }

                {
                    type === 'جزییات حساب' &&
                    <div className='mt-24 w-full'>
                        <form action="#" className="grid gap-x-12" onSubmit={e => e.preventDefault()}>

                            <div className="col-start-1 md:col-end-2 col-end-3 row-start-1">
                                <h2 className="text-slate-700 dark:text-white text-lg">
                                    اطلاعات گیرنده:
                                </h2>

                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex flex-col gap-2 mt-4 w-full transition-all rounded-xl pt-6 pb-6 h-full">
                                        <TxtBox errTxt={errTxt}
                                            setErrTxt={setErrTxt} type={"string"} bascket val={FirstName} setVal={setFirstName} txt="نام" />
                                        <TxtBox errTxt={errTxt}
                                            readOnly setErrTxt={setErrTxt} type={"number"} bascket val={Num} setVal={setNum} txt="شماره تلفن" />
                                        <TxtBox errTxt={errTxt}
                                            setErrTxt={setErrTxt} type={"number"} bascket val={PostCode} setVal={setPostCode} txt="کدپستی" />
                                    </div>

                                </div>

                            </div>

                            <div className="md:col-start-2 col-start-1 col-end-3 md:row-start-1 row-start-2">
                                <h2 className="text-slate-700 dark:text-white text-lg">
                                    آدرس گیرنده:
                                </h2>

                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex flex-col gap-2 mt-4 w-full transition-all rounded-xl pt-6 h-full">
                                        <TxtBox errTxt={errTxt}
                                            setErrTxt={setErrTxt} type={"string"} bascket val={State} setVal={setState} txt="استان" />
                                        <TxtBox errTxt={errTxt}
                                            setErrTxt={setErrTxt} type={"string"} bascket val={City} setVal={setCity} txt="شهر" />
                                        <TxtBox errTxt={errTxt}
                                            setErrTxt={setErrTxt} type={"string"} bascket val={Address} setVal={setAddress} txt="آدرس" />
                                    </div>

                                </div>

                            </div>

                            <div className="flex justify-between sm:gap-12 sm:flex-row flex-col  items-center col-start-1 col-end-3 md:row-start-2 row-start-3">
                                <button className={`py-2.5 mb-4 md:mb-6 lg:mb-8 lg:mt-0 mt-4 w-full rounded-full bg-red-500 border-red-400 hover:bg-red-600 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600`}
                                    onClick={() => logoutHandler()}
                                >خروج از حساب</button>

                                <button className={`py-2.5 mb-4 md:mb-6 lg:mb-8 lg:mt-0 mt-4 w-full rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-sky-100 text-white border-b-4 border-solid active:translate-y-1 transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900`}
                                    onClick={() => infoHandler()}
                                >ثبت اطلاعات</button>
                            </div>
                        </form>
                    </div>
                }

                {
                    type === 'نظرات' &&
                    <div className="mt-24">
                        {
                            comments.length > 0 ?
                                comments.reverse().map(c => (
                                    <div className="" key={c._id}>
                                        <CommentBox account={true} {...c} />
                                    </div>
                                )) :
                                <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">هنوز نظری به اشتراک نگذاشته‌اید.</p>
                        }
                    </div>
                }

                {
                    type === 'پرسش و پاسخ' &&
                    <div className="mt-24">
                        <CommentInput ticket={true} refresh={refresh} setRefresh={setRefresh} />
                        <p className=" text-lg border-solid border-b dark:border-white border-slate-500 mb-10 pb-3">
                            سوالات شما
                        </p>
                        {
                            Tickets && Tickets.length > 0 ?
                                Tickets.reverse().map(c => (
                                    <div className="" key={c._id}>
                                        <CommentBox ticket={true} {...c} />
                                    </div>
                                )) :
                                <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">هنوز سوالی ثبت نکرده‌اید.</p>
                        }
                    </div>
                }
            </div>
        </>
    );
}

export default AccountChild;