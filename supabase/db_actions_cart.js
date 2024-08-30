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
      "cart_id, profile_id, cart_items!inner(cart_item_id, cart_id, product_id, cart_item_qty, cart_item_price, products!inner(product_images, name))"
    )
    .eq("profile_id", profileId);
  if (error) {
    return error;
  }

  return data;
};

// insert or update cart and cart_items
const cartActions = async ({ profileId, cartId, items }) => {
  // check if cart for this profile exists, then just update
  // check if the item has a cart_id, then update

  let itemsToInsert = [];
  let itemsToUpsert = [];

  let cartUpserted = [];
  let cartCreated = [];
  if (cartId !== null) {
    // there's an existing cart
    items.forEach((item) => {
      if (item?.cart_item_id) {
        //upsert
        itemsToUpsert = [...itemsToUpsert, item];
      } else {
        // insert
        itemsToInsert = [...itemsToInsert, item];
      }
    });

    cartUpserted = await updateCartItems({
      profileId,
      itemsToInsert,
      itemsToUpsert,
    });
  } else {
    cartCreated = await createCart({ profileId, items });
  }

  return { cartUpserted, cartCreated };
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

const updateCartItems = async ({ profileId, itemsToInsert, itemsToUpsert }) => {
  const supabase = serverClient();

  if (itemsToInsert.length > 0) {
    const itemsAdjusted = itemsToInsert.map((item) => {
      return {
        cart_id: item.cart_id,
        product_id: item.product_id,
        cart_item_qty: item.cart_item_qty,
        cart_item_price: item.cart_item_price,
      };
    });

    const { data: updatedInsert, error } = await supabase
      .from("cart_items")
      .insert(itemsAdjusted)
      .select();
  }
  if (itemsToUpsert.length > 0) {
    const itemsToUpsertAdjusted = itemsToUpsert.map((item) => {
      return {
        cart_item_id: item.cart_item_id,
        cart_id: item.cart_id,
        product_id: item.product_id,
        cart_item_qty: item.cart_item_qty,
        cart_item_price: item.cart_item_price,
      };
    });

    const { data: updatedUpsert, error } = await supabase
      .from("cart_items")
      .upsert(itemsToUpsertAdjusted)
      .select();
  }
  return { response: "updated" };
};
module.exports = {
  getAllCart,
  getAllCartsByCartId,
  getAllCartsByProfileId,
  cartActions,
  removeItemFromCart,
};
