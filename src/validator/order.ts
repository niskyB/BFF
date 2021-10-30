import * as Joi from "joi";
import { CancelOrder, NewOrder } from "../interfaces/dtos/order";
import { ProductInCart } from "../interfaces/dtos/product";
import { productArrayCustomMessage, stringCustomMessage, stringCustomPhone } from "./common/message";

const newOrderSchema = Joi.object<NewOrder>({
    receiver: Joi.string().min(5).max(50).required().messages(stringCustomMessage),
    address: Joi.string().min(5).max(255).required().messages(stringCustomMessage),
    phoneNumber: Joi.string().min(6).max(12).pattern(/^[0-9]+$/).required().messages(stringCustomPhone),
    products: Joi.array().items(Joi.object<ProductInCart>()).required().min(1).messages(productArrayCustomMessage)
});

const cancleOrderSchema = Joi.object<CancelOrder>({
    orderId: Joi.string().required().messages(stringCustomMessage)
});

export const validateNewOrder = (order: NewOrder) => {
    return newOrderSchema.validate(order, { abortEarly: false });
}

export const validateCancelOrder = (order: CancelOrder) => {
    return cancleOrderSchema.validate(order, { abortEarly: false });
}