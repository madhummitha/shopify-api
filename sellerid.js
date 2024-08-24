const axios = require("axios");

async function getAccessToken() {
  const tokenUrl = "https://api.amazon.com/auth/o2/token";
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;

  try {
    const response = await axios.post(tokenUrl, {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// async function getSellerId() {
//   const accessToken = await getAccessToken();
//   const url =
//     "https://sellingpartnerapi-eu.amazon.com/sellers/v1/marketplaceParticipations";

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//     "x-amz-access-token": accessToken,
//     "x-amz-date": new Date().toISOString(),
//   };

//   try {
//     const response = await axios.get(url, { headers });
//     const sellerId = response.data.payload[0].sellerId;
//     console.log("Your Seller ID:", sellerId);
//     return sellerId;
//   } catch (error) {
//     console.error("Error fetching seller ID:", error);
//   }
// }

async function getSellerId() {
  const accessToken = await getAccessToken(); // Assume getAccessToken() is defined
  const url =
    "https://sellingpartnerapi-eu.amazon.com/sellers/v1/marketplaceParticipations";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  try {
    const response = await axios.get(url, { headers });

    // Log the entire response to inspect the structure
    console.log("Response data:", JSON.stringify(response.data, null, 2));

    if (
      response.data &&
      response.data.payload &&
      response.data.payload.length > 0
    ) {
      const sellerId = response.data.payload[0].sellerId;
      console.log("Your Seller ID:", sellerId);
      return sellerId;
    } else {
      console.error("Seller ID not found in response.");
      return undefined;
    }
  } catch (error) {
    console.error(
      "Error fetching seller ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

getSellerId();
