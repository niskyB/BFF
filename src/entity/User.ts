import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsDate, IsEmail, IsPhoneNumber } from "class-validator";
import { Order } from "./Order";

export type userRole = 0 | 1;

@Entity()
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
    @IsEmail()
    email: string;

    @Column({
        type: "varchar",
        length: 255
    })
    address: string;

    @Column({
        type: "varchar",
        length: 11
    })
    @IsPhoneNumber()
    phone: string;

    @Column({
        type: "varchar",
        length: 500
    })
    avatar: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 50
    })
    password: string;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    @IsDate()
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