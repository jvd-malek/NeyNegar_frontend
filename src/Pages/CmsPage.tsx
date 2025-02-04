import { useMemo, useState } from "react";
import CmsChild from "./CmsChild";
import { ticketType } from "../Components/Types/ticket";
import { orderType } from "../Components/Types/order";

function CmsPage() {
    const jwt = localStorage.getItem("jwt")
    const [activeLink, setActiveLink] = useState('محصولات')
    const links = [
        { id: 1, txt: 'محصولات' },
        { id: 2, txt: 'مقالات' },
        { id: 3, txt: 'تیکت‌ها' },
        { id: 4, txt: 'سفارشات' },
        { id: 5, txt: 'کاربران' },
        { id: 6, txt: 'تخفیف‌ها' },
    ]
    const [ticketState, setTicketState] = useState<ticketType[]>([])
    const [ordersState, setOrdersState] = useState<orderType[]>([])

    useMemo(async () => {
        if (jwt) {
            await fetch(`https://api.neynegar1.ir/tickets`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state) {
                        setTicketState(data.tickets)
                    } else {
                        console.log(data.msg)
                    }
                })
            await fetch(`https://api.neynegar1.ir/orders`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state) {
                        setOrdersState(data.orders)
                    } else {
                        console.log(data.msg)
                    }
                })
        }
    }, [])
    
    return (
        <div className="mt-32 w-[85vw] mx-auto grid gap-8">
            <div className="col-start-1 lg:col-end-2 col-end-5 row-start-1 h-fit relative bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid border-white text-slate-700 dark:text-white dark:border-slate-800 rounded-xl p-4 text-center pt-20 z-10">

                <h1 className="text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                    مدیریت سایت
                </h1>
                {
                    links.map(l => (
                        <p key={l.id} className={`mt-5 cursor-pointer border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 bg-white outline-white shadow-cs py-2 px-4 outline-[4px] outline border-2 border-solid rounded-xl relative ${activeLink === l.txt && "border-b-sky-500 dark:border-b-white border-b-4 transition-all"}`}
                            onClick={() => setActiveLink(l.txt)}>
                            {l.txt}
                            {l.txt == "تیکت‌ها" && ticketState.length > 0 &&
                                ticketState.filter((i) => (
                                    !i.response
                                )).length > 0 &&
                                <p className=" absolute left-0 bg-red-600 rounded-full w-3 h-3 top-0"></p>
                            }
                            {l.txt == "سفارشات" && ordersState.length > 0 &&
                                ordersState.filter((i) => (
                                    i.status == "در حال آماده‌سازی"
                                )).length > 0 &&
                                <p className=" absolute left-0 bg-red-600 rounded-full w-3 h-3 top-0"></p>
                            }
                        </p>
                    ))
                }

            </div>

            <CmsChild type={activeLink} ticketState={ticketState} ordersState={ordersState} />
        </div>
    );
}

export default CmsPage;