import { EntityRepository, InsertValuesMissingError, Repository } from "typeorm";
import { Category } from "../entity/Category";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    async addNewCategory(categoryName: string): Promise<Category> {
        // create new category object
        const category = new Category();
        category.categoryName = categoryName;

        // save to db
        const result = await this.manager.save(category).catch(err => err.sqlMessage);
        return result;
    }

    async getCategoryByName(categoryName: string): Promise<Category> {
        const result = await this.findOne({ categoryName }).catch(err => err);
        return result;
    }

    async getCategoryList(): Promise<Array<Category>> {
        const result = await this.find().catch(err => err);
        return result;
    }

    async getCategoryById(categoryId: number): Promise<Category> {
        const result = await this.findOne({ categoryId }).catch(err => err);
        return result;
    }

    async updateCategory(category: Category, categoryName: string): Promise<Category> {
        category.categoryName = categoryName;
        const result = await this.save(category).catch(err => err);
        return result;
    }
}