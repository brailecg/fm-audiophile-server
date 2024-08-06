const serverClient = require("./server");

const getProducts = async () => {
  const supabase = serverClient();

  let { data: products, error } = await supabase
    .from("products")
    .select("product_id, name, description, summary");

  if (error) {
    return error;
  }
  return products;
};

const getProductById = async ({ id }) => {
  const supabase = serverClient();

  let { data: product, error } = await supabase
    .from("products")
    .select("product_id, name, description, summary")
    .eq("product_id", id);
  if (error) {
    return error;
  }
  return product;
};

const insertProduct = async ({ item }) => {
  const supabase = serverClient();

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: item?.name,
        description: item?.description,
        summary: item?.summary,
      },
    ])
    .select();

  if (error) {
    return error;
  }

  return data;
};

const updateProduct = async ({ id, item }) => {
  const supabase = serverClient();

  const { data, error } = await supabase
    .from("products")
    .update(item)
    .eq("product_id", id)
    .select();

  if (error) {
    return error;
  }

  return data;
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
  insertProduct,
  updateProduct,
  deleteProduct,
};
