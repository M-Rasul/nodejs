import { checkUserId } from "./middleware/checkUserId";

const express = require("express");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// CREATING AN APP
const app = express();

// USE MIDDLEWARE
app.use(checkUserId);

// ROUTES
app.use("/api/profile/cart", cartRoutes);
app.use("/api/profile/order", orderRoutes);

// LISTEN ON 3000 PORT
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// EXPORT 
module.exports = app;