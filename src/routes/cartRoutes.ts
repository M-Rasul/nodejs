import { createCartController, getMyCartController, updateCartController } from "../controller/CartController";

const express = require("express");

// CREATING ROUTER
const router = express.Router();

// ROUTES

// BASE
router
    .route("/")
    .post(createCartController)
    .get(getMyCartController)

// :id
router
    .route("/:cartId")
    .put(updateCartController)

// EXPORT ROUTER
module.exports = router;