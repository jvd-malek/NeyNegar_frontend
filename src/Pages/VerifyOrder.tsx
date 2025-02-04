import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOrder() {
    const params = useLocation().search.split("?")[1].split("&")
    const authority = params[0].split("=")[1]
    const jwt = localStorage.getItem("jwt")
    const [State, setState] = useState<any>(false)
    let navigate = useNavigate()
    
    const verifyHandler = async () => {
        if (jwt) {
            await fetch(`https://api.neynegar1.ir/checkout/verify/${authority}`, {
                method: "GET",
                headers: {
                    'authorization': jwt,
                    "Content-Type": "application/json"
                },
            })
                .then(res => res.json())
                .then(data => setState(data))
        }
    }

    const createOrder = async () => {
        if (jwt) {
            await fetch("https://api.neynegar1.ir/orders/update", {
                method: "PUT",
                headers: {
                    'authorization': jwt,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ paymentId: State.data.ref_id, authority })
            })
                .then(res => res.json())
                .then(data => {
                    setTimeout(() => {
                        if (data.state) {
                            navigate(`/account/${authority}`)
                        } else {
                            navigate(`/basket`)
                        }
                    }, 4000);
                })
        }
    }

    useEffect(() => {
        verifyHandler()
    }, [])

    useEffect(() => {
        if (State) {
            if (State.data.code && (State.data.code == 100 || State.data.code == 101)) {
                createOrder()
            } else {
                setTimeout(() => {
                    navigate(`/basket`)
                }, 4000);
            }
        }
    }, [State])

    return (
        <div className="flex flex-col justify-center items-center pt-28 overflow-hidden relative">
            <h1 className=" text-lg font-bold mt-4">
                {State && State.data.code && (State.data.code == 100 || State.data.code == 101) ?
                    "تراکنش موفق، سفارش شما ثبت شد." :
                    "تراکنش ناموفق"
                }
            </h1>
            <p className="">
                {State && State.data.code && (State.data.code == 100 || State.data.code == 101) ?
                    "درحال انتقال به حساب کاربری شما." :
                    "درحال انتقال به سبد خرید شما."
                }
            </p>
        </div>
    );
}

export default VerifyOrder;