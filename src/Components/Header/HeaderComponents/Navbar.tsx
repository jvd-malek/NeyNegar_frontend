import { memo } from "react";  
import { Sling as Hamburger } from "hamburger-react";  
import { Link } from "react-router-dom";  
import IconButton from '@mui/material/IconButton';  
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';  
import LocalMallOutlined from '@mui/icons-material/LocalMallOutlined';  
import { linksType } from "../../Types/links";
import { userType } from "../../Types/user";

type NavbarProps = {  
    isDark: boolean;  
    isOpen: boolean;  
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;  
    isHeaderScrolled: boolean;  
    links: linksType[];  
    user: userType | undefined;  
}  

const Navbar = memo(({ isDark, isOpen, setOpen, isHeaderScrolled, links, user }: NavbarProps): JSX.Element => {  
    const dark = isDark ? 'white' : 'primary';  

    const scrollTop = () => {  
        window.scrollTo({ top: 0, behavior: "smooth" });  
    };  

    return (  
        <>  
            <div className={isHeaderScrolled ? "scrolledNavbarFixed" : "navbarFixed"}>  
                <div className="flex justify-between items-center">  
                    <div className="lg:hidden">  
                        <IconButton color="primary" sx={{ color: dark }}>  
                            <Hamburger toggled={isOpen} size={30} toggle={setOpen} />  
                        </IconButton>  
                    </div>  
                    <div className="headerStyle gap-20">  
                        <div className=" text-4xl font-[Soofee] ml-10 relative color" onClick={scrollTop}>  
                            <Link to={'/'}>  
                                <span className="">نی‌</span>  
                                <span className="absolute -left-12">نگار</span>  
                            </Link>  
                        </div>  
                        <ul className="lg:headerStyle hidden">  
                            {links.map(item => (  
                                <li key={item._id} onClick={scrollTop} className="cursor-pointer font-[vazir] [&>div]:hover:block relative">  
                                    <Link to={item.path}>{item.txt}</Link>  
                                    {item.subLinks.length > 0 && (  
                                        <div className={`hidden absolute z-50`}>  
                                            <div className={`bg-white dark:bg-slate-600 p-2  rounded-xl flex shadow-cs gap-4 ${isHeaderScrolled ? 'mt-8' : 'mt-3'}`}>  
                                                {item.subLinks.map((l, i) => (  
                                                    <Link to={l.path} key={i} className="whitespace-nowrap text-sky-800 dark:text-white">  
                                                        {l.link}  
                                                    </Link>  
                                                ))}  
                                            </div>  
                                        </div>  
                                    )}  
                                </li>  
                            ))}  
                        </ul>  
                    </div>  

                    <div className="relative h-full text-lg xl:text-lg text-white dark:text-sky-900 lg:w-[155px] xl:w-[180px]">  
                        <div onClick={scrollTop}>  
                            {user && user.name.length > 0 ? (  
                                <Link to={user?.status == "owner" || user?.status == "admin" ? '/cms' : "account"} className="h-full hidden py-1 px-4 lg:flex justify-center items-center bg-sky-500/60 hover:bg-sky-400 dark:bg-sky-200 dark:hover:bg-[#3F6CD8] dark:hover:text-white rounded-full transition-colors line-clamp-1 text-lg whitespace-nowrap">  
                                    {user?.name.trim().split(" ").slice(0, 3).join(" ")}  
                                </Link>  
                            ) : (  
                                <Link to={'/login'} className="h-full w-fit gap-4  xl:w-28 hidden lg:flex items-center justify-center py-1 bg-sky-500/60 hover:bg-sky-400 dark:bg-sky-200 dark:hover:bg-[#3F6CD8] dark:hover:text-white rounded-full px-5 transition-colors">  
                                    ورود  
                                    <AccountCircleTwoToneIcon />  
                                </Link>  
                            )}  
                            <Link to={'/basket'} className="lg:hidden relative">  
                                <IconButton color="primary" sx={{ color: dark }}>  
                                    <LocalMallOutlined fontSize="large" />  
                                </IconButton>  
                                {user && user.bascket.length > 0 && (  
                                    <p className="absolute text-white bg-red-500 rounded-full top-0 left-1 w-4 h-4 text-sm text-center -rotate-12">  
                                        {user.bascket.length.toLocaleString('fa-IR')}  
                                    </p>  
                                )}  
                            </Link>  
                        </div>  
                    </div>  
                </div>  
            </div>  
        </>  
    );  
});  

export default Navbar;