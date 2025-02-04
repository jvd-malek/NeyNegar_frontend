import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { repliesType } from '../Types/replies';

function ReplyBox({ txt, userId, createdAt }: repliesType) {
    let status = ""
    
    switch (userId.status) {
        case "user":
            status = "کاربر"
            break;
        case "notifUser":
            status = "کاربر"
            break;
        case "owner":
            status = "مدیر"
            break;
        case "admin":
            status = "ادمین"
            break;

        default:
            break;
    }

    return (
        <>
            <div className="w-full bg-sky-100 dark:bg-slate-600 p-4 rounded-xl text-slate-700 dark:text-white">
                <div className="flex items-center gap-2 pb-4 border-b border-solid border-slate-400">
                    <img src={`https://api.neynegar1.ir/imgs/${userId.img}`} alt="" className={`${userId.img ? 'block' : 'hidden'} object-cover w-16 h-16 rounded-full`} />
                    <div className={`${userId.img ? 'hidden' : 'block'} text-slate-500 dark:text-white transition-all`}>
                        <AccountCircleTwoToneIcon sx={{ fontSize: '4rem' }} />
                    </div>
                    <div className="">
                        <p className="">{userId.name} <span className=' font-bold'>| {status}</span></p>
                        <p className="text-sm text-slate-500 dark:text-white transition-all">{createdAt}</p>
                    </div>
                </div>
                <p className="mt-6">
                    {txt}
                </p>
            </div>
        </>
    );
}

export default ReplyBox;