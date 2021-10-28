import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { IsDate } from "class-validator";
import { Category } from "./Category";
import { OrderItem } from "./OrderItem";

export type status = 0 | 1;

@Entity()
export class Product {

    @PrimaryGeneratedColumn("uuid")
    productId: string;

    @Column({
        unique: true
    })
    name: string;

    @Column()
    image: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: [0, 1],
        default: 0
    })
    status: status;

    @Column({
        type: "datetime"
    })
    @IsDate()
    publishedDate: Date;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    @IsDate()
    createdDate: Date;

    @ManyToOne(type => Category, category => category.products, {
        nullable: false,
        cascade: true
    })
    category: Category;

    @OneToMany(type => OrderItem, orderItem => orderItem.product)
    orderItem: OrderItem[];
}