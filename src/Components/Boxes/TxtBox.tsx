
function txtBox({ txt, val, setVal, bascket = false, type, setErrTxt, errTxt, readOnly = false }: {
    type: string, bascket?: boolean, txt: string, val: string, setVal: React.Dispatch<React.SetStateAction<string>>, setErrTxt: React.Dispatch<React.SetStateAction<{
        type: string;
        state: boolean;
    }[]>>, errTxt: { type: string, state: boolean }[]
    , readOnly?: boolean
}) {

    const errTxtFiltered = errTxt.filter(e => (
        e.type == txt
    ))

    const inputHandler = (val: string) => {
        setVal(val)
        if (errTxtFiltered) {
            let filteredErr = errTxt.filter(e => (
                e.type != txt
            ))
            errTxtFiltered[0].state = false
            setErrTxt([...filteredErr, ...errTxtFiltered])
        }
    }


    return (
        <>
            <div className="relative">
                <input
                    type={type}
                    id="hs-floating-gray-input-email"
                    className={`peer px-4 py-5 block w-full ${bascket ? "bg-blue-200" : "bg-blue-100"} border-transparent rounded-lg text-sm placeholder:text-transparent outline-none border-[3px] border-solid disabled:opacity-50 disabled:pointer-events-none focus:pt-7 focus:pb-3 [&:not(:placeholder-shown)]:pt-7 [&:not(:placeholder-shown)]:pb-3 autofill:pt-7 autofill:pb-3 ${errTxtFiltered[0].state ? "text-rose-600 focus:border-rose-600 border-rose-500 bg-rose-200 dark:bg-rose-300 dark:text-rose-700" : "bg-blue-100 focus:border-blue-500 dark:focus:border-slate-700 dark:bg-slate-400 dark:border-transparent text-slate-800 dark:text-neutral-800 dark:focus:ring-slate-600"}`}
                    placeholder=""
                    value={val}
                    onChange={e => inputHandler(e.currentTarget.value)}
                    readOnly={readOnly}
                />

                <label
                    htmlFor="hs-floating-gray-input-email"
                    className={`absolute top-0 start-0 px-4 py-5 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-3 peer-focus:text-blue-700 dark:peer-focus:text-neutral-700 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-700 dark:text-neutral-700 ${errTxtFiltered[0].state && "text-rose-600 peer-focus:text-rose-700"}`}
                >
                    {txt}
                </label>


            </div>
            <p className={`${errTxtFiltered[0].state ? "visible" : " invisible"} text-xs text-rose-500 dark:text-rose-100 leading-none`}>{`لطفا ${txt} را به درستی وارد نمایید.`}</p>
        </>
    );
}

export default txtBox;