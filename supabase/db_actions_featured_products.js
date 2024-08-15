const serverClient = require("./server");

const { getProductsByIds, getProductById } = require("./db_actions_products");

const getFeaturedProducts = async () => {
  let headerFeaturedProduct;
  let featuredProducts;
  const supabase = serverClient();
  let { data: products, error } = await supabase
    .from("featured_products")
    .select(
      "featured_product_id, homepage_header, homepage_header_image, homepage_feature"
    );

  if (error) {
    return error;
  }

  if (products.length > 0) {
    if (products[0].homepage_header) {
      headerFeaturedProduct = await getProductById({
        id: products[0].homepage_header,
      });
      headerFeaturedProduct[0] = {
        ...headerFeaturedProduct[0],
        featured_images: products[0].homepage_header_image,
      };
    }
    if (products[0].homepage_feature.length > 0) {
      let pids = products[0].homepage_feature?.map((item) => item?.product_id);
      let featProducts = await getProductsByIds({
        ids: pids,
      });

      featuredProducts = featProducts.map((item, index) => {
        const featureObj = products[0].homepage_feature.find(
          (feat) => feat?.product_id === item.product_id
        );
        return {
          ...item,
          featured_images: featureObj?.featured_images,
          section_number: featureObj?.section_number,
        };
      });
    }
  }

  return {
    headerFeaturedProduct,
    featuredProducts,
  };
};

module.exports = {
  getFeaturedProducts,
};
