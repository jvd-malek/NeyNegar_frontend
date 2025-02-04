import { memo, useCallback, useEffect, useRef, useState } from "react";  
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';  
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';  
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';  
import IconButton from '@mui/material/IconButton';  
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';  
import { Link, useNavigate } from 'react-router-dom';  

type SideMenuProps = {  
    isSearchOpen: boolean,  
    setDark: React.Dispatch<React.SetStateAction<boolean>>,  
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>,  
}  

const SideMenu = memo(({ setDark, isSearchOpen, setSearchOpen }: SideMenuProps) => {  
    const [search, setSearch] = useState('');  
    const [mount, setMount] = useState(false);  
    const searchInput = useRef<HTMLInputElement>(null);  
    const nav = useNavigate();  

    useEffect(() => {  
        setMount(true);  
    }, []);  

    const keyHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {  
        if (e.code === "Enter") {  
            if (search.trim()) {  
                nav(`/category/search/${search.trim()}`);  
                window.scrollTo({ top: 0, behavior: "smooth" });  
                setSearchOpen(false);  
                setSearch("");  
            }  
        }  
    }, [nav, search, setSearchOpen]);  

    const btnSearchHandler = useCallback(() => {  
        if (isSearchOpen && search.trim()) {  
            nav(`/category/search/${search.trim()}`);  
            window.scrollTo({ top: 0, behavior: "smooth" });  
            setSearch("");  
        } else {  
            setTimeout(() => {  
                searchInput.current?.focus();  
            }, 500);  
        }  
        setSearchOpen(!isSearchOpen);  
    }, [isSearchOpen, nav, search, setSearchOpen]);  

    return (  
        <div className={`fixed right-5 bottom-5 lg:flex flex-col gap-3 hidden z-10 ${isSearchOpen && "z-50"}`}>  
            <Link  
                to={'/basket'}  
                className={`bg-sky-300 rounded-full w-fit z-20 shadow-cs transition-all duration-[225ms] ${mount ? "translate-x-0" : 'translate-x-6'}`}  
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>  
                <IconButton>  
                    <LocalMallRoundedIcon />  
                </IconButton>  
            </Link>  
            <div className={`bg-sky-300 rounded-full dark:hidden w-fit shadow-cs transition-all duration-150 ${mount ? "translate-x-0" : 'translate-x-6'}`}>  
                <IconButton onClick={() => setDark(true)}>  
                    <DarkModeRoundedIcon />  
                </IconButton>  
            </div>  
            <div className={`bg-sky-300 rounded-full hidden dark:block w-fit shadow-cs transition-all duration-150 ${mount ? "translate-x-0" : 'translate-x-6'}`}>  
                <IconButton onClick={() => setDark(false)}>  
                    <WbSunnyRoundedIcon />  
                </IconButton>  
            </div>  

            <div className={`z-50 bg-sky-300 transition-all overflow-hidden flex items-center ${mount ? "translate-x-0 " : 'translate-x-6 '} ${isSearchOpen ? "w-full rounded-r-3xl rounded-l-md duration-500 shadow-css" : ' shadow-cs w-10 rounded-full'}`}>  
                <IconButton onClick={btnSearchHandler}>  
                    <SearchRoundedIcon />  
                </IconButton>  
                <input type="text"  
                    placeholder='جستجوی محصولات'  
                    id='searchHeader'  
                    value={search}  
                    ref={searchInput}  
                    onKeyUp={keyHandler}  
                    onChange={e => setSearch(e.target.value)}  
                    className={`bg-sky-300 py-2 px-3.5 rounded-full text-neutral-800 outline-none placeholder:text-zinc-600 ${!isSearchOpen && "hidden"}`} />  
            </div>  
        </div>  
    );  
});  

export default SideMenu;