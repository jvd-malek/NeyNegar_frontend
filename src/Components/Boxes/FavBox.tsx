import ProductBox from "./ProductBox";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { productSingleType } from "../Types/product";

type FavBoxType = {
    fav: { productId: productSingleType }[]
    account?: boolean
}
function FavBox({ fav, account }: FavBoxType) {
    const jwt = localStorage.getItem("jwt")

    const relod = () => {
        window.location.reload()
    }

    return (
        <>
            <h3 className={`${account && "hidden"} text-slate-700 text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 dark:text-white bg-white absolute transition-all`}>
                محصولات مورد علاقه
            </h3>

            <div className={`w-[90%] ${account ? "mt-8": "mt-16"} mx-auto`}>

                <div className={`${jwt && !account && "lg:block"} sm:hidden`}>
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
                        {fav.length > 0 &&
                            fav.map(p => (
                                <SwiperSlide onClick={() => relod()} key={p.productId._id}>
                                    <ProductBox suggest={true} {...p.productId} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>

                <div className={`justify-center flex-wrap gap-4 ${jwt && !account && "lg:hidden"} sm:flex hidden`}>
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
                        style={{ padding: '0 0px 60px 0px' }}
                        className={` ${account ? "w-[60vw]" : "w-[75vw]"}`}
                    >
                        {fav.length > 0 &&
                            fav.map(p => (
                                <SwiperSlide onClick={() => relod()} key={p.productId._id}>
                                    <ProductBox suggest={true} {...p.productId} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </>
    );
}

export default FavBox;