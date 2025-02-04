import { createContext, useEffect, useState } from "react";

const darkMode = createContext()
const Provider = ({ children }) => {
    
    const [isDark, setDark] = useState(false)

    useEffect(() => {
        if (localStorage) {
            setDark(JSON.parse(localStorage.getItem('dark')))
        }
    }, [])


    return (
        <darkMode.Provider value={[isDark, setDark]}>
            {children}
        </darkMode.Provider>
    )
}

export { darkMode };
export default Provider;