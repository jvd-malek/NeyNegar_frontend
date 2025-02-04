import { Link, useLocation } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';

function Footer() {

    const loc = useLocation()

    return (
        <div
            className={(loc.pathname.includes('login')) ? "hidden" : ""}>
            <div
                className="flex md:flex-row flex-col text-gray-600 dark:text-white dark:gr2dark dark:outline-slate-600 gap-8 justify-around font-[vazir] sm:w-[85vw] w-[98vw] mx-auto rounded-3xl p-8 bg-sky-200  mt-40 mb-20 outline-sky-200 outline-[6px] outline border-x-2 border-t-2 border-solid border-white dark:border-slate-800 transition-all before:-z-10 before:bg-sky-500 before:dark:opacity-0 before:dark:bottom-0 before:absolute relative before:left-1/2 before:-translate-x-1/2 before:w-[50%] before:h-40  before:-bottom-5 before:rounded-3xl before:transition-all before:duration-300"
            >
                <div className="flex flex-col">
                    <h3 className="border-b border-solid border-sky-300 dark:border-white">ارتباط با ما</h3>
                    <div className="mt-8 flex flex-col items-end gap-2">
                        <h3 className="flex justify-center items-center" dir='ltr'>
                            social media:
                            <a href="https://www.instagram.com/neynegar1.ir" className='ml-2 bg-blue-300/60 px-1 py-[2px] rounded-md flex gap-1'>
                                <InstagramIcon />
                            </a>
                            <a href="https://t.me/neynegar1_ir" className='ml-2 bg-blue-300/60 px-1 py-[2px] rounded-md flex gap-1'>
                                <TelegramIcon />
                            </a>
                        </h3>
                        <h3 className="flex" dir='ltr'>
                            phone:
                            <a href="tel:09934242315" className='ml-2 bg-blue-300/60 px-1 rounded-md  flex gap-1'>
                                +98 9934242315
                                <PhoneAndroidIcon />
                            </a>
                        </h3>
                        <h3 className="flex" dir='ltr'>
                            tel:
                            <a href="tel:02133334434" className='ml-2 bg-blue-300/60 px-1 rounded-md  flex gap-1'>
                                021 33334434
                                <PhoneEnabledRoundedIcon />
                            </a>
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="border-b border-solid border-sky-300 dark:border-white">مجوزات</h3>

                    <div className="flex gap-8 mt-6 justify-center dark:bg-sky-200 transition-all p-1 border-2 border-solid dark:border-slate-600 border-sky-200 dark:outline-4 dark:outline dark:outline-sky-200 rounded-xl">
                        <Link referrerPolicy='origin' target='_blank' to='https://trustseal.enamad.ir/?id=314492&Code=I42DaEtOgCfNS3N0UAJm' className='w-32'>
                            <img referrerPolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=314492&Code=I42DaEtOgCfNS3N0UAJm' className='w-full rounded-md' />
                        </Link>
                    </div>

                </div>
            </div>

            <div className="bg-sky-200 w-[85vw] mx-auto rounded-t-3xl dark:text-white dark:gr2dark">
                <p className="p-3  text-center font-[vazir]">
                    {'کلیه حقوق برای '}
                    <Link to={'/'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className='text-blue-700 dark:text-neutral-300'>
                        فروشگاه مجازی نی‌نگار
                    </Link>
                    {' محفوظ است'}
                </p>
            </div>
        </div>
    );
}

export default Footer;