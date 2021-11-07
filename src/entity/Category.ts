import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity("category")
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 50
    })
    categoryName: string;

    @OneToMany(type => Product, product => product.category)
    products: Product[];
}