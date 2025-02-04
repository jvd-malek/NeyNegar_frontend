import { memo, useCallback } from "react";  
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';  
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';  
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';  
import IconButton from '@mui/material/IconButton';  
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';  
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';  
import { Link, useNavigate } from "react-router-dom";  
import { useState } from "react";  
import SwipeableDrawer from '@mui/material/SwipeableDrawer';  
import { linksType } from "../../Types/links";  
import { userType } from '../../Types/user';  

type NavLinksProps = {  
    isOpen: boolean;  
    setDark: React.Dispatch<React.SetStateAction<boolean>>;  
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;  
    innerWidth: number;  
    links: linksType[];  
    user: userType | undefined;  
}  

const NavLinks = memo(({ isOpen, setOpen, setDark, innerWidth, links, user }: NavLinksProps) => {  
    const [search, setSearch] = useState('');  
    const nav = useNavigate();  
    const jwt = localStorage.getItem("jwt");  

    const scrollTop = useCallback(() => {  
        window.scrollTo({ top: 0, behavior: "smooth" });  
        setOpen(false);  
    }, [setOpen]);  

    const keyHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {  
        if (e.code === "Enter") {  
            searchHandler();  
        }  
    }, []);  

    const searchHandler = useCallback(() => {  
        if (search.trim().length > 0) {  
            nav(`/category/search/${search.trim()}`);  
            scrollTop();  
            setSearch("");  
        }  
    }, [nav, scrollTop, search]);  

    return (  
        <SwipeableDrawer  
            anchor={innerWidth < 640 ? 'bottom' : "left"}  
            open={isOpen}  
            onClose={() => setOpen(false)}  
            onOpen={() => setOpen(true)}  
            sx={{ fontFamily: 'vazir', textAlign: 'center' }}  
            ModalProps={{ keepMounted: false }}  
            disableSwipeToOpen={false}  
            className="block lg:hidden"  
        >  
            <div className="h-[65vh] sm:h-full md:w-[60vw] sm:w-[70vw] dark:bg-slate-800">  
                <div className="relative z-10 dark:bg-slate-800">  
                    <ul className="flex gap-4 text-center flex-col lg:hidden w-full p-6 transition-all duration-200 h-full">  
                        <div className="flex gap-4">  
                            <li className="p-[0.08rem] rounded-xl gr1 dark:gr2dark">  
                                <div className="w-full rounded-xl text-slate-700 dark:text-white" onClick={searchHandler}>  
                                    <IconButton sx={{ color: 'white' }} >  
                                        <SearchRoundedIcon />  
                                    </IconButton>  
                                </div>  
                            </li>  
                            <li className="w-full p-[0.08rem] rounded-xl ">  
                                <div className="w-full rounded-xl text-slate-700 dark:text-white">  
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyUp={keyHandler} className="w-full bg-sky-300 dark:gr2dark rounded-xl outline-none px-4 py-[0.55rem] dark:placeholder:text-slate-300 placeholder:text-slate-600" placeholder="جستجو محصولات" />  
                                </div>  
                            </li>  
                        </div>  

                        <div className="mb-5 flex gap-4 transition-all">  
                            <li className="p-[0.08rem] rounded-xl gr1 dark:gr2dark">  
                                <div className="w-full rounded-xl text-slate-700 dark:text-white flex dark:hidden">  
                                    <IconButton onClick={() => setDark(true)} sx={{ color: 'white' }}>  
                                        <DarkModeRoundedIcon />  
                                    </IconButton>  
                                </div>  
                                <div className="w-full rounded-xl text-slate-700 dark:text-white dark:flex hidden">  
                                    <IconButton onClick={() => setDark(false)} sx={{ color: 'white' }}>  
                                        <WbSunnyRoundedIcon />  
                                    </IconButton>  
                                </div>  
                            </li>  

                            <li className="p-[0.08rem] rounded-xl gr1 dark:gr2dark relative">  
                                <Link to={'/basket'} onClick={scrollTop} className="w-full rounded-xl text-slate-700 dark:text-white flex items-center gap-8">  
                                    <IconButton sx={{ color: 'white' }}>  
                                        <LocalMallRoundedIcon />  
                                    </IconButton>  
                                    {user && user.bascket.length > 0 && (  
                                        <p className="absolute text-white bg-red-500 rounded-full top-1 left-1 w-4 h-4 text-sm text-center -rotate-12">{user.bascket.length.toLocaleString('fa-IR')}</p>  
                                    )}  
                                </Link>  
                            </li>  
                            <li className="p-[0.08rem] rounded-xl gr1 dark:gr2dark">  
                                <Link to={jwt ? (user?.status == "owner" || user?.status == "admin" ? '/cms' : "/account") : "/login"} onClick={scrollTop} className="w-full rounded-xl text-slate-700 dark:text-white flex items-center">  
                                    <IconButton sx={{ color: 'white' }}>  
                                        <PersonRoundedIcon />  
                                    </IconButton>  
                                </Link>  
                            </li>  
                        </div>  

                        {links.map((li, idx) => (  
                            <li key={li._id}>  
                                <div className="w-full text-slate-700 dark:text-white mt-5 mb-4">  
                                    <Link to={li.path} onClick={scrollTop}>  
                                        <div className="w-full rounded-xl bg-sky-300 dark:gr2dark py-3 cursor-pointer">  
                                            {li.txt}  
                                        </div>  
                                    </Link>  
                                </div>  

                                <div className="grid grid-cols-2 gap-2">  
                                    {li.subLinks.length > 0 && li.subLinks.map((l, i) => (  
                                        <Link to={l.path} onClick={scrollTop} key={i + 10}>  
                                            <div className="w-full whitespace-nowrap text-slate-700 dark:text-white rounded-lg py-1.5 bg-sky-200 dark:gr2dark">  
                                                {l.link}  
                                            </div>  
                                        </Link>  
                                    ))}  
                                </div>  
                            </li>  
                        ))}  
                    </ul>  
                </div>  
            </div>  
        </SwipeableDrawer>  
    );  
});  

export default NavLinks;