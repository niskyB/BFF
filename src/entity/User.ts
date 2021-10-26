import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsDate, IsEmail, IsPhoneNumber } from "class-validator";
import { Order } from "./Order";

export type userRole = 0 | 1;

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    fullName: string;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;

    @Column({
        nullable: true
    })
    address: string;

    @Column({
        nullable: true
    })
    @IsPhoneNumber()
    phone: string;

    @Column({
        nullable: true
    })
    avatar: string;

    @Column()
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

    @OneToMany(type => Order, orders => orders.user, {
        cascade: true
    })
    orders: Order;
}