const serverClient = require("./server");

const getAllCart = async () => {
  const supabase = serverClient();

  let { data: carts, error } = await supabase
    .from("cart")
    .select(
      "cart_id, profile_id, cart_items!inner(cart_id, product_id, cart_item_qty, cart_item_price)"
    );

  if (error) {
    return error;
  }
  return carts;
};

const getAllCartsByCartId = async ({ cartId }) => {
  const supabase = serverClient();

  let { data, error } = await supabase
    .from("cart")
    .select(
      "cart_id, profile_id, cart_items!inner(cart_id, product_id, cart_item_qty, cart_item_price)"
    )
    .eq("cart_id", cartId);
  if (error) {
    return error;
  }

  return data;
};

const getAllCartsByProfileId = async ({ profileId }) => {
  const supabase = serverClient();

  let { data, error } = await supabase
    .from("cart")
    .select(
      "cart_id, profile_id, cart_items!inner(cart_id, product_id, cart_item_qty, cart_item_price)"
    )
    .eq("profile_id", profileId);
  if (error) {
    return error;
  }

  return data;
};

// insert or update cart and cart_items
const cartActions = async ({ profileId, cartId, items }) => {
  const supabase = serverClient();

  // check if cart for this profile exists, then just update
  // check if the item has a cart_id, then update

  let itemsToInsert = [];
  let itemsToUpsert = [];

  if (cartId !== null) {
    // there's an existing cart
    items.forEach((item) => {
      if (item?.cart_item_id === null) {
        // insert
        itemsToInsert = [...itemsToInsert, item];
      } else {
        //upsert
        itemsToUpsert = [...itemsToUpsert, item];
      }
    });
  } else {
    const cartCreated = await createCart({ profileId, items });
  }

  return { itemsToUpsert, itemsToInsert };
};

const createCart = async ({ profileId, items }) => {
  const supabase = serverClient();

  const { data: cart, error } = await supabase
    .from("cart")
    .upsert(
      {
        profile_id: profileId,
      },
      { onConflict: "profile_id" }
    )
    .select();

  if (error) {
    return error;
  }
  console.log({ cart });
  console.log({ items });
  if (items !== null && items.length > 0) {
    const cartId = cart[0]?.cart_id;
    let itemstToInsert = [];
    items.forEach((item) => {
      itemstToInsert = [
        ...itemstToInsert,
        {
          product_id: item?.product_id,
          cart_item_qty: item?.cart_item_qty,
          cart_item_price: item?.cart_item_price,
          cart_id: cartId,
        },
      ];
    });
    if (itemstToInsert.length > 0) {
      console.log({ itemstToInsert });
      const { data: cartItems, error: cartItemsError } = await supabase
        .from("cart_items")
        .upsert(itemstToInsert, { onConflict: "product_id, cart_id" });
    }
  }
  return cart;
};

const removeItemFromCart = async ({ itemId }) => {
  const supabase = serverClient();
  let { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_item_id", itemId);

  if (error) {
    console.log({ error });
    return error.message;
  }
  return "success";
};

module.exports = {
  getAllCart,
  getAllCartsByCartId,
  getAllCartsByProfileId,
  cartActions,
  removeItemFromCart,
};
