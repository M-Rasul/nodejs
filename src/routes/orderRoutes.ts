import { createOrderController } from "../controller/OrderController";

const express = require("express");

// CREATING ROUTER
const router = express.Router();

// ROUTES
// BASE
router
    .route("/")
    .post(createOrderController)

// EXPORT
module.exports = router;