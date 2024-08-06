const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
} = require("../supabase/db_actions");

router.get("/", async function (req, res, next) {
  const products = await getProducts();
  res.json(products);
});

router.get("/:id", async function (req, res, next) {
  const productById = await getProductById({
    id: req?.params.id,
  });
  res.json(productById);
});

router.post("/", async function (req, res, next) {
  const products = await insertProduct({ item: req?.body });

  res.json(products);
});

router.put("/:id", async function (req, res, next) {
  const productUpdate = await updateProduct({
    id: req?.params.id,
    item: req?.body,
  });
  res.json(productUpdate);
});

router.delete("/:id", async function (req, res, next) {
  const productDelete = await deleteProduct({
    id: req?.params.id,
  });
  res.json(productDelete);
});

module.exports = router;
