import { createConnection } from "typeorm";
import { Category } from "../entity/Category";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

// let connection: Connection = async () => await createConnection({

// });

export const connection = async () =>
  await createConnection({
    type: "mysql",
    host: process.env.HOST,
    port: 3306,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [User, Category, Order, OrderItem, Product],
  }).catch((err) => console.log(err));
