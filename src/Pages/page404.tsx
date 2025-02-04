import { Link } from "react-router-dom";

function Page404() {
    let n = 404
    return (
        <div className="flex flex-col justify-center items-center pt-28 overflow-hidden relative">
            <h2 className=" absolute text-5xl font-bold text-neutral-900/75 top-36 left-1/2 -translate-x-1/2 z-10">{n.toLocaleString("fa-IR")}</h2>
            <img src="./Imgs/dribbble_1.gif" alt="" className="rounded-xl max-h-[400px] w-[600px] object-cover" />
            <p className=" text-lg font-bold mt-4">به نظر می‌رسد گم شده‌اید</p>
            <p className="">صفحه‌ای که به دنبال آن هستید در دسترس نیست!</p>
            <Link to={"/"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <button className={`transition-all duration-75 dark:active:border-slate-800 dark:bg-slate-600 dark:border-slate-700 dark:hover:bg-slate-700 py-2.5 mt-6 rounded-full bg-sky-400 border-sky-300 hover:bg-sky-500 active:border-white text-white border-b-4 border-solid active:translate-y-1 w-60`}>
                    برو به صفحه خانه
                </button>
            </Link>
        </div>
    );
}

export default Page404;