"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCartController = exports.updateCartController = exports.createCartController = void 0;
const { createCart, getAllCarts, getCartById, updateCart } = require("../model/Cart");
const joi_1 = __importDefault(require("joi"));
const Product_1 = require("../model/Product");
;
;
;
;
;
// CREATE CART
const createCartController = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // GET USER ID
        const userId = req.headers["x-user-id"];
        // GET BODY PARAMETERS
        const { productId, amount } = req.query;
        // GET ALL CARTS
        const carts = yield getAllCarts();
        // CHECKING IF THIS USER HAS OPEN CART
        if (carts.some((cart) => +cart.userId === +userId)) {
            // SEND ERROR
            res
                .status(400)
                .send({
                error: "This user has open cart",
                ok: false,
            });
        }
        else {
            // CREATE NEW CART
            const createdCart = yield createCart(productId, amount, userId);
            res
                .status(201)
                .send({
                ok: true,
                cart: createdCart,
            });
        }
    });
};
exports.createCartController = createCartController;
// UPDATE CART
const updateCartController = function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // DEFINING SCHEMA FOR JOI
        const schema = joi_1.default.object({
            productId: joi_1.default.string()
                .alphanum()
                .required(),
            amount: joi_1.default.number().required(),
            xUserId: joi_1.default.string().required(),
            cartId: joi_1.default.string().required(),
        })
            .with('productId', 'amount');
        // GET CART ID FROM PARAMS
        const cartId = req.params.cartId;
        // GET BODY
        const { productId, amount } = req.query;
        // GET USER ID
        const userId = req.headers["x-user-id"];
        // CHECKING IF CART ID IS CORRECT
        const carts = yield getAllCarts();
        // CHECKING IF VALIDATION GAVE ERROR
        const joiError = (_a = schema.validate({ productId, amount, xUserId: userId, cartId })) === null || _a === void 0 ? void 0 : _a.error;
        if (joiError) {
            res
                .status(400)
                .send({
                error: joiError.toString(),
                ok: false,
            });
            return;
        }
        // CHECKING IF PRODUCT ID WAS NOT PROVIDED
        if (!productId) {
            res
                .status(400)
                .send({
                error: "You did not provide product id",
                ok: false,
            });
            return;
        }
        // CHECKING IF USER HAS ACCESS TO CART
        if (((_b = carts.find(cart => cart.id === +cartId)) === null || _b === void 0 ? void 0 : _b.userId.toString()) !== userId) {
            // GIVE ERROR
            res
                .status(403)
                .send({
                error: "You do not have permission to edit this cart",
                ok: false,
            });
            return;
        }
        const product = yield (0, Product_1.getProductById)(+productId);
        // CHECKING IF PRODUCT WITH SUCH ID EXISTS
        if (!product) {
            // SEND ERROR
            res
                .status(400)
                .send({
                error: "Product with such id does not exist",
                ok: false,
            });
            return;
        }
        if (carts.some(cart => cart.id === +cartId)) {
            // UPDATE CART AND RETURN THE LIST OF CARTS
            const updatedCarts = yield updateCart(productId, amount, +cartId);
            // CURRENT USER'S CARTS ONLY
            const returnedCarts = updatedCarts.filter((cart) => +cart.userId === +userId);
            // SEND RESPONSE
            res
                .status(200)
                .send({
                ok: true,
                cart: returnedCarts[0],
            });
        }
        else {
            res
                .status(400)
                .send({
                error: "Cart with such id does not exist",
                ok: false,
            });
        }
    });
};
exports.updateCartController = updateCartController;
// GET MY CART
const getMyCartController = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // GET USER ID
        const userId = req.headers["x-user-id"];
        // CHECK IF USER HAS A CART
        const carts = yield getAllCarts();
        if (carts.some((cart) => +cart.userId === +userId)) {
            // SEND RESPONSE
            res
                .status(200)
                .send({
                ok: true,
                cart: carts.filter((cart) => +cart.userId === +userId)[0],
            });
        }
        else {
            // SEND ERROR RESPONSE
            res
                .status(404)
                .send({
                error: "You do not have any open carts",
                ok: false,
            });
        }
    });
};
exports.getMyCartController = getMyCartController;
