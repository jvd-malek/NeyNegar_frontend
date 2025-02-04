import Box from '../Components/Boxes/Box';
import BoxHeader from '../Components/Boxes/BoxHeader';
import DiscountBox from '../Components/Boxes/DiscountBox';
import CaligraphyComponentes from '../Components/Boxes/CaligraphyComponentes';
import ArticleBox from '../Components/Boxes/ArticleBox';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { reduxType } from '../Components/Types/redux';
import { getHome } from '../Redux/home';

function Home() {

    const dispatch = useDispatch<any>()
    const home = useSelector((state: reduxType) => state.home)

    useEffect(() => {
        dispatch(getHome())
    }, [])

    return (
        <>
            {
                home.discountProducts &&

                <div className='pt-28'>
                    <div className="lg:hidden ">
                        <BoxHeader
                            title={'محصولات شگفت‌انگیز'}
                            txt1={'فروشگاه نی‌نگار'}
                            txt2={'با نی‌نگار به‌صرفه خرید کنید.'}
                            color={"bg-sky-400"}
                            link='category/حراجستون'
                            all={true}
                            searchBar={false}
                        />
                    </div>

                    <DiscountBox products={home.discountProducts} />

                    <BoxHeader
                        title={'محصولات خوشنویسی'}
                        txt1={'خلاقیت خود را متمرکز کنید'}
                        txt2={'فروش محصولات خوشنویسی خاص'}
                        color={"gr1"}
                        all={false}
                        searchBar={false}
                    />

                    <CaligraphyComponentes />

                    <BoxHeader
                        title={'تازه‌ترین کتاب‌های خوشنویسی'}
                        color={"gr1"}
                        link="category/کتاب/خوشنویسی"
                        all={true}
                        searchBar={false}
                    />

                    <div className="mt-10">
                        <Box color={"gr11"} books={home.caliBooks} />
                    </div>

                    <BoxHeader
                        title={"گالری"}
                        color={"gr3"}
                        link="category/گالری"
                        all={true}
                        searchBar={false}
                    />

                    <div className="mt-10">
                        <Box color={"gr11"} books={home.gallery} />
                    </div>

                    <BoxHeader
                        title={'طراحی و نقاشی'}
                        color={"gr4"}
                        link="category/کتاب/طراحی و نقاشی"
                        all={true}
                        searchBar={false}
                    />

                    <div className="mt-10">
                        <Box color={"gr44"} books={home.paintBooks} />
                    </div>

                    <BoxHeader
                        title={'هنر‌های سنتی (تذهیب و ...)'}
                        color={"gr2"}
                        link="category/کتاب/هنرهای سنتی"
                        all={true}
                        searchBar={false}
                    />

                    <div className="mt-10">
                        <Box color={"gr22"} books={home.traditionalBooks} />
                    </div>

                    <BoxHeader
                        title={'آخرین مقالات'}
                        color={"gr1"}
                        link="/category/مقالات"
                        all={true}
                        searchBar={false}
                    />

                    <div className="mt-16 mx-auto w-[82vw] flex flex-wrap gap-10 justify-center">
                        {
                            home.articles.map(a => (
                                <ArticleBox key={a._id} {...a} />
                            ))
                        }
                    </div>

                </div>
            }
        </>
    );
}

export default Home;