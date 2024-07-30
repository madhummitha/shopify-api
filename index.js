const axios = require("axios"); // Make sure to install node-fetch if you are running this in a Node.js environment

const shopUrl = process.env.SHOPIFY_SHOP_NAME;
const apiVersion = "2024-07";
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

async function getProducts() {
  let products = [];
  let url = `${shopUrl}/admin/api/${apiVersion}/products.json?limit=2`;

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  while (url) {
    console.log("calling API");
    const { data: responseData, headers: responseHeaders } = await axios.get(
      url,
      { headers }
    );
    products = products.concat(responseData.products || []);
    console.log("headers", responseHeaders.get("Link"));

    const linkHeader = responseHeaders.get("Link");
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const nextLink = linkHeader
        .split(",")
        .find((s) => s.includes('rel="next"'));
      if (nextLink) {
        url = nextLink.split(";")[0].replace("<", "").replace(">", "").trim();
      } else {
        url = null;
      }
    } else {
      url = null;
    }
  }

  return products;
}

getProducts()
  .then((allProducts) => {
    console.log(
      `Retrieved ${allProducts.length} products`,
      JSON.stringify(allProducts, null, 2)
    );
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
