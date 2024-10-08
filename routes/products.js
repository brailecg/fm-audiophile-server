const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  insertProduct,
  updateProduct,
  deleteProduct,
} = require("../supabase/db_actions_products");

function validateUUID(req, res, next) {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(req.params.id)) {
    next(); // Continue to the ID handler
  } else {
    next("route");
  }
}

router.get("/", async function (req, res, next) {
  const products = await getProducts();
  res.json(products);
});

router.get("/:id", validateUUID, async function (req, res, next) {
  const productById = await getProductById({
    id: req?.params.id,
  });
  res.json(productById);
});

router.get("/:category", async function (req, res, next) {
  const productsByCategory = await getProductsByCategory({
    category: req?.params.category,
  });

  res.json(productsByCategory);
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
