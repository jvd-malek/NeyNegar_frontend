import { useEffect } from "react";

function Load() {

    useEffect(() => {
        if (localStorage.getItem('dark') === "true") {
            document.body.classList.add('dark');
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 dark:bg-slate-800 w-[100vw] h-[100vh] pt-48 pb-20 flex justify-between items-center flex-col">
            <div className="text-5xl dark:text-white ml-[4.5rem] text-sky-700 font-[Soofee] relative">
                <span className="">نی‌</span>
                <span className="absolute -left-16">نگار</span>
            </div>
            <div className="loader text-sky-700 dark:text-white"></div>
        </div>
    );
}

export default Load;