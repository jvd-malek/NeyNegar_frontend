import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import { useEffect, useRef, useState } from 'react';
import CommentInput from '../Components/Comment/CommentInput';
import SuggestionBox from '../Components/Boxes/SuggestionBox';
import CommentBox from '../Components/Comment/CommentBox';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reduxType } from '../Components/Types/redux';
import { getArticle } from '../Redux/ArticlePage';
import { Rating } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import parse from 'html-react-parser';


function ArticlePage() {
    const dispatch = useDispatch<any>()
    const state = useSelector((state: reduxType) => state.article)
    const [isCopied, setIsCopied] = useState(false)
    const { id } = useParams()
    const [ban, setBan] = useState(false);
    const commentScroll = useRef<HTMLDivElement>(null)
    const commentBoxScroll = useRef<HTMLDivElement>(null)
    const [replyId, setReplyId] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [replyComment, setReplyComment] = useState<{ _id: string, user: string } | undefined>(undefined);
    const jwt = localStorage.getItem("jwt")

    const commentScrollHandler = () => {
        commentScroll.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        dispatch(getArticle(id))
        if (jwt) {
            fetch(`https://api.neynegar1.ir/users/verify`, {
                headers: {
                    'authorization': jwt
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.state && data.user.status == "notifUser") {
                        setBan(true)
                    }
                })
        }
    }, [replyId, refresh])

    useEffect(() => {
        if (state.comments && replyId.length > 0) {
            let com = state.comments.filter(c => (
                c._id == replyId
            ))
            setReplyComment({ _id: replyId, user: com[0].userId.name })
        }
    }, [replyId])

    const copyHandler = () => {
        navigator.clipboard.writeText(`https://localhost:3000/articles/${id}`)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 2000);
    }

    return (

        <div className="grid sm:w-[82vw] w-[98vw] mx-auto gap-8 mt-32">

            <div className="col-start-1 lg:col-end-6 row-start-1 lg:row-end-4 w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 text-slate-700 dark:gr2dark dark:outline-slate-600 dark:text-white">

                <h1 className="border-b border-white border-solid pb-10 text-xl text-sky-900 dark:text-white">
                    {state.article?.title}
                </h1>

                <div className="flex justify-between items-center">
                    <div className="flex gap-4 mt-6 text-slate-500 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="">
                                <PersonOutlineRoundedIcon />
                            </div>
                            <span className="">
                                {state.article?.authorId?.firstname}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="">
                                <CalendarMonthRoundedIcon />
                            </div>
                            <span className="pt-1">{state.article?.createdAt}</span>
                        </div>
                    </div>
                    <div className="pt-5">
                        {state.article &&
                            <Rating
                                name="hover-feedback"
                                value={state.article?.popularity}
                                precision={0.5}
                                emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                                icon={<StarRoundedIcon fontSize="inherit" />}
                                readOnly
                            />
                        }
                    </div>
                </div>

                {state.article && parse(state.article?.content)}
            </div>

            <div className="lg:col-start-6 lg:col-end-8 lg:row-start-1 col-start-1 row-start-2 h-fit w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 dark:gr2dark dark:outline-slate-600">
                <div className="flex items-center border-white border-b border-solid pb-6 text-lg text-sky-900 dark:text-white gap-3">
                    <div className="">
                        <ShareRoundedIcon />
                    </div>
                    <p className="">
                        اشتراک‌گذاری مطلب
                    </p>
                </div>
                <div className="flex items-center justify-between cursor-pointer mt-6 mb-2 py-1 px-2 rounded-lg bg-sky-200 text-lg relative text-sky-900 gap-3 border-2 border-sky-400 dark:border-slate-400 dark:text-slate-800 dark:bg-slate-400 border-dashed" onClick={() => copyHandler()}>
                    <div className="">
                        <InsertLinkRoundedIcon />
                    </div>
                    <p className="">{`https://localhost:3000/articles`}</p>
                    <p className={`absolute left-1/2 -translate-x-1/2 bg-sky-300 dark:text-slate-800 dark:bg-slate-400 rounded-lg py-1 px-2 transition-all -top-[110%] ${isCopied ? ' opacity-100 ' : ' opacity-0'}`}>کپی شد!</p>
                </div>
            </div>

            <div className="lg:col-start-6 lg:col-end-8 col-start-1 lg:row-start-2 row-start-3 h-fit w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 dark:gr2dark dark:outline-slate-600 dark:text-white">
                <SuggestionBox cat={"مقالات"} bascket={false} id={id ? id : ''} ban={ban} article />
            </div>

            {jwt && !ban &&
                <div ref={commentScroll} className="col-start-1 lg:col-end-6 row-start-4 h-fit w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 dark:gr2dark dark:outline-slate-600 dark:text-white">
                    <CommentInput commentBoxScroll={commentBoxScroll} replyComment={replyComment} refresh={refresh} setRefresh={setRefresh} setReplyComment={setReplyComment} setReplyId={setReplyId} articleId={id} />
                </div>
            }

            <div className="col-start-1 lg:col-end-6 row-start-5 h-fit w-full relative bg-sky-100 outline-sky-100 outline-[6px] outline border-2 border-solid border-white dark:border-slate-800 transition-all rounded-xl pt-9 pb-4 px-6 dark:gr2dark dark:outline-slate-600 dark:text-white">
                <h3 className="text-slate-700 text-xl font-bold py-2 pl-4 pr-6 rounded-l-lg -right-2 top-6 dark:bg-slate-800 dark:text-white bg-white absolute transition-all ">
                    نظرات
                </h3>
                {
                    state.comments && state.comments.length > 0 ?
                        [...state.comments].reverse().map(c => (
                            <div key={c._id} >
                                <CommentBox account={false} ticket={false} {...c} commentScrollHandler={commentScrollHandler} setReplyId={setReplyId} />
                            </div>
                        ))
                        :
                        <p className="lg:mt-0 mt-12 text-center mb-4">هنوز دیدگاهی درباره این محصول ثبت نشده است.</p>
                }
            </div>

        </div >
    );
}

export default ArticlePage;