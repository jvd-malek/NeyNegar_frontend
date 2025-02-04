import { useState, useEffect } from 'react';
import Navbar from "./HeaderComponents/Navbar";
import NavLinks from "./HeaderComponents/NavLinks";
import SideMenu from './HeaderComponents/SideMenu';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxType } from "../Types/redux";
import { userType } from '../Types/user';

function Header(): JSX.Element {
    const { links } = useSelector((state: reduxType) => state.pagination);
    const [offset, setOffset] = useState<number>(0);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState<boolean>(false);
    const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
    const [innerWidth, setInnerWidth] = useState<number>(window.outerWidth);
    const [user, setUser] = useState<userType>();

    const loc = useLocation();

    // Managing dark mode  
    const [isDark, setDark] = useState<boolean>(
        localStorage.getItem('dark') === "true"
    );

    // If user scrolled, this useEffect manages which navbar must show and also manages the state of navbarlinks  
    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsHeaderScrolled(offset > 0);
    }, [offset]);

    // When navbarLinks is open and user changes their device orientation, the orientationHandler will close the navbarLinks  
    const orientationHandler = () => {
        setOpen(false);
        setSearchOpen(false);
        setInnerWidth(window.outerWidth);
    };

    useEffect(() => {
        const handleOrientationChange = () => {
            orientationHandler();
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    useEffect(() => {
        updateDarkMode();
    }, [isDark]);

    const updateDarkMode = () => {
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem("dark", "true");
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem("dark", "false");
        }
    };

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        const bas = localStorage.getItem("bascket");

        const fetchUserData = async () => {
            try {
                if (jwt) {
                    const response = await fetch(`https://api.neynegar1.ir/users/verify`, {
                        headers: {
                            'authorization': jwt
                        }
                    });
                    const data = await response.json();
                    if (data.state) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem("jwt");
                    }
                    if (bas) {
                        await fetch(`https://api.neynegar1.ir/users/add-bascket`, {
                            method: "PUT",
                            headers: {
                                'authorization': jwt,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                bas: JSON.parse(bas)
                            })
                        });
                        localStorage.removeItem("bascket");
                    }
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className={(loc.pathname.includes('login')) ? "hidden" : ""}>
            <Navbar
                isOpen={isOpen}
                isHeaderScrolled={isHeaderScrolled}
                setOpen={setOpen}
                isDark={isDark}
                links={links}
                user={user}
            />

            <NavLinks
                isOpen={isOpen}
                setOpen={setOpen}
                setDark={setDark}
                innerWidth={innerWidth}
                links={links}
                user={user}
            />

            <SideMenu
                setDark={setDark}
                isSearchOpen={isSearchOpen}
                setSearchOpen={setSearchOpen}
            />
        </div>
    );
}

export default Header;