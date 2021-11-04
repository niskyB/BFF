import authenMiddleware from "../middlewares/authenMiddleware";
import { genResponseForm } from "../utils/responseHelper";
import { getCustomRepository } from "typeorm";
import { BAD_REQUEST, CREATED, NOT_FOUND } from "../constants/statusConstants";
import { Response, Request } from "express";
import * as express from "express";
import authorMiddleware from "../middlewares/authorMiddleware";
import { RequestWithProduct, ServerRequest } from "../interfaces/common/Request";
import { ProductInterface, UpdateProductQuantity } from "../interfaces/dtos/product";
import { validateProduct, validateProductQuantity } from "../validator/product";
import { CategoryRepository } from "../Repository/categoryRepository";
import { ProductRepository } from "../Repository/ProductRepository";
import { Product } from "../entity/Product";
import { multerErrorMiddleware } from "../middlewares/multerMiddleware";
import { upload } from "../utils/multerHelper";
const router = express.Router();

// Get product by given id
router.get(
    '/:id',
    async (req: ServerRequest<Product>, res: Response) => {
        // connect to db
        const productRepo = getCustomRepository(ProductRepository);

        // get product with given id
        const product = await productRepo.getProductById(req.params.id);
        if (!product) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'Cannot found the product'));

        res.send(genResponseForm(product, null, 'get product successful'));
    }
)

// Get all product
router.get(
    '/',
    async (req: ServerRequest<Product>, res: Response) => {
        // connect to db
        const productRepo = getCustomRepository(ProductRepository);

        // get product list
        const products = await productRepo.getAllProduct();

        if (products.length === 0) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'Cannot found the products'));

        res.send(genResponseForm({ products }, null, 'get products successful'));
    }
)

// Post add new product
router.post(
    '/addproduct',
    [
        authenMiddleware,
        authorMiddleware,
        multerErrorMiddleware(upload.single('productImg'))
    ],
    async (req: RequestWithProduct<ProductInterface>, res: Response) => {
        // check image
        if (req.file) {
            req.body.image = req.file.filename;
        }

        // validate params
        const { error } = validateProduct(req.body);
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

        // get category
        const category = await cateRepo.getCategoryById(req.body.categoryId);
        if (!category) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'Invalid category'));

        // connect to db
        const productRepo = getCustomRepository(ProductRepository);

        // check duplicated name
        const isExistedName = await productRepo.getProductByName(req.body.name);
        if (isExistedName) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'The given name has already existed'));

        // create product object
        const product = productRepo.create();
        product.name = req.body.name;
        product.image = req.body.image;
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.price = req.body.price;
        product.publishedDate = req.body.publishedDate;
        product.category = category;

        // save to db
        const result = await productRepo.addNewProduct(product);

        res.send(genResponseForm(product, null, 'add new product successful'));
    }
);

// Put update quantity of product
router.put(
    '/quantity/:id',
    [
        authenMiddleware,
        authorMiddleware
    ],
    async (req: RequestWithProduct<UpdateProductQuantity>, res: Response) => {
        // validate params
        const { error } = validateProductQuantity(req.body);
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
        const productRepo = getCustomRepository(ProductRepository);

        // create product object
        const product = productRepo.create();
        product.quantity = req.body.quantity;

        // save to db
        const result = await productRepo.addNewProduct(product);

        res.send(genResponseForm(product, null, 'update quantity successful'));
    }
)

// Put update info of product
router.put(
    '/:id',
    [
        authenMiddleware,
        authorMiddleware,
        multerErrorMiddleware(upload.single('productImg'))
    ],
    async (req: RequestWithProduct<ProductInterface>, res: Response) => {
        // check image
        if (req.file) {
            req.body.image = req.file.filename;
        }

        // validate params
        const { error } = validateProduct(req.body);
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

        // get category
        const category = await cateRepo.getCategoryById(req.body.categoryId);
        if (!category) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'Invalid category'));

        // connect to db
        const productRepo = getCustomRepository(ProductRepository); 4

        // get the current product
        const product = await productRepo.getProductById(req.params.id);

        // check duplicated name
        const isExistedName = await productRepo.getProductByName(req.body.name);
        if (isExistedName && product.name != req.body.name) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'The given name has already existed'));

        // create product object
        product.name = req.body.name;
        product.image = req.body.image;
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.price = req.body.price;
        product.publishedDate = req.body.publishedDate;
        product.category = category;

        // update to db
        const result = await productRepo.updateProduct(product);

        res.send(genResponseForm(null, null, 'update product successful'));
    }
);

export default router;