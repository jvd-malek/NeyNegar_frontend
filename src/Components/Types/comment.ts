import { repliesType } from "../Types/replies"
import { userType } from "../Types/user"
import { articleSingleType } from "./article"
import { productSingleType } from "./product"

export type commentType = {
    _id: string,
    txt: string,
    star?: number,
    like?: number,
    productId?: productSingleType,
    articleId?: articleSingleType,
    userId: userType,
    createdAt?: string,
    replies?: repliesType[],
    response?:string
    status?:string
}
