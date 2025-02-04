import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { useState } from 'react';
import { IconButton, Modal, Rating } from '@mui/material';
import ReplyBox from './ReplyBox';
import { repliesType } from "../Types/replies"
import { commentType } from "../Types/comment"

type CommentBoxType = {
    account?: boolean
    ticket?: boolean
    commentScrollHandler?: () => void
    setReplyId?: React.Dispatch<React.SetStateAction<string>>
}

function CommentBox({ account = false, ticket = false, txt, replies, response, status, star, commentScrollHandler, createdAt, userId, setReplyId, _id, productId, articleId }: commentType & CommentBoxType) {
    // const [replyModal, setReplyModal] = useState(false)
    const reply: repliesType[] = replies ? replies : []

    const replyHandler = () => {
        if (!account && commentScrollHandler && setReplyId) {
            setReplyId(_id)
            commentScrollHandler()
        }
    }

    let Status = ""

    switch (userId.status) {
        case "user":
            Status = "کاربر"
            break;
        case "notifUser":
            Status = "کاربر"
            break;
        case "owner":
            Status = "مدیر"
            break;
        case "admin":
            Status = "ادمین"
            break;

        default:

            break;
    }

    return (
        <>
            <div className={`border-sky-100 ${account || ticket ? 'mt-10' : 'mt-16'} mb-6 bg-white outline-white shadow-cs py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl flex flex-wrap justify-between items-center gap-6 dark:border-slate-600 dark:bg-slate-500 dark:outline-slate-500`}>
                <div className={`flex justify-between items-center w-full pb-4 border-b border-solid dark:border-slate-400 `}>
                    <div className="flex items-center gap-2">

                        <img src={`https://api.neynegar1.ir/imgs/${userId.img}`} alt="" className={`${userId.img ? 'block' : 'hidden'} object-cover ${account ? 'rounded-md w-20 h-20' : 'w-16 h-16 rounded-full'}`} />
                        {
                            !account &&
                            <div className={`${userId.img ? 'hidden' : 'block'} text-slate-500 dark:text-white transition-all`}>
                                <AccountCircleTwoToneIcon sx={{ fontSize: '4rem' }} />
                            </div>
                        }
                        <div className="">
                            {
                                !account ?
                                    <>
                                        <p className={`${ticket ? 'hidden' : 'block'}`}>{`${userId.name} `}<span className=' font-bold'>{`| ${Status}`}</span></p>
                                        <p className={`${ticket ? 'block' : 'hidden'}`}>پرسش شما</p>
                                    </>
                                    :
                                    <p className="">
                                        {`دیدگاه شما در باب
                                        ${productId ? productId.title : articleId?.title}`}
                                    </p>
                            }

                            <p className="text-sm text-slate-500 dark:text-white transition-all">{createdAt && createdAt.toLocaleString()}</p>
                            {ticket &&
                                <div className="sm:hidden">
                                    {status}
                                </div>
                            }
                        </div>
                    </div>
                    {
                        !ticket && !account &&
                        <div className=" dark:bg-slate-400 bg-sky-200 rounded-full transition-all" onClick={() => replyHandler()}>
                            <IconButton>
                                <ReplyRoundedIcon />
                            </IconButton>
                        </div>
                    }
                    {ticket &&
                        <div className="hidden sm:block">
                            {status}
                        </div>
                    }
                </div>
                <div className="flex w-full justify-between flex-wrap gap-4">
                    <p className="flex-1 whitespace-pre-line">
                        {txt}
                    </p>
                    {
                        !ticket &&
                        <div className="w-fit flex-1" dir='ltr'>
                            <Rating
                                name="hover-feedback"
                                value={star}
                                precision={0.5}
                                emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                                icon={<StarRoundedIcon fontSize="inherit" />}
                                readOnly
                            />
                        </div>
                    }
                </div>
                <div className=" flex-col justify-start items-center w-full">
                    {
                        response ?

                            <div className="border-white dark:border-slate-500 dark:bg-slate-600 dark:outline-slate-600 mt-7 bg-sky-100 outline-sky-100 py-4 px-6 outline-[4px] outline border-2 border-solid rounded-xl w-full">

                                <p className="">
                                    {response}
                                </p>
                            </div> :
                            reply.length > 0 &&
                            reply.map(r => (
                                <div key={r._id} className='mt-4 w-full'>
                                    < ReplyBox
                                        {...r}
                                    />
                                </div>
                            ))
                    }
                </div>
            </div>
        </>
    );
}

export default CommentBox;