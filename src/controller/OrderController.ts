import { Request as ExpressRequest, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from 'http';
import { deleteCart, getCartById } from "../model/Cart";
import { createOrder, getAllOrders, getLastOrderId } from "../model/Order";
import { getProductById } from "../model/Product";

// PRODUCT INTERFACE
interface IProduct {
    id: string;
    name: string;
    cost: number;
    amount: number;
};

// ORDER INTERFACE
interface IOrder {
    id: number;
    userId: number;
    cost: number;
    products: IProduct[];
};

// REQUEST BODY
interface RequestBody {
    cartId?: string;
};

// RESPONSE BODY
interface ResponseBody {
    error?: string;
    ok: boolean;
    order?: IOrder;
};

// REQUEST HEADERS
interface Headers extends IncomingHttpHeaders {
    "x-user-id": string;
};

interface RequestWithHeaders<ReqBody, ReqHeaders extends IncomingHttpHeaders> extends ExpressRequest {
    body: ReqBody;
    headers: ReqHeaders;
}

// CREATE ORDER
export const createOrderController = async function (
    req: RequestWithHeaders<RequestBody, Headers>,
    res: Response<ResponseBody>,
    next: NextFunction
) {

    // GET CART ID
    const { cartId } = req.query;

    // CHECKING IF CART ID WAS PROVIDED
    if (!cartId) {
        res
            .status(400)
            .send({
                error: "You did not provide cart id",
                ok: false,
            });
        return;
    }

    // GET USER ID
    const userId = req.headers["x-user-id"];

    // GET THAT CART
    const cart = await getCartById(+cartId);

    // CHECK IF CART WAS FOUND  
    if (!cart) {
        res
            .status(404)
            .send({
                error: "Cart with specified id was not found",
                ok: false,
            });
        return;
    }

    // CHECK IF THIS CART BELONGS TO USER
    if (+cart?.userId !== +userId) {
        res
            .status(403)
            .send({
                error: "You do not have access to this cart",
                ok: false,
            });
    }

    // FORM NEW ORDER OBJECT
    const lastOrderId = await getLastOrderId();
    const orderId = lastOrderId + 1;
    let cost = 0;
    const products: IProduct[] = [];
    // Use `map` to create an array of promises
    const promises = cart.products.map(async (product) => {
        // GET THAT PRODUCT
        const singleProduct = await getProductById(product.id);
        if (!singleProduct) {
            return null; // Handle the case where the product is not found
        }

        cost += (+product.amount) * (+singleProduct.cost);
        products.push({ id: product.id.toString(), name: singleProduct.name, cost: singleProduct.cost, amount: product.amount });
    });

    // Use `Promise.all` to wait for all promises to resolve
    Promise.all(promises)
        .then(async (result) => {

            // Filter out null values in case of product not found
            const newOrder: IOrder = { id: orderId, userId: +userId, cost, products };

            // GET ALL ORDERS
            const allOrders = await getAllOrders();

            // PUSH NEW ORDER TO ALL
            allOrders.push(newOrder);

            // CREATE ORDERS
            const createdOrder = await createOrder(allOrders);

            // CHECK IF IT WAS SUCCESSFUL
            if (createdOrder) {

                // DELETE CART
                await deleteCart(+cartId);
                
                res
                    .status(201)
                    .send({
                        ok: true,
                        order: createdOrder,
                    });
            } else {

                // REPORT ERROR
                res
                    .status(500)
                    .send({
                        error: "Something went wrong when creating order",
                        ok: false,
                    });
            }
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
};