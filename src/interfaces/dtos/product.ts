import { Product } from "../../entity/Product";

export interface ProductInterface
    extends Pick<Product, "name" | "image" | "quantity" | "price" | "description" | "publishedDate"> {
    categoryId: number
}

export interface UpdateProductQuantity extends Pick<Product, "quantity"> { }