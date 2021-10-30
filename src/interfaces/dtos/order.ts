import { Order } from "../../entity/Order";
import { ProductInCart } from "./product";

export interface NewOrder extends Pick<Order, "receiver" | "address" | "phoneNumber"> {
    products: Array<ProductInCart>
}

export interface CancelOrder extends Pick<Order, "orderId"> { }