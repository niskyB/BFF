import authenMiddleware from "../middlewares/authenMiddleware";
import { genResponseForm } from "../utils/responseHelper";
import { getCustomRepository } from "typeorm";
import { BAD_REQUEST, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/statusConstants";
import { RequestWithUser, ServerRequest } from "../interfaces/common/Request";
import * as express from "express";
import { CancelOrder, NewOrder } from "../interfaces/dtos/order";
import { Response } from "express";
import { validateCancelOrder, validateNewOrder } from "../validator/order";
import { OrderRepository } from "../Repository/OrderRepository";
const router = express.Router();

// Get order by userId
router.get(
    '/user',
    [
        authenMiddleware
    ],
    async (req: RequestWithUser<any>, res: Response) => {
        // get connection
        const orderRepo = getCustomRepository(OrderRepository);

        // get user's order
        const orders = await orderRepo.getUserOrder(req.user);

        if (orders.length === 0) return res.send(genResponseForm(null, null, 'The order list is epmty'));
        res.send(genResponseForm({ orders }, null, 'get order list successful'));
    }
)

// Post create new order
router.post(
    '/',
    [
        authenMiddleware
    ],
    async (req: RequestWithUser<NewOrder>, res: Response) => {
        // check params
        const { error } = validateNewOrder(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get connection
        const orderRepo = getCustomRepository(OrderRepository);

        // create order object
        const order = orderRepo.create();
        order.receiver = req.body.receiver;
        order.address = req.body.address;
        order.phoneNumber = req.body.phoneNumber;
        order.user = req.user;

        // start query
        try {
            await orderRepo.addNewOrder(order, req.body.products);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(genResponseForm(null, err, 'Some thing went wrong'));
        }

        res.send(genResponseForm(null, null, 'checkout successful'));
    }
);

// Put cancel order
router.put(
    '/status',
    [
        authenMiddleware
    ],
    async (req: RequestWithUser<CancelOrder>, res: Response) => {
        // check param
        const { error } = validateCancelOrder(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get connection
        const orderRepo = getCustomRepository(OrderRepository);

        // get order
        const order = await orderRepo.getOrderById(req.body.orderId);
        if (!order) return res.status(NOT_FOUND).send(genResponseForm(null, null, 'Cannot find the order'));

        // check user
        if (req.user.userId != order.user.userId) return res.status(FORBIDDEN).send(genResponseForm(null, null, 'Do not have permission'));

        // update status
        order.status = 4;

        // save to db
        const result = await orderRepo.cancelOrder(order);

        res.send(genResponseForm(order, null, 'cancel successful'));
    }
)

export default router;