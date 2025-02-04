import { Pagination, PaginationItem, Stack } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from "react-redux";
import { page } from "../../Redux/Pagination"
import { reduxType } from "../Types/redux";
import { useEffect } from "react";

type PaginationBoxType = {
    basket?: boolean,
    count: number
}

function PaginationBox({ basket = false, count }: PaginationBoxType) {

    const dispatch = useDispatch()
    const state = useSelector((state: reduxType) => state.pagination)

    useEffect(() => {
        window.scrollTo({ top: 200, behavior: "smooth" })
    },[state.page])
    
    return (
        <div className={`p-1 outline-[4px] outline border-2 border-solid transition-all ${basket ? 'border-sky-100 mt-4 bg-sky-50 outline-sky-50 shadow-css dark:border-slate-600 dark:bg-slate-400 dark:outline-slate-400' : 'mt-20 border-white bg-sky-200 outline-sky-200 dark:border-slate-800'} rounded-full w-fit mx-auto`}>
            <Stack spacing={2}>
                <Pagination count={count} variant="outlined" color="primary"
                    page={state.page} onChange={(e, v) => { dispatch(page({ num: v })); }}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{ previous: ArrowForwardIcon, next: ArrowBackIcon }}
                            {...item}
                        />
                    )}
                />
            </Stack>
        </div>
    );
}

export default PaginationBox;