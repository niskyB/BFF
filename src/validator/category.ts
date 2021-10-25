import * as Joi from "joi";
import { stringCustomMessage } from "./common/message";
import { Category } from "../interfaces/dtos/category";

const categorySchema = Joi.object<Category>({
    categoryName: Joi.string().min(3).max(255).trim().required().messages(stringCustomMessage)
});

export const validateCategory = (category: Category) => {
    return categorySchema.validate(category);
}