import { Link } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

type ProductBoxType = {
    box?: boolean,
    suggest?: boolean,
    title: string,
    desc: string,
    price: { price: number, date: string }[],
    discount: { discount: number, date: string }[],
    _id: string,
    popularity: number,
    cover: string,
    showCount: number
}

function ProductBox({ box = true, suggest = false, title, desc, price, discount, _id, popularity, cover, showCount }: ProductBoxType) {
    return (
        <>
            <div
                className={`flex flex-col overflow-hidden rounded-2xl dark:text-white ${box ? 'bg-glass border border-solid border-sky-200 dark:border-gray-600 dark:gr1dark shadow-md' : "gr1 dark:gr2dark shadow-css relative overflow-hidden"} ${box && !suggest && " lg:my-8 my-10"} ${suggest && 'gr1'}`}>
                <Link to={`/product/${_id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    {cover ?
                        <img src={`https://api.neynegar1.ir/imgs/${cover}`} alt="" className={`border-b-2 rounded-2xl border-solid border-slate-800 object-cover`} loading="lazy" /> :
                        <Skeleton variant="rectangular" className=' rounded-lg' height={150} />
                    }
                </Link>

                {
                    discount[discount.length - 1].discount > 0 && showCount > 0 &&
                    <div className="absolute -top-[6px] right-1 text-red-600">
                        <BookmarkIcon sx={{ fontSize: 40 }} />
                        <p className="absolute text-xs text-white right-[10px] top-3">{`%${discount[discount.length - 1].discount.toLocaleString('fa-IR')}`}</p>
                    </div>
                }

                <div className={`px-4 pt-2.5 pb-4 flex-grow border-b ${box && !suggest ? 'border-sky-300' : "border-b-gray-100"}  dark:border-b-gray-700`}>
                    <p className={`text-sm h-10 line-clamp-2 dark:text-white ${box ? "text-slate-600 dark:text-slate-400" : "text-slate-800"}`}>
                        {
                            `${title}،`
                        }
                        <span>
                            {
                                ` ${desc}`
                            }
                        </span>
                    </p>
                </div>

                <div className="flex items-end justify-between mt-1.5 px-2 pb-2 ">
                    <span className="flex items-center gap-x-1.5 text-zinc-700 dark:text-white">
                        <div className=" text-yellow-400 mb-[3px]">
                            <StarRoundedIcon />
                        </div>
                        {
                            `${popularity.toLocaleString('fa-IR')}`
                        }
                    </span>
                    {showCount > 0 ?
                        <div className="flex flex-col items-start">
                            <span className={`${discount[discount.length - 1].discount > 0 ? 'text-xs text-slate-600 dark:text-slate-300 line-through' : 'text-lg  space-x-1.5 dark:text-white'} `}>
                                {
                                    price[price.length - 1].price.toLocaleString('fa-IR')
                                }
                            </span>
                            {
                                discount[discount.length - 1].discount > 0 &&
                                <span className="text-md leading-3 dark:text-white">
                                    {(price[price.length - 1].price * ((100 - discount[discount.length - 1].discount) / 100)).toLocaleString('fa-IR')}
                                </span>
                            }
                        </div> :
                        <p className="text-red-700 bg-red-200 px-2 py-1 rounded-md text-base">ناموجود</p>
                    }
                </div>

            </div>
        </>
    );
}

export default ProductBox;