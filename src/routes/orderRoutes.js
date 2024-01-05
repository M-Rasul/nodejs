"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderController_1 = require("../controller/OrderController");
const express = require("express");
// CREATING ROUTER
const router = express.Router();
// ROUTES
// BASE
router
    .route("/")
    .post(OrderController_1.createOrderController);
// EXPORT
module.exports = router;
