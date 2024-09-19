const serverClient = require("./server");

const getAllOrders = async () => {
  const supabase = serverClient();

  let { data: orders, error } = await supabase
    .from("orders")
    .select(
      "order_id, profile_id,order_fees, order_discounts, order_items_total,order_grand_total, order_items!inner(product_id, order_item_qty, order_item_price)"
    );

  if (error) {
    console.error({ error });
    return error;
  }
  return orders;
};

const getOrderByOrderId = async ({ orderId }) => {
  const supabase = serverClient();

  let { data: orders, error } = await supabase
    .from("orders")
    .select(
      "order_id, profile_id,order_fees, order_discounts, order_items_total,order_grand_total, order_items!inner(product_id, order_item_qty, order_item_price)"
    )
    .eq("order_id", orderId);

  if (error) {
    return error;
  }
  return orders;
};

const getAllOrdersByProfileId = async ({ profileId }) => {
  const supabase = serverClient();

  let { data, error } = await supabase
    .from("orders")
    .select(
      "order_id, profile_id,order_fees, order_discounts, order_items_total,order_grand_total, order_items!inner(product_id, order_item_qty, order_item_price)"
    )
    .eq("profile_id", profileId);

  if (error) {
    return error;
  }

  return data;
};

const ordersActions = async ({ profileId, cartData, orderDetails }) => {
  const orderTableDetails = await createOrder({ profileId, orderDetails });
  if (orderTableDetails[0]?.order_id !== null) {
    await createOrderItems({
      order_id: orderTableDetails[0].order_id,
      cartData,
    });
  }
  return orderTableDetails;
};

const createOrder = async ({ profileId, orderDetails }) => {
  const supabase = serverClient();

  /**
   * 1. Create order
   *    profile_id, order_fees, order_discounts,
   *    order_items_total, order_grand_total, payment_details
   */
  try {
    const pymtDetails =
      orderDetails.paymentmethod === "cod"
        ? { type: "cod" }
        : { type: "emoney", emoney_number: orderDetails.emoneyNumber };

    const orderTableDetails = {
      profile_id: profileId,
      order_fees: orderDetails.order_fees,
      order_discounts: { discount: 0 },
      order_items_total: orderDetails.order_items_total,
      order_grand_total: orderDetails.order_grand_total,
      payment_details: pymtDetails,
    };

    const { data: order, error } = await supabase
      .from("orders")
      .insert([orderTableDetails])
      .select();

    if (error) {
      console.error({ error });
      return error;
    }

    return order;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const createOrderItems = async ({ order_id, cartData }) => {
  const supabase = serverClient();
  /**
   * Create order items
   * order_id, product_id, order_item_qty, order_item_price,
   */
  const orderItems =
    cartData.length > 0
      ? cartData.map((item) => {
          return {
            order_id: order_id,
            product_id: item.product_id,
            order_item_qty: item.cart_item_qty,
            order_item_price: item.cart_item_price,
          };
        })
      : [];
  if (orderItems.length > 0) {
    const { data, error } = await supabase
      .from("order_items")
      .upsert(orderItems);
  }
};

module.exports = {
  getAllOrders,
  getOrderByOrderId,
  getAllOrdersByProfileId,
  ordersActions,
};
