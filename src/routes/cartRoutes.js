"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CartController_1 = require("../controller/CartController");
const express = require("express");
// CREATING ROUTER
const router = express.Router();
// ROUTES
// BASE
router
    .route("/")
    .post(CartController_1.createCartController)
    .get(CartController_1.getMyCartController);
// :id
router
    .route("/:cartId")
    .put(CartController_1.updateCartController);
// EXPORT ROUTER
module.exports = router;
