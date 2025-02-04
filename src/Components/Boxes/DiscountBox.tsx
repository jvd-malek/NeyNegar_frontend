import ProductBox from './ProductBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';
import { productCoverType } from '../Types/product';

type DiscountBox = {
    products: productCoverType
}

function DiscountBox({ products }: DiscountBox) {
    
    return (
        <>
            <div className="bg-vije relative min-h-60">
                <Link to={"/category/حراجستون"} className="hidden font-[vazir] lg:flex absolute items-center w-fit gap-x-1 rounded-tl-2xl pr-2.5 pl-2 py-2 bg-white dark:bg-slate-800 dark:text-white text-sky-800 transition-colors bottom-0 right-0"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    مشاهده همه
                </Link>
                <div className=" xl:mr-48 xl:ml-8 lg:mr-40 lg:ml-10 mx-10">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
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
                                spaceBetween: 20,
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
                        modules={[Pagination, Autoplay, Navigation]}
                        className="mySwiper"
                    >
                        {products.map(i => (
                            <SwiperSlide key={i._id}>
                                <ProductBox {...i} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

        </>
    );
}

export default DiscountBox;