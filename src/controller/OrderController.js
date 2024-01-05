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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderController = void 0;
const Cart_1 = require("../model/Cart");
const Order_1 = require("../model/Order");
const Product_1 = require("../model/Product");
;
;
;
;
;
// CREATE ORDER
const createOrderController = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const cart = yield (0, Cart_1.getCartById)(+cartId);
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
        if (+(cart === null || cart === void 0 ? void 0 : cart.userId) !== +userId) {
            res
                .status(403)
                .send({
                error: "You do not have access to this cart",
                ok: false,
            });
        }
        // FORM NEW ORDER OBJECT
        const lastOrderId = yield (0, Order_1.getLastOrderId)();
        const orderId = lastOrderId + 1;
        let cost = 0;
        const products = [];
        // Use `map` to create an array of promises
        const promises = cart.products.map((product) => __awaiter(this, void 0, void 0, function* () {
            // GET THAT PRODUCT
            const singleProduct = yield (0, Product_1.getProductById)(product.id);
            if (!singleProduct) {
                return null; // Handle the case where the product is not found
            }
            cost += (+product.amount) * (+singleProduct.cost);
            products.push({ id: product.id.toString(), name: singleProduct.name, cost: singleProduct.cost, amount: product.amount });
        }));
        // Use `Promise.all` to wait for all promises to resolve
        Promise.all(promises)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            // Filter out null values in case of product not found
            const newOrder = { id: orderId, userId: +userId, cost, products };
            // GET ALL ORDERS
            const allOrders = yield (0, Order_1.getAllOrders)();
            // PUSH NEW ORDER TO ALL
            allOrders.push(newOrder);
            // CREATE ORDERS
            const createdOrder = yield (0, Order_1.createOrder)(allOrders);
            // CHECK IF IT WAS SUCCESSFUL
            if (createdOrder) {
                // DELETE CART
                yield (0, Cart_1.deleteCart)(+cartId);
                res
                    .status(201)
                    .send({
                    ok: true,
                    order: createdOrder,
                });
            }
            else {
                // REPORT ERROR
                res
                    .status(500)
                    .send({
                    error: "Something went wrong when creating order",
                    ok: false,
                });
            }
        }))
            .catch((error) => {
            console.error("Error fetching products:", error);
        });
    });
};
exports.createOrderController = createOrderController;
