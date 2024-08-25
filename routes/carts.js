const express = require("express");
const router = express.Router();

const {
  getAllCart,
  getAllCartsByProfileId,
  getAllCartsByCartId,
  cartActions,
  removeItemFromCart,
} = require("../supabase/db_actions_cart");

// get all carts
router.get("/", async function (req, res) {
  const cartItems = await getAllCart();
  res.json(cartItems);
});

// get carts by userId
router.get("/user/:id", async function (req, res) {
  const cartItemsByProfileId = await getAllCartsByProfileId({
    profileId: req?.params.id,
  });
  res.json(cartItemsByProfileId);
});

// get carts by cartId
router.get("/items/:id", async function (req, res) {
  const getItemsByCartId = await getAllCartsByCartId({
    cartId: req?.params.id,
  });
  res.json(getItemsByCartId);
});

// creates cart, adds item to cart, update cart
router.post("/:id", async function (req, res) {
  const cartDbActions = await cartActions({
    profileId: req?.params.id,
    cartId: req?.body.cart_id,
    items: req?.body.items,
  });
  res.json(cartDbActions);
});

// delete item by itemId
router.delete("/item/:id", async function (req, res) {
  console.log({ req: req.params });
  const deleteItemFromCart = await removeItemFromCart({
    itemId: req?.params.id,
  });
  res.json(deleteItemFromCart);
});

module.exports = router;
