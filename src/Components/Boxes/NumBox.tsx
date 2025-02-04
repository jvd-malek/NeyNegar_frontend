import { useState } from "react"

type NumBox = {
    num: string
    setNum: React.Dispatch<React.SetStateAction<string>>
    sendPass: boolean
    changePhone: VoidFunction
    setSendPass: React.Dispatch<React.SetStateAction<boolean>>
    setPassAccepted: React.Dispatch<React.SetStateAction<boolean>>
    pass: string
    setPass: React.Dispatch<React.SetStateAction<string>>
}

function NumBox({ num,
    setNum,
    sendPass,
    changePhone,
    setSendPass,
    pass,
    setPassAccepted,
    setPass }: NumBox) {

    const [txt, setTxt] = useState('')
    const [Err, setErr] = useState(false)

    const err = (data: string) => {
        setTxt(data)
        setErr(true)
    }

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.currentTarget.value)
        setErr(false)
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
            .then(data => data.state ? setPassAccepted(true) : err(data.msg))
    }

    return (
        <>
            <div className="relative">
                <input
                    type="number"
                    id="hs-floating-gray-input-email"
                    className="peer px-4 py-5 block w-full bg-blue-100 border-transparent rounded-lg text-sm placeholder:text-transparent outline-none focus:border-blue-500 dark:focus:border-slate-700 border-[3px] border-solid disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-400 dark:border-transparent text-slate-800 dark:text-neutral-800 dark:focus:ring-slate-600 focus:pt-7 focus:pb-3 [&:not(:placeholder-shown)]:pt-7 [&:not(:placeholder-shown)]:pb-3 autofill:pt-7 autofill:pb-3"
                    placeholder=""
                    value={num}
                    onChange={e => setNum(e.currentTarget.value)}
                    onKeyUp={e => { e.key === "Enter" && setSendPass(true) }}
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
                onClick={() => setSendPass(true)}
            >دریافت کد یکبار مصرف</button>
        </>
    );
}

export default NumBox;