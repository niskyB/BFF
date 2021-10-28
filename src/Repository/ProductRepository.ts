import { EntityRepository, Repository } from "typeorm";
import { Product } from "../entity/Product";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async addNewProduct(product: Product): Promise<Product> {
        const result = await this.manager.save(product).catch(err => err);
        return result;
    }

    async getProductByName(name: string): Promise<Product> {
        const result = await this.findOne({ name }).catch(err => err);
        return result;
    }

    async getProductById(productId: string): Promise<Product> {
        const result = await this.findOne({
            where: {
                productId
            },
            relations: [
                "category"
            ]
        }).catch(err => err);
        return result;
    }

    async getAllProduct(): Promise<Product[]> {
        const result = await this.find({
            relations: ["category"]
        });
        return result;
    }

    async updateProduct(product: Product): Promise<Product> {
        const result = await this.save(product).catch(err => err);
        return result;
    }
}