import * as Joi from "joi";
import { ProductInterface, UpdateProductQuantity } from "../interfaces/dtos/product";
import { dateCustomMessage, numberCustomMessage, stringCustomMessage } from "./common/message";

const productSchema = Joi.object<ProductInterface>({
    name: Joi.string().min(5).max(255).required().messages(stringCustomMessage),
    image: Joi.string().max(1025).required().messages(stringCustomMessage),
    quantity: Joi.number().min(0).required().messages(numberCustomMessage),
    description: Joi.string().min(5).required().messages(stringCustomMessage),
    price: Joi.number().min(0).required().messages(numberCustomMessage),
    publishedDate: Joi.date().required().messages(dateCustomMessage),
    categoryId: Joi.number().min(1).required().messages(numberCustomMessage)
});

const updateProductQuantitySchema = Joi.object<UpdateProductQuantity>({
    quantity: Joi.number().min(0).required().messages(numberCustomMessage),
});

export const validateProduct = (product: ProductInterface) => {
    return productSchema.validate(product, {
        abortEarly: false
    });
}

export const validateProductQuantity = (product: UpdateProductQuantity) => {
    return updateProductQuantitySchema.validate(product);
}