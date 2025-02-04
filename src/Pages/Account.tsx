import { useEffect, useState } from "react";
import AccountChild from "./AccountChild";
import { useNavigate } from "react-router-dom";
import { accountType } from "../Components/Types/user";



function Account({ order = false }: { order?: boolean }) {
    const [activeLink, setActiveLink] = useState(order ? "سفارشات" : 'خانه')
    const [User, setUser] = useState<accountType>()
    let navigate = useNavigate()

    const links = [
        { id: 1, txt: 'خانه' },
        { id: 2, txt: 'سفارشات' },
        { id: 3, txt: 'جزییات حساب' },
        { id: 4, txt: 'نظرات' },
        { id: 5, txt: 'پرسش و پاسخ' },
    ]

    useEffect(() => {
        const jwt = localStorage.getItem("jwt")

        if (jwt) {
            fetch(`https://api.neynegar1.ir/users/account`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state) {
                        setUser(data)
                    } else {
                        localStorage.removeItem("jwt")
                        navigate("/")
                    }
                })
        }
    }, [])

    return (
        <div className="mt-32 w-[85vw] mx-auto flex gap-8 lg:flex-row flex-col">
            <div className="lg:w-[20%] h-fit relative bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-2 border-solid border-white text-slate-700 dark:text-white dark:border-slate-800 rounded-xl p-4 text-center pt-20 z-10">

                <h1 className="text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                    پیشخوان
                </h1>
                {
                    links.map(l => (
                        <div key={l.id} onClick={() => { setActiveLink(l.txt); window.scrollTo({ top: 0, behavior: "smooth" }) }} className="cursor-pointer">
                            <p className={`mt-5 border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 bg-white outline-white shadow-cs py-2 px-4 outline-[4px] outline border-2 transition-all border-solid rounded-xl relative ${activeLink === l.txt && "border-x-sky-500 dark:border-x-white border-x-4"}`}>{l.txt}</p>
                        </div>
                    ))
                }

            </div>
            {
                User &&
                <AccountChild type={activeLink} setActiveLink={setActiveLink} {...User} />
            }
        </div>
    );
}

export default Account;