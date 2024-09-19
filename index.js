const express = require("express");
const cors = require("cors");

const homeRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const featuredProductsRouter = require("./routes/featured_products");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", homeRouter);
app.use("/products", productsRouter);
app.use("/featured_products", featuredProductsRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
