import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules';
import ProductBox from './ProductBox';
import { productCoverType } from '../Types/product';

type BoxType = {
    color: string
    books: productCoverType
}
function Box({ color, books = [] }: BoxType) {

    return (
        <>
            <div className={`mt-6 rounded-2xl mx-auto w-[82vw] dark:bg-slate-500 ${color} dark:gr2dark transition-all min-h-40`}>
                <div className="rounded-3xl">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={50}
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
                        modules={[Pagination, Autoplay]}
                        style={{ padding: '0 30px 20px 30px' }}
                    >
                        {books.map(i => (
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

export default Box;