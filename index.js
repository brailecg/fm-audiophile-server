const express = require("express");
const cors = require("cors");

const homeRouter = require("./routes/index");
const productsRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", homeRouter);
app.use("/products", productsRouter);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
