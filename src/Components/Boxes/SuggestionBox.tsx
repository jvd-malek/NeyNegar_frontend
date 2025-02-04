import ProductBox from "./ProductBox";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSugProducts } from "../../Redux/Category";
import { reduxType } from "../Types/redux";

type SuggestionBoxType = {
    bascket: boolean,
    article?: boolean,
    ban: boolean,
    cat: string,
    catB?: string,
    id: string,
}
function SuggestionBox({ bascket = false, cat, catB, id, ban, article = false }: SuggestionBoxType) {
    const state = useSelector((state: reduxType) => state.category)
    const dispatch = useDispatch<any>()
    const jwt = localStorage.getItem("jwt")

    const products = [...state].filter(p => (
        p._id != id
    )).slice(0, 10)
    
    useEffect(() => {
        if (article) {
            dispatch(getSugProducts(`${cat}/${id}`))
        } else {
            dispatch(getSugProducts(`${cat}/${catB}`))
        }
    }, [cat , catB , id])

    const relod = () => {
        window.location.reload()
    }

    return (
        <div className={`col-start-1 ${jwt && !ban && "lg:col-end-4"} lg:row-start-3 col-end-8 row-start-4 w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-10 pb-4 px-4 dark:gr2dark dark:outline-slate-600 dark:text-white ${products.length < 0 && "h-fit"}`}>
            <h3 className="text-slate-700 text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 dark:text-white bg-white absolute transition-all">
                محصولات مشابه
            </h3>
            {products.length > 0 ?
                <div className={`w-[90%] lg:mt-12 sm:mt-8 mt-12 mx-auto`}>

                    <div className={`${jwt && !ban && "lg:block"} sm:hidden`}>
                        <Swiper
                            grabCursor={true}
                            effect={'creative'}
                            creativeEffect={{
                                prev: {
                                    shadow: false,
                                    translate: [0, 0, -400],
                                },
                                next: {
                                    shadow: false,
                                    translate: ['100%', 0, 0],
                                },
                            }}
                            autoplay={{
                                delay: 2800,
                                disableOnInteraction: false,
                            }}
                            modules={[EffectCreative, Autoplay]}
                            className={`${bascket ? 'lg:w-[15vw]' : 'lg:w-[20vw]'} w-[70vw] rounded-2xl`}
                        >
                            {state.length > 0 && products.length > 0 ?
                                products.map(p => (
                                    <SwiperSlide onClick={() => relod()} key={p._id}>
                                        <ProductBox suggest={true} {...p} />
                                    </SwiperSlide>
                                )) :
                                state.map(p => (
                                    <SwiperSlide onClick={() => relod()} key={p._id}>
                                        <ProductBox suggest={true} {...p} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>

                    {
                        bascket &&
                        <div className="lg:block hidden mt-10">
                            <Swiper
                                grabCursor={true}
                                effect={'creative'}
                                creativeEffect={{
                                    prev: {
                                        shadow: false,
                                        translate: [0, 0, -400],
                                    },
                                    next: {
                                        shadow: false,
                                        translate: ['100%', 0, 0],
                                    },
                                }}
                                autoplay={{
                                    delay: 2800,
                                    disableOnInteraction: false,
                                }}
                                modules={[EffectCreative, Autoplay]}
                                className={`lg:w-[15vw] w-[70vw] rounded-2xl`}
                            >
                                {state.length > 0 && products.length > 0 ?
                                    products.map(p => (
                                        <SwiperSlide onClick={() => relod()} key={p._id}>
                                            <ProductBox suggest={true} {...p} />
                                        </SwiperSlide>
                                    )) :
                                    state.map(p => (
                                        <SwiperSlide onClick={() => relod()} key={p._id}>
                                            <ProductBox suggest={true} {...p} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                    }

                    <div className={`justify-center flex-wrap gap-4 ${jwt && !ban && "lg:hidden"} sm:flex hidden`}>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={60}
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 50,
                                },
                            }}
                            modules={[Pagination, Autoplay]}
                            style={{ padding: '0 0px 20px 0px' }}
                            className="w-[75vw]"
                        >
                            {state.length > 0 && products.length > 0 ?
                                products.map(p => (
                                    <SwiperSlide onClick={() => relod()} key={p._id}>
                                        <ProductBox {...p} />
                                    </SwiperSlide>
                                )) :
                                state.map(p => (
                                    <SwiperSlide onClick={() => relod()} key={p._id}>
                                        <ProductBox {...p} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div> :
                <p className="mt-14 text-center mb-2">محصول مشابه محصول مورد نظر یافت نشد.</p>
            }
        </div>
    );
}

export default SuggestionBox;