const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderByOrderId,
  getAllOrdersByProfileId,
  ordersActions,
} = require("../supabase/db_actions_orders");

//get all orders
router.get("/", async function (req, res) {
  const orders = await getAllOrders();
  res.json(orders);
});

// create order and order items
router.post("/:profileId", async function (req, res) {
  const orderDbActions = await ordersActions({
    profileId: req.params.profileId,
    cartData: req.body.cartData,
    orderDetails: req.body.orderDetails,
  });

  res.json(orderDbActions);
});
module.exports = router;
