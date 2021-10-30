import * as Joi from "joi";
import { stringCustomMessage } from "./common/message";
import { AddedCategory } from "../interfaces/dtos/category";

const categorySchema = Joi.object<AddedCategory>({
    categoryName: Joi.string().min(3).max(255).trim().required().messages(stringCustomMessage)
});

export const validateCategory = (category: AddedCategory) => {
    return categorySchema.validate(category);
}