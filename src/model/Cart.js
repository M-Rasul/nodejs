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
exports.deleteCart = exports.getCartById = exports.getAllCarts = exports.getTheLastCartId = exports.updateCart = exports.createCart = void 0;
const fs = require("fs");
;
;
// CREATE
const createCart = function (productId, amount, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // ID OF A CART
        const id = yield (0, exports.getTheLastCartId)();
        // CART TO BE PUSHED
        const cart = {
            id: id + 1,
            userId,
            products: [{ id: productId, amount }]
        };
        // GET ALL CARTS
        const carts = yield (0, exports.getAllCarts)();
        // PUSH NEW CART TO OLD LIST
        carts.push(cart);
        // WRITE CARTS TO THE FILE
        fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(carts), (err) => {
            if (err) {
                console.log("Failed to write to file");
            }
        });
        // RETURN CREATED CART
        return cart;
    });
};
exports.createCart = createCart;
// UPDATE CART
const updateCart = function (productId, amount, cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIND THAT CART
        const cart = yield (0, exports.getCartById)(cartId);
        // GET ALL CARTS
        const carts = yield (0, exports.getAllCarts)();
        // DOES PRODUCT EXIST IN THAT CART
        const isProductInCart = cart === null || cart === void 0 ? void 0 : cart.products.some(product => product.id === productId);
        const newCarts = carts.map(singleCart => {
            if (singleCart.id === cartId) {
                if (isProductInCart) {
                    return Object.assign(Object.assign({}, singleCart), { products: singleCart.products.map(singleProduct => {
                            if (singleProduct.id === productId) {
                                return Object.assign(Object.assign({}, singleProduct), { amount: +singleProduct.amount + (+amount) });
                            }
                            return singleProduct;
                        }) });
                }
                else {
                    return Object.assign(Object.assign({}, singleCart), { products: [...singleCart.products, { id: productId, amount }] });
                }
            }
            return singleCart;
        });
        // WRITE TO FILE
        fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(newCarts), (err) => {
            // IF ERROR
            if (err) {
                console.log("Failed to write to file");
            }
        });
        // RETURN NEW CARTS
        return newCarts;
    });
};
exports.updateCart = updateCart;
// GET THE LAST CART'S ID
const getTheLastCartId = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // GET CARTS
        const carts = yield (0, exports.getAllCarts)();
        // RETURN ID
        if (carts.length) {
            return carts[carts.length - 1].id;
        }
        else {
            return 0;
        }
    });
};
exports.getTheLastCartId = getTheLastCartId;
// GET ALL CARTS
const getAllCarts = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../db/cartDB.txt`, (err, data) => {
            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }
            let cartsJSON = JSON.parse(data.toString());
            resolve(cartsJSON);
        });
    });
};
exports.getAllCarts = getAllCarts;
// GET CART BY ID
const getCartById = function (cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        // GETTING ALL CARTS
        const carts = yield (0, exports.getAllCarts)();
        // FINDING CART WITH SPECIFIED ID
        const cart = carts === null || carts === void 0 ? void 0 : carts.find(singleCart => singleCart.id === cartId);
        // RETURN THAT CART
        return cart;
    });
};
exports.getCartById = getCartById;
// DELETE CART
const deleteCart = function (cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        // GET ALL CARTS
        const carts = yield (0, exports.getAllCarts)();
        // FILTER CARTS WITHOUT THAT CART
        const newCarts = carts.filter(cart => cart.id !== cartId).map((filteredCart, index) => (Object.assign(Object.assign({}, filteredCart), { id: index })));
        // WRITE CARTS TO FILE
        fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(newCarts), (err) => {
            if (err) {
                console.log("Failed to write to file");
            }
        });
        // RETURN CARTS
        return newCarts;
    });
};
exports.deleteCart = deleteCart;
