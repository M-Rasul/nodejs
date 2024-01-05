const { createCart, getAllCarts, getCartById, updateCart } = require("../model/Cart");
import Joi from "joi";
import {Request as ExpressRequest, Response, NextFunction} from "express";
import { IncomingHttpHeaders } from 'http';
import { ParamsDictionary } from 'express-serve-static-core';
import { getProductById } from "../model/Product";

// PRODUCT INTERFACE
interface IProduct {
    id: number;
    amount: number;
};

// CART INTERFACE
interface ICart {
    id: number;
    userId: number;
    products: IProduct[];
};

// REQUEST BODY
interface RequestBody {
    productId?: number;
    amount?: number;
};

// RESPONSE BODY
interface ResponseBody {
    error?: string;
    ok: boolean;
    cart?: ICart;
};

// REQUEST HEADERS
interface Headers extends IncomingHttpHeaders {
    "x-user-id": string;
};

interface Params extends ParamsDictionary {
    cartId: string;
}

interface RequestWithHeaders<ReqBody, ReqHeaders extends IncomingHttpHeaders, ReqParams extends ParamsDictionary> extends ExpressRequest {
    body: ReqBody;
    headers: ReqHeaders;
    params: ReqParams;
}

// CREATE CART
export const createCartController = async function(req: RequestWithHeaders<RequestBody, Headers, Params>, res: Response<ResponseBody>, next: NextFunction) {

    // GET USER ID
    const userId = req.headers["x-user-id"];
    
    // GET BODY PARAMETERS
    const {productId, amount} = req.query;

    // GET ALL CARTS
    const carts = await getAllCarts();

    // CHECKING IF THIS USER HAS OPEN CART
    if(carts.some((cart: ICart) => +cart.userId === +userId)) {

        // SEND ERROR
        res
            .status(400)
            .send({
                error: "This user has open cart",
                ok: false,
            });
    } else {

        // CREATE NEW CART
        const createdCart = await createCart(productId, amount, userId);

        res
            .status(201)
            .send({
                ok: true,
                cart: createdCart,
            });
    }
}

// UPDATE CART
export const updateCartController = async function(req: RequestWithHeaders<RequestBody, Headers, Params>, res: Response<ResponseBody>, next: NextFunction) {

    // DEFINING SCHEMA FOR JOI
    const schema = Joi.object({
        productId: Joi.string()
            .alphanum()
            .required(),
    
        amount: Joi.number().required(),
    
        xUserId: Joi.string().required(),

        cartId: Joi.string().required(),
    })
        .with('productId', 'amount');

    // GET CART ID FROM PARAMS
    const cartId = req.params.cartId;

    // GET BODY
    const {productId, amount} = req.query;
    
    // GET USER ID
    const userId = req.headers["x-user-id"];

    // CHECKING IF CART ID IS CORRECT
    const carts:ICart[] = await getAllCarts();

    // CHECKING IF VALIDATION GAVE ERROR
    const joiError = schema.validate({productId, amount, xUserId: userId, cartId})?.error;
    if(joiError) {
        res
            .status(400)
            .send({
                error: joiError.toString(),
                ok: false, 
            });
        return;
    }

    // CHECKING IF PRODUCT ID WAS NOT PROVIDED
    if(!productId) {
        res
            .status(400)
            .send({
                error: "You did not provide product id",
                ok: false,
            });
        return;
    }

    // CHECKING IF USER HAS ACCESS TO CART
    if(carts.find(cart => cart.id === +cartId)?.userId.toString() !== userId) {

        // GIVE ERROR
        res
            .status(403)
            .send({
                error: "You do not have permission to edit this cart",
                ok: false,
            });
        return;
    } 

    const product = await getProductById(+productId);

    // CHECKING IF PRODUCT WITH SUCH ID EXISTS
    if(!product) {

        // SEND ERROR
        res
            .status(400)
            .send({
                error: "Product with such id does not exist",
                ok: false,
            });
        return;
    }

    if(carts.some(cart => cart.id === +cartId)) {

        // UPDATE CART AND RETURN THE LIST OF CARTS
        const updatedCarts = await updateCart(productId, amount, +cartId);
        
        // CURRENT USER'S CARTS ONLY
        const returnedCarts: ICart[] = updatedCarts.filter((cart: ICart) => +cart.userId === +userId);

        // SEND RESPONSE
        res
            .status(200)
            .send({
                ok: true,
                cart: returnedCarts[0],
            });
    } else {
        res
            .status(400)
            .send({
                error: "Cart with such id does not exist",
                ok: false,
            });
    }
};

// GET MY CART
export const getMyCartController = async function(req: RequestWithHeaders<RequestBody, Headers, Params>, res: Response<ResponseBody>, next: NextFunction) {

    // GET USER ID
    const userId = req.headers["x-user-id"];

    // CHECK IF USER HAS A CART
    const carts = await getAllCarts();
    if(carts.some((cart: ICart) => +cart.userId === +userId)) {

        // SEND RESPONSE
        res
            .status(200)
            .send({
                ok: true,
                cart: carts.filter((cart: ICart) => +cart.userId === +userId)[0],
            });
    } else {
        
        // SEND ERROR RESPONSE
        res
            .status(404)
            .send({
                error: "You do not have any open carts",
                ok: false,
            });
    }
};