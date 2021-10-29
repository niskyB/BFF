import authenMiddleware from "../middlewares/authenMiddleware";
import { genResponseForm } from "../utils/responseHelper";
import { getCustomRepository } from "typeorm";
import { BAD_REQUEST, CREATED, NOT_FOUND } from "../constants/statusConstants";
import { Response, Request } from "express";
import { RequestWithCategory, ServerRequest } from "../interfaces/common/Request";
import * as express from "express";
import authorMiddleware from "../middlewares/authorMiddleware";
import { AddedCategory } from "../interfaces/dtos/category";
import { validateCategory } from "../validator/category";
import { CategoryRepository } from "../Repository/categoryRepository";
const router = express.Router();

// Get category list
router.get(
    '/list',
    async (req: Request, res: Response) => {
        // connect to db
        const cateRepo = getCustomRepository(CategoryRepository);

        // get category list
        const categoryList = await cateRepo.getCategoryList();

        // check category list
        if (categoryList.length === 0) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'No category in list'));

        // respone the category list
        res.send(genResponseForm({ categoryList }, null, 'get category list successful'));
    }
);

// Get category by given id
router.get(
    '/:categoryId',
    async (req: ServerRequest<AddedCategory>, res: Response) => {
        // connect to db
        const cateRepo = getCustomRepository(CategoryRepository);

        // get category by given id
        const id: number = +req.params.categoryId;
        const category = await cateRepo.getCategoryById(id);
        if (!category) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'Cannot found the category with given id'));

        res.send(genResponseForm(category, null, 'get category successful'));
    }
)

// Post create category
router.post(
    '/create',
    [
        authenMiddleware,
        authorMiddleware
    ],
    async (req: RequestWithCategory<AddedCategory>, res: Response) => {
        // check params
        const { error } = validateCategory(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // connect to db
        const cateRepo = getCustomRepository(CategoryRepository);

        // check duplicated
        const isExistedCategory = await cateRepo.getCategoryByName(req.body.categoryName);
        if (isExistedCategory) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'The given category is already existed'));

        // insert to db
        const result = await cateRepo.addNewCategory(req.body.categoryName);
        return res.status(CREATED).send(genResponseForm({ categoryName: result.categoryName }, null, 'create successful'));
    }
);

// Put update category name
router.put(
    '/update/:categoryId',
    [
        authenMiddleware,
        authorMiddleware
    ],
    async (req: RequestWithCategory<AddedCategory>, res: Response) => {
        // check params
        const { error } = validateCategory(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // connect to db
        const cateRepo = getCustomRepository(CategoryRepository);

        // get the updated category
        const updatedId: number = +req.params.categoryId;
        const category = await cateRepo.getCategoryById(updatedId);

        // check updated category
        if (category == null) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'The category with the given id is not found'));

        // check duplicated name
        const isExistedCategory = await cateRepo.getCategoryByName(req.body.categoryName);
        if (isExistedCategory) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'The given category is already existed'));

        // update to db
        const result = await cateRepo.updateCategory(category, req.body.categoryName);
        res.send(genResponseForm(null, null, 'Update successful'));
    }
);

export default router;