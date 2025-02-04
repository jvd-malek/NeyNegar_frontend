import { useState } from 'react';
import { IconButton } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Link, useNavigate, useParams } from 'react-router-dom';


function Login() {
    const [txt, setTxt] = useState('')
    const [Err, setErr] = useState(false)
    let navigate = useNavigate()
    const [num, setNum] = useState('')
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')
    const [sendPass, setSendPass] = useState(false)
    const [nameOpen, setNameOpen] = useState(false)
    const { bas } = useParams()


    const err = (data: string) => {
        setTxt(data)
        setErr(true)
    }

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.currentTarget.value)
        setErr(false)
    }

    const nav = () => {
        setNum("")
        setPass("")
        setName("")
        setErr(false)
        setSendPass(false)
        setNameOpen(false)
        if (bas) {
            navigate("/basket")
        } else {
            navigate("/")
        }
        window.location.reload()
    }

    const log = async () => {
        await fetch(`https://api.neynegar1.ir/users/${nameOpen ? "register" : "login"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone: num })
        })
            .then(res => res.json())
            .then(data => localStorage.setItem("jwt", data.accessToken))
        nav()
    }

    const checkPass = () => {
        fetch(`https://api.neynegar1.ir/users/code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: num, code: pass })
        })
            .then(res => res.json())
            .then(data => {
                if (data.state) {
                    log()
                } else {
                    err(data.msg)
                }
            })
    }

    const fetchSMS = (name: string) => {
        fetch(`https://api.neynegar1.ir/users/sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone: num })
        })
            .then(res => res.json())
            .then(data => data)
    }

    const checkUser = async () => {
        if (name) {
            fetchSMS(name)
            setSendPass(true)
        } else {
            await fetch(`https://api.neynegar1.ir/users/isExist/${num}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        fetchSMS(data.name)
                        setSendPass(true)
                    } else {
                        setNameOpen(true)
                    }
                })
        }
    }

    const changePhone = () => {
        setSendPass(false)
        setErr(false)
        setNameOpen(false)
        setNum("")
        setPass("")
        setName("")
    }

    return (
        <div className="flex justify-center items-center w-full h-screen font-[vazir] dark:bg-slate-800">
            <img src="../Imgs/login.jpg" alt="" className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            <div className="bg-dark-glass w-full h-full flex justify-center items-center">
                <div className="sm:h-[80vh] h-[60vh] sm:max-w-[25rem] w-[85vw] mx-6 rounded-3xl overflow-hidden relative">
                    <Link to={'/'} className='absolute top-[1.90rem] right-4 z-20'>
                        <IconButton color='primary'>
                            <div className="w-4 h-4 -translate-y-2 translate-x-1 text-blue-500 dark:text-white">
                                <ClearRoundedIcon />
                            </div>
                        </IconButton>
                    </Link>

                    <div className={
                        " absolute top-0 transition-all duration-700 ease-in-out w-full py-8 px-8 text-lg text-blue-500 dark:text-white text-center flex flex-col justify-between bg-white dark:bg-slate-600 h-full"}>

                        <h2>ورود به حساب کاربری</h2>
                        <div className="flex flex-col gap-5" dir='rtl'>


                            <div className="relative">
                                <input
                                    type="number"
                                    id="hs-floating-gray-input-email"
                                    className="peer px-4 py-5 block w-full bg-blue-100 border-transparent rounded-lg text-sm placeholder:text-transparent outline-none focus:border-blue-500 dark:focus:border-slate-700 border-[3px] border-solid disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-400 dark:border-transparent text-slate-800 dark:text-neutral-800 dark:focus:ring-slate-600 focus:pt-7 focus:pb-3 [&:not(:placeholder-shown)]:pt-7 [&:not(:placeholder-shown)]:pb-3 autofill:pt-7 autofill:pb-3"
                                    placeholder=""
                                    value={num}
                                    onChange={e => setNum(e.currentTarget.value)}
                                    onKeyUp={e => { e.key === "Enter" && checkUser() }}
                                />

                                <label
                                    htmlFor="hs-floating-gray-input-email"
                                    className="absolute top-0 start-0 px-4 py-5 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-3 peer-focus:text-blue-700 dark:peer-focus:text-neutral-700 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-700 dark:text-neutral-700"
                                >
                                    شماره همراه
                                </label>

                                <button className={`${!sendPass && "hidden"} text-xs bg-blue-200 px-3 py-2 rounded-md dark:bg-slate-500  text-blue-600 dark:text-neutral-300 cursor-pointer absolute top-1/2 -translate-y-1/2 left-[10%]`}
                                    onClick={() => changePhone()}
                                >تغییر شماره همراه
                                </button>
                            </div>

                            <div className={`${nameOpen ? "relative" : "hidden"}`}>
                                <input
                                    type="text"
                                    id="hs-floating-gray-input-email"
                                    className="peer px-4 py-5 block w-full bg-blue-100 border-transparent rounded-lg text-sm placeholder:text-transparent outline-none focus:border-blue-500 dark:focus:border-slate-700 border-[3px] border-solid disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-400 dark:border-transparent text-slate-800 dark:text-neutral-800 dark:focus:ring-slate-600 focus:pt-7 focus:pb-3 [&:not(:placeholder-shown)]:pt-7 [&:not(:placeholder-shown)]:pb-3 autofill:pt-7 autofill:pb-3"
                                    placeholder=""
                                    value={name}
                                    onChange={e => setName(e.currentTarget.value)}
                                    onKeyUp={e => { e.key === "Enter" && checkUser() }}
                                />

                                <label
                                    htmlFor="hs-floating-gray-input-email"
                                    className="absolute top-0 start-0 px-4 py-5 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-3 peer-focus:text-blue-700 dark:peer-focus:text-neutral-700 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-700 dark:text-neutral-700"
                                >
                                    نام و نام‌خانوادگی
                                </label>
                            </div>

                            <div className={`${sendPass ? "relative" : "hidden"}`}>
                                <input
                                    type="number"
                                    id="hs-floating-gray-input-email"
                                    className={`peer px-4 py-5 block w-full border-transparent rounded-lg text-sm placeholder:text-transparent outline-none border-[3px] border-solid disabled:opacity-50 disabled:pointer-events-none focus:pt-7 focus:pb-3 [&:not(:placeholder-shown)]:pt-7 [&:not(:placeholder-shown)]:pb-3 autofill:pt-7 autofill:pb-3 ${Err ? "text-rose-600 focus:border-rose-600 border-rose-500 bg-rose-100 dark:bg-rose-300 dark:text-rose-700" : "bg-blue-100 focus:border-blue-500 dark:focus:border-slate-700 dark:bg-slate-400 dark:border-transparent text-slate-800 dark:text-neutral-800 dark:focus:ring-slate-600"}`}
                                    placeholder=""
                                    value={pass}
                                    onChange={e => change(e)}
                                    onKeyUp={e => { e.key === "Enter" && checkPass() }}
                                />

                                <label
                                    htmlFor="hs-floating-gray-input-email"
                                    className={`absolute top-0 start-0 px-4 py-5 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-3 peer-focus:text-blue-700 dark:peer-focus:text-neutral-700 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-700 dark:text-neutral-700 ${Err && "text-rose-400"}`}
                                >
                                    رمز عبور
                                </label>

                                <button className={`${!sendPass && "hidden"} ${Err ? "bg-rose-200 text-rose-600 dark:bg-rose-400 dark:text-rose-800 font-bold" : "bg-blue-200 dark:bg-slate-500 text-blue-600 dark:text-neutral-300"} text-xs px-8 py-2 rounded-md cursor-pointer absolute top-1/2 -translate-y-1/2 left-[10%]`}
                                    onClick={() => checkPass()}
                                >
                                    ثبت
                                </button>
                            </div>

                            <p className={`${Err ? "block" : "hidden"} text-xs -translate-y-3 text-rose-500 dark:text-rose-100`}>{txt}</p>

                            <button className={`${sendPass ? "hidden" : "block"} px-4 py-5 w-full transition-all duration-75 dark:active:border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-900 rounded-lg bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-white text-sm text-white border-b-4 border-solid active:translate-y-1`}
                                onClick={() => checkUser()}
                            >دریافت کد یکبار مصرف</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;