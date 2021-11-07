import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("orderitem")
export class OrderItem {

    @PrimaryGeneratedColumn("uuid")
    orderItemId: string;

    @ManyToOne(type => Product, product => product.orderItem, {
        nullable: false,
        cascade: true
    })
    product: Product;

    @ManyToOne(type => Order, order => order.orderItems, {
        nullable: false
    })
    order: Order;

    @Column('int')
    quantity: number;

    @Column('float')
    price: number;
}