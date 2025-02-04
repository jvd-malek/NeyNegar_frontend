import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

type BasketBoxType = {
    _id: string
    cover: string
    title: string
    account?: boolean
    count: number
    showCount: number
    price: { price: number; date: string; }[]
    discount: { discount: number, date: string }[]
    refresh?: boolean
    setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
}

type bas = {
    productId: string,
    count: number
}

function BasketBox({ _id, account = false, showCount, cover, title, count, price, discount, refresh, setRefresh }: BasketBoxType) {
    const [Count, setCount] = useState(count)
    const [load, setLoad] = useState(false)
    const [Price, setPrice] = useState(0)
    const jwt = localStorage.getItem("jwt")
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [alert]);

    useEffect(() => {
        if (discount[discount.length - 1].discount > 0) {
            let p = (price[price.length - 1].price * ((100 - discount[discount.length - 1].discount) / 100))
            setPrice(p)
        } else {
            let p = price[price.length - 1].price
            setPrice(p)
        }
    }, [])

    const addLocalBascket = async (bas: bas) => {
        let bascket = localStorage.getItem("bascket")
        if (bascket) {
            let newBas
            let validBascket: bas[] = JSON.parse(bascket)

            let filBas = validBascket.filter((b: bas) => (
                b.productId == bas.productId
            ))

            if (filBas.length > 0) {
                filBas[0].count = filBas[0].count + 1
                let notFilBas = validBascket.filter((b: bas) => (
                    b.productId != filBas[0].productId
                ))

                newBas = [...notFilBas, filBas[0]]
            } else {
                newBas = [...validBascket, bas]
            }

            localStorage.setItem("bascket", JSON.stringify(newBas))
        } else {
            localStorage.setItem("bascket", JSON.stringify([bas]))
        }
    }

    const removeLocalBascket = async (bas: bas) => {
        let bascket = localStorage.getItem("bascket")
        if (bascket) {
            let newBas
            let validBascket: bas[] = JSON.parse(bascket)

            let filBas = validBascket.filter((b: bas) => (
                b.productId == bas.productId
            ))

            if (filBas.length > 0) {
                filBas[0].count = filBas[0].count - 1
                let notFilBas = validBascket.filter((b: bas) => (
                    b.productId != filBas[0].productId
                ))
                if (filBas[0].count == 0) {
                    newBas = [...notFilBas]
                } else {
                    newBas = [...notFilBas, filBas[0]]
                }
            } else {
                newBas = [...validBascket, bas]
            }

            localStorage.setItem("bascket", JSON.stringify(newBas))
        }
    }

    const pushHandler = async () => {
        if (showCount > Count) {
            if (jwt) {
                await fetch(`https://api.neynegar1.ir/users/add-bascket`, {
                    method: "PUT",
                    headers: {
                        'authorization': jwt,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bas: [{
                            productId: _id,
                            count: 1
                        }]
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.state) {
                            console.log(data.msg)
                        } else {
                        }
                    })
                setCount(Count + 1)
                setRefresh && setRefresh(!refresh)
            }
            else {
                addLocalBascket({ productId: _id, count: 1 })
                setRefresh && setRefresh(!refresh)
            }
        } else {
            setAlert(true)
        }
    }

    const pullHandler = async () => {
        if (jwt) {
            await fetch(`https://api.neynegar1.ir/users/pop-bascket`, {
                method: "PUT",
                headers: {
                    'authorization': jwt,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bas: [{
                        productId: _id,
                        count: 1
                    }]
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.state) {
                        console.log(data.msg)
                    } else {
                    }
                })
            setCount(Count - 1)
            setRefresh && setRefresh(!refresh)
        }
        else {
            removeLocalBascket({ productId: _id, count: 1 })
            setRefresh && setRefresh(!refresh)
        }
    }

    return (
        <>
            <div
                className={`flex bg-white w-fit sm:pl-4 flex-col sm:flex-row items-center gap-6 shadow-none dark:text-white dark:gr1dark gr1 rounded-2xl relative overflow-hidden`}>

                <Link to={`/product/${_id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    {
                        !load &&
                        <Skeleton variant="rectangular" className=' rounded-lg' height={150} />
                    }
                    <img className={`md:w-40 sm:w-60 rounded-xl border-solid border-slate-800`} src={`https://api.neynegar1.ir/imgs/${cover}`} alt="" loading="lazy" onLoad={() => setLoad(true)} />
                </Link>

                {
                    discount[discount.length - 1].discount > 0 &&
                    <p className=" absolute w-40 md:text-xs text-sm  py-1 bg-red-600 text-center text-white rotate-45 md:-right-16 md:top-1 -right-14 top-2">{`%${discount[discount.length - 1].discount.toLocaleString('fa-IR')}`}</p>
                }

                <div className="flex sm:gap-10 gap-2 py-2 md:flex-row flex-col w-fit sm:items-start md:items-center items-center justify-center text-sm md:text-base">
                    <div className="flex gap-2 flex-col sm:items-start items-center h-full">
                        <h3 className="">{title}</h3>
                        <h3 className="flex gap-2  items-center">قیمت واحد: <span>
                            {
                                Price.toLocaleString('fa-IR')
                            }
                        </span></h3>
                        <h3 className="flex gap-2  items-center">قیمت کل: <span>
                            {
                                (Price * Count).toLocaleString('fa-IR')
                            }
                        </span></h3>
                        <div className={`items-center gap-3 ${account ? 'flex' : 'hidden'}`}>
                            <p className="">
                                تعداد:
                            </p>
                            <div className="px-2 py-[1px] text-center rounded-md bg-sky-100 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 shadow border-solid text-lg">
                                {Count}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center flex-col">
                        {!account &&
                            <div className="w-fit h-fit rounded-full bg-sky-100 border-2 text-sky-700 transition-all dark:border-slate-300 border-sky-200 shadow border-solid flex items-center gap-2 text-lg sm:mb-0 mb-2">
                                <IconButton onClick={() => pushHandler()} color="primary">
                                    <AddCircleRoundedIcon />
                                </IconButton>
                                {Count}
                                <IconButton onClick={() => pullHandler()} sx={{ color: 'red' }}>
                                    <CancelRoundedIcon />
                                </IconButton>
                            </div>
                        }
                        <p className={`text-xs text-red-700 mt-1 ${alert ? "block sm:whitespace-pre-line" : "hidden"}`}>
                            {`موجودی محصول
                             محدود است.`}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BasketBox;