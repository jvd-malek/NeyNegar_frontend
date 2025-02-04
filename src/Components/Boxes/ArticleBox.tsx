import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link } from 'react-router-dom';

type ArticleBoxType = {
    title: string,
    majorCat: string,
    minorCat?: string,
    subCat?: string,
    desc: string,
    _id: string,
    cover: string,
}

function ArticleBox({ title, majorCat, desc, _id , cover}: ArticleBoxType) {
    return (
        <>
            <div className={`flex flex-col font-[vazir] overflow-hidden gr1 shadow-css rounded-2xl w-72 dark:gr2dark`}>
                <img className=" border-b-2 border-solid border-slate-800 rounded-2xl object-cover" src={`https://api.neynegar1.ir/imgs/${cover}`} alt="دوره پروژه محور متخصص جنگو" />
                <div className="px-4 pt-2.5 pb-4 flex-grow border-b border-b-gray-100 dark:border-b-gray-700">
                    <p className={`text-sm h-10 line-clamp-2 text-slate-800 dark:text-white`}>
                        {`${title}، ${desc}`}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-1.5 px-5 pb-2 text-sm text-slate-800 dark:text-white">
                    <span className=" space-x-1.5">
                        {majorCat}
                    </span>
                    <Link
                        to={`/article/${_id}`}
                        className="flex items-center gap-x-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        مشاهده مقاله
                        <span className="text-slate-700 dark:text-white">
                            <KeyboardBackspaceRoundedIcon />
                        </span>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ArticleBox;