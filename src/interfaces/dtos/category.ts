import { Category } from "../../entity/Category";

export interface AddedCategory extends Pick<Category, "categoryName"> { }