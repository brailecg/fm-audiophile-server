const serverClient = require("./server");

const getProducts = async () => {
  const supabase = serverClient();

  let { data: products, error } = await supabase
    .from("products")
    .select(
      "product_id, name, description, summary, product_images, gallery_images, category_id, in_the_box, highlight, is_new_product, categories(category_name), products_skus(product_qty, product_price, product_sku) "
    );

  if (error) {
    return error;
  }
  return products;
};

const getProductsByCategory = async ({ category }) => {
  const supabase = serverClient();
  let { data: products, error } = await supabase
    .from("products")
    .select(
      "product_id, name, description, summary, product_images, gallery_images, category_id, in_the_box, highlight, is_new_product, categories!inner(category_name), products_skus(product_qty, product_price, product_sku) "
    )
    .eq("categories.category_name", category.toUpperCase());
  if (error) {
    return error;
  }

  return products;
};

const getProductById = async ({ id }) => {
  const supabase = serverClient();

  let { data: product, error } = await supabase
    .from("products")
    .select(
      "product_id, name, description, summary, product_images, gallery_images, category_id, in_the_box, highlight, is_new_product, categories!inner(category_name), products_skus(product_qty, product_price, product_sku) "
    )
    .eq("product_id", id);
  if (error) {
    return error;
  }
  return product;
};

const getProductsByIds = async ({ ids }) => {
  const supabase = serverClient();

  let { data: product, error } = await supabase
    .from("products")
    .select(
      "product_id, name, description, summary, product_images, gallery_images, category_id, in_the_box, highlight, is_new_product, categories!inner(category_name), products_skus(product_qty, product_price, product_sku) "
    )
    .in("product_id", ids);
  if (error) {
    return error;
  }
  return product;
};

const insertProduct = async ({ item }) => {
  // TODO: check here also for serverside the required inputs
  // name, category_id, price, sku
  const supabase = serverClient();

  const { data, error, status } = await supabase
    .from("products")
    .insert([
      {
        name: item?.name,
        description: item?.description,
        summary: item?.summary,
        in_the_box: item?.in_the_box,
        category_id: item?.category_id,
        product_images: item?.product_images,
        is_new_product: item?.is_new_product,
        highlight: item?.highlight,
      },
    ])
    .select();

  if (error || status !== 201) {
    throw new Error("insert Product error");
  }

  const productSku = await insertProductSku({
    item: {
      ...item,
      product_id: data[0]?.product_id,
    },
  });
  if (productSku !== 201) {
    throw new Error("Sku Insert error");
  }

  return data;
};

const insertProductSku = async ({ item }) => {
  const supabase = serverClient();

  const { error, status } = await supabase.from("products_skus").insert([
    {
      product_id: item?.product_id,
      product_price: item?.product_price,
      product_qty: item?.product_qty,
      product_sku: item?.product_sku,
    },
  ]);

  if (error) {
    return error;
  }
  return status;
};

const updateProduct = async ({ id, item }) => {
  const supabase = serverClient();

  if (item.product) {
    const { error } = await supabase
      .from("products")
      .update(item.product)
      .eq("product_id", id)
      .select();

    if (error) {
      return error;
    }
  }

  if (item.sku) {
    const updateSku = await updateProductSku({ id, item: item.sku });
    if (updateSku !== 200 && updateSku !== 204 && updateSku !== 201) {
      throw new Error("sku Update error");
    }
  }
};

const updateProductSku = async ({ id, item }) => {
  item = { ...item, product_id: id };

  const supabase = serverClient();

  const { error, status } = await supabase
    .from("products_skus")
    .upsert(item, { onConflict: "product_id" });

  if (error) {
    return 500;
  }
  console.log({ status });
  return status;
};

const deleteProduct = async ({ id }) => {
  const supabase = serverClient();

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", id)
    .select();

  if (error) {
    return error;
  }

  return data;
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds,
  getProductsByCategory,
  insertProduct,
  updateProduct,
  deleteProduct,
};
