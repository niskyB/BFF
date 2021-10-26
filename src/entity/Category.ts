import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column({
        unique: true
    })
    categoryName: string;

    @OneToMany(type => Product, product => product.category, {
        cascade: true
    })
    products: Product[];
}