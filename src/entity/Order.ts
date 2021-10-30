import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { IsDate } from "class-validator";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export type status = 0 | 1 | 2 | 3 | 4;

@Entity()
export class Order {

    @PrimaryGeneratedColumn("uuid")
    orderId: string;

    @Column({
        type: "enum",
        enum: [0, 1, 2, 3, 4],
        default: 0
    })
    status: status;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    @IsDate()
    createdDate: Date;

    @ManyToOne(type => User, user => user.orders, {
        nullable: false,
        cascade: true,
        eager: true
    })
    user: User;

    @OneToMany(type => OrderItem, orderItems => orderItems.order)
    orderItems: OrderItem[];

    @Column({
        nullable: false
    })
    receiver: string;

    @Column({
        nullable: false
    })
    address: string;

    @Column({
        nullable: false
    })
    phoneNumber: string;
}