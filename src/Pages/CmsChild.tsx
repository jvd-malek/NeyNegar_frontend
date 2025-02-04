import CMSForm from '../Components/CMS/CMSForm';
import CMSBox from '../Components/CMS/CMSBox';
import { ticketType } from "../Components/Types/ticket";
import { orderType } from "../Components/Types/order";

function CmsChild({ type, ticketState, ordersState }: { type: string, ticketState: ticketType[], ordersState: orderType[] }) {
    return (
        <>
            {type === 'محصولات' &&
                <>

                    {/* add product section start */}
                    <div className="bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid relative border-white dark:border-slate-800 rounded-xl p-4 lg:col-start-2 col-start-1 col-end-5 lg:row-start-1 row-start-2 ">
                        <h3 className="text-lg font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                            ثبت محصول
                        </h3>
                        <CMSForm />
                    </div>
                    {/* add product section end */}

                    {/* product section start */}
                    <CMSBox type={type} />
                    {/* product section end */}

                </>
            }

            {type === 'مقالات' &&
                <>
                    {/* add product section start */}
                    <div className="bg-sky-100 dark:bg-slate-600 dark:outline-slate-600 transition-all outline-sky-100 outline-[6px] outline border-x-2 border-y-2 border-solid relative border-white dark:border-slate-800 rounded-xl p-4 lg:col-start-2 col-start-1 col-end-5 lg:row-start-1 row-start-2 ">
                        <h3 className="text-lg font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 text-slate-700  dark:text-white bg-white absolute transition-all">
                            ثبت مقاله
                        </h3>
                        <CMSForm article={true} />
                    </div>
                    {/* add product section end */}

                    {/* product section start */}
                    <CMSBox type={type} />
                    {/* product section end */}

                </>
            }
            {type === 'تیکت‌ها' &&
                <>
                    {/* product section start */}
                    <CMSBox type={type} row={2} ticketState={ticketState} />
                    {/* product section end */}

                </>
            }
            {type === 'سفارشات' &&
                <>
                    {/* product section start */}
                    <CMSBox type={type} row={2} ordersState={ordersState} />
                    {/* product section end */}

                </>
            }

            {type === 'کاربران' &&
                <>
                    {/* user section start */}
                    <CMSBox type={type} row={2} />
                    {/* user section end */}

                </>
            }

            {type === 'تخفیف‌ها' && 'discounts'}
        </>
    );
}

export default CmsChild;