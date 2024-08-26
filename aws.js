const axios = require("axios");
const crypto = require("crypto");

// Function to get the access token
async function getAccessToken() {
  const response = await axios.post("https://api.amazon.com/auth/o2/token", {
    grant_type: "refresh_token",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
  });
  return response.data.access_token;
}

// Function to list a product
async function listProduct() {
  const accessToken = await getAccessToken();

  const marketplaceIds = ["A2VIGQ35RCS4UG"];
  const url = `https://sellingpartnerapi-eu.amazon.com/listings/2021-08-01/items/A1AOGB15LFPGLL/B0D7RY22F7?marketplaceIds=${marketplaceIds}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error listing product:", error.response.data);
  }
}

async function getProductDefinition() {
  const accessToken = await getAccessToken();

  const marketplaceIds = ["A2VIGQ35RCS4UG"];
  const url = `https://sellingpartnerapi-eu.amazon.com/definitions/2020-09-01/productTypes/FLASH_CARD?marketplaceIds=${marketplaceIds}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error listing product:", error.response.data);
  }
}

// listProduct();
getProductDefinition();
