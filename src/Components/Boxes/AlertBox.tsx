import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import ClearAltRoundedIcon from '@mui/icons-material/ClearRounded';
import { useEffect } from 'react';

type AlertBoxType = {
    txt: string,
    open: boolean,
    status: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    time: number
}

function AlertBox({ txt, open, setOpen, status, time }: AlertBoxType) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, time);
        return () => clearTimeout(timer);
    }, [open]);

    return (
        <p
            className={`sm:w-fit w-[98%] flex gap-4 text-lg ${status === "yes" && "text-green-700 bg-lime-200 "} ${status === "no" && "text-red-700 bg-rose-200 "} fixed py-1 px-4 z-50 rounded-md items-center transition-all ease-in-out -translate-x-1/2 sm:-translate-x-0 ${open ? " sm:left-5 sm:bottom-4 bottom-24 opacity-100 left-1/2" : "-bottom-10 sm:bottom-4 sm:-left-60 opacity-0 left-1/2"}`}
            onClick={() => setOpen(false)}
        >
            {status === "yes" &&
                <TaskAltRoundedIcon />
            }
            {status === "no" &&
                <ClearAltRoundedIcon />
            }
            {txt}
        </p >
    );
}

export default AlertBox;