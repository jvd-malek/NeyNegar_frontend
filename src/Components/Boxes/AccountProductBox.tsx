import { useState } from "react";
import { orderType } from "../Types/order";
import BasketBox from "./BasketBox";
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import { Modal } from '@mui/material';
import { userType } from "../Types/user";

function AccountProductBox({ orders, demo = false, user }: { orders: orderType[], demo?: boolean, user: userType }) {
    const [receipt, setReceipt] = useState(false)
    const [openDetail, setOpenDetail] = useState<boolean>(false)
    const [order, setOrder] = useState<orderType>()
    let a = [...orders]
    let filteredOrders = demo ? [...a.splice(0, 3).reverse()] : [...a.reverse()]
    const receiptHandler = (o: orderType) => {
        setReceipt(!receipt)
        setOrder(o)
    }

    return (
        <>
            {orders.length > 0 ?
                filteredOrders.map(o => (
                    <div key={o._id} className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">
                        <div className="flex justify-between items-center w-full gap-2">
                            <p className="text-lg sm:block flex flex-col justify-center items-center">
                                <span className=" flex gap-2 justify-center items-center">
                                    سفارش
                                    <span className='text-sm sm:text-base'>
                                        {o._id.slice(0, 5)}
                                    </span>
                                </span>
                                <span className='sm:hidden text-sm'>
                                    {o.createdAt}
                                </span>
                            </p>
                            <div className="flex gap-4 items-center sm:flex-row flex-row-reverse ">
                                <div className="flex sm:flex-row flex-col gap-2">
                                    <button className="px-2 py-[1px] text-center rounded-md bg-sky-50 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 dark:bg-slate-400 dark:text-white shadow border-solid"
                                        onClick={() => setOpenDetail(!openDetail)}
                                    >جزییات</button>
                                    <button className="px-2 py-[1px] text-center rounded-md bg-sky-50 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 dark:bg-slate-400 dark:text-white shadow border-solid"
                                        onClick={() => receiptHandler(o)}
                                    >فاکتور</button>
                                </div>
                                <p className="text-base sm:block hidden">
                                    {o.createdAt}
                                </p>
                            </div>
                        </div>
                        <div className={`${!openDetail ? "hidden" : "flex"} flex-col gap-4`}>
                            <div className="flex sm:justify-between justify-start flex-col sm:flex-row gap-4 items-center">
                                <div className="flex flex-col gap-2 sm:gap-4 justify-center mt-10">
                                    <p className="px-2 py-[1px] rounded-md bg-sky-50 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 dark:bg-slate-400 dark:text-white shadow border-solid text-start w-fit">
                                        {`وضعیت: ${o.status}`}
                                    </p>
                                    <p className="px-2 py-[1px] rounded-md bg-sky-50 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 dark:bg-slate-400 dark:text-white shadow border-solid text-start w-fit">
                                        {`ارسال: ${o.submition}`}
                                    </p>
                                </div>
                                <p className="px-2 py-[1px] rounded-md bg-sky-50 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 dark:bg-slate-400 dark:text-white shadow border-solid sm:text-start w-fit text-center">{`کد رهگیری پرداخت: ${o.paymentId}`}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-between">
                                {o.products.map(p => (
                                    <div className=" mt-10" key={p.productId._id}>
                                        <BasketBox {...p.productId} count={p.count} account />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )) :
                <p className="border-sky-100 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500 mt-7 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">هنوز سفارشی ثبت نکرده‌اید.</p>
            }


            <Modal
                open={receipt}
                onClose={() => setReceipt(false)}
            >
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-[Vazir] w-[95vw] h-[80vh] overflow-y-scroll scroll-smooth scrollbar-hidden flex flex-col justify-between" dir="rtl">
                    <div className="">
                        <h1 className="font-bold text-2xl my-3 text-center text-blue-600 dark:text-blue-300">فروشگاه نی‌نگار</h1>
                        <hr className="mb-4" />
                        <div className="flex justify-between mb-4">
                            <div className="text-gray-700 dark:text-white leading-7">
                                <div>{`تاریخ: ${order?.createdAt}`}</div>
                                <div>{`سفارش: ${order?._id.slice(0, 5)}`}</div>
                                <div>{`کد رهگیری پرداخت: ${order?.paymentId}`}</div>
                                {order?.submition != "پیک موتوری" &&
                                    <div>{`کد رهگیری پست: ${order?.postVerify}`}</div>
                                }
                            </div>
                            <div className=" text-slate-800 dark:text-white">
                                <ReceiptRoundedIcon />
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="text-gray-700 dark:text-white mb-4">{user.name}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{`${user.address?.split("%%")[0]}/${user.address?.split("%%")[1]}`}</div>
                            <div className="text-gray-700 dark:text-white mb-2">{user.address?.split("%%")[2]}</div>
                            <div className="text-gray-700 bg-sky-100 border-sky-200 border-solid border-2 rounded-md w-fit px-2 py-1">{order?.submition}</div>
                        </div>
                        <table className="w-full mb-8 px-8">
                            <thead>
                                <tr>
                                    <th className="text-right font-bold text-gray-700 dark:text-white">محصول</th>
                                    <th className="text-left font-bold text-gray-700 dark:text-white">قیمت</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.products.map(p => (
                                    <tr>
                                        <td className="text-right text-gray-700 dark:text-white">{`${p.productId.title}(${p.count.toLocaleString('fa-IR')})`}</td>
                                        <td className="text-left text-gray-700 dark:text-white">{p.price ? p.price.toLocaleString('fa-IR') : p.productId.price[p.productId.price.length - 1].price.toLocaleString('fa-IR')}
                                            <span className=" text-xs font-mono"> تومان</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="text-right font-bold text-gray-700 dark:text-white">تخفیف</td>
                                    <td className="text-left font-bold text-gray-700 dark:text-white">{order?.discount.toLocaleString('fa-IR')}
                                        <span className=" text-xs font-mono"> تومان</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold text-gray-700 dark:text-white">جمع کل</td>
                                    <td className="text-left font-bold text-gray-700 dark:text-white">{`${order?.totalPrice && ((order.totalPrice / 10).toLocaleString('fa-IR'))} `}
                                        <span className="text-xs font-mono">تومان</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="text-gray-700 dark:text-white">از سفارش شما سپاس‌گذاریم. ❤️</div>
                </div>
            </Modal>
        </>
    );
}

export default AccountProductBox;