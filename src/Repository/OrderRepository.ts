import { EntityRepository, Repository, getConnection, getCustomRepository } from "typeorm";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { User } from "../entity/User";
import { ProductInCart } from "../interfaces/dtos/product";
import { ProductRepository } from "./ProductRepository";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async addNewOrder(order: Order, products: Array<ProductInCart>) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();

        // open a new transaction:
        await queryRunner.startTransaction();
        const productRepo = getCustomRepository(ProductRepository);

        try {
            // execute some operations on this transaction:
            await queryRunner.manager.save(order);
            for (let i = 0; i < products.length; i++) {
                const orderItem = new OrderItem();
                orderItem.order = order;
                orderItem.price = products[i].price;
                orderItem.quantity = products[i].quantity;
                orderItem.product = await productRepo.getProductById(products[i].productId);
                await queryRunner.manager.save(orderItem);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    async getUserOrder(user: User): Promise<Array<Order>> {
        const result = await this.find({ user }).catch(err => err);
        return result;
    }

    async getOrderById(orderId: string): Promise<Order> {
        const result = await this.findOne({
            where: { orderId },
            relations: ["user"],
        }).catch(err => err);
        return result;
    }

    async cancelOrder(order: Order): Promise<Order> {
        const result = await this.save(order).catch(err => err);
        return result;
    }
}