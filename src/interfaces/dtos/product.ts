export interface ProductInterface {
    name: string,
    image: string,
    quantity: number,
    price: number,
    description: string,
    publishedDate: Date,
    categoryId: number
}

export interface UpdateProductQuantity {
    quantity: number
}