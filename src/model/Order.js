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
exports.getLastOrderId = exports.getAllOrders = exports.createOrder = void 0;
const fs = require("fs");
;
;
// CREATE ORDER
const createOrder = function (orders) {
    return __awaiter(this, void 0, void 0, function* () {
        // WRITE THE ORDER TO FILE
        fs.writeFile(`${__dirname}/../db/orderDB.txt`, JSON.stringify(orders), (err) => {
            if (err) {
                console.log("Failed to write to file");
            }
        });
        // RETURN CREATED ORDER
        return orders[orders.length - 1];
    });
};
exports.createOrder = createOrder;
// GET ALL ORDERS
const getAllOrders = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../db/orderDB.txt`, (err, data) => {
            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }
            let ordersJSON = JSON.parse(data.toString());
            resolve(ordersJSON);
        });
    });
};
exports.getAllOrders = getAllOrders;
// GET THE LAST ORDER ID
const getLastOrderId = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // GET CARTS
        const orders = yield (0, exports.getAllOrders)();
        // RETURN ID
        if (orders.length) {
            return orders[orders.length - 1].id;
        }
        else {
            return 0;
        }
    });
};
exports.getLastOrderId = getLastOrderId;
