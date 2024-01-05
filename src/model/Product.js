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
exports.getProductById = exports.getAllProducts = void 0;
const fs = require("fs");
;
// GET ALL PRODUCTS
const getAllProducts = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../db/productDB.txt`, (err, data) => {
            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }
            let productsJSON = JSON.parse(data.toString());
            resolve(productsJSON);
        });
    });
};
exports.getAllProducts = getAllProducts;
// GET PRODUCT BY ID
const getProductById = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        // GETTING ALL PRODUCTS
        const products = yield (0, exports.getAllProducts)();
        // FINDING PRODUCT WITH SPECIFIED ID
        const product = products === null || products === void 0 ? void 0 : products.find(singleProduct => +singleProduct.id === +productId);
        // RETURN THAT PRODUCT
        return product;
    });
};
exports.getProductById = getProductById;
