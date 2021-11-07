import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

export type userRole = 0 | 1;

@Entity("user")
export class User {

    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 50
    })
    username: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 255
    })
    fullName: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 30
    })
    email: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 255
    })
    address: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 11
    })
    phone: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 500
    })
    avatar: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 255
    })
    password: string;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    createdDate: Date;

    @Column({
        type: "enum",
        enum: [0, 1],
        default: 0
    })
    roleId: userRole;

    @OneToMany(type => Order, orders => orders.user)
    orders: Order[];
}