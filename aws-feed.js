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

// Step 1: Create a Feed Document

const createFeedDocument = async () => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const { data } = await axios.post(
    "https://sellingpartnerapi-eu.amazon.com/feeds/2021-06-30/documents",
    {
      contentType: "application/json",
    },
    { headers }
  );

  console.log(data);
};

// createFeedDocument();

// Step 2: Create a Feed Document

// const feedJSONData = {
//   header: {
//     sellerId: "A1AOGB15LFPGLL",
//     version: "2.0",
//     issueLocale: "en_US",
//   },
//   messages: [
//     {
//       messageId: 1,
//       sku: "B0D7RY22F7",
//       attributes: {
//         price: {
//           valueWithTax: {
//             value: 267.89,
//             currency: "AED",
//           },
//         },
//       },
//       fulfillmentAvailability: [
//         {
//           quantity: 100,
//           handlingTime: {
//             minimumHours: 96,
//             maximumHours: 124,
//           },
//         },
//       ],
//     },
//   ],
// };

const feedJSONData = [
  {
    sku: "B0D7RY22F7",
    patches: [
      {
        op: "replace",
        path: "/attributes/price",
        value: {
          valueWithTax: {
            value: 267.89,
            currency: "AED",
          },
        },
      },
      {
        op: "replace",
        path: "/attributes/fulfillmentAvailability",
        value: [
          {
            fulfillmentChannelCode: "DEFAULT",
            quantity: 100,
            handlingTime: {
              minimumHours: 240,
              maximumHours: 480,
            },
          },
        ],
      },
    ],
  },
];

// Step 3: Upload Feed Data to URL got in Step 1
const uploadFeedData = async () => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const response = await axios.put(
    "https://tortuga-prod-eu.s3-eu-west-1.amazonaws.com/06b52f83-e04a-4b32-a17e-591140cee7c8.amzn1.tortuga.4.eu.TPUK5BZRNUNU2?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240819T180157Z&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Expires=300&X-Amz-Credential=AKIAX2ZVOZFBIPHKZ57H%2F20240819%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=4ecd9aff29e109196d71738b94807d386fd35ac6f5c5e6c83f725838cee05a47",
    feedJSONData
    // JSON.stringify(feedJSONData)
    // { headers }
  );

  console.log(response);
  console.log(response.data);
};

// uploadFeedData();

// Step 4: Create a Feed
const createFeed = async () => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const response = await axios.post(
    "https://sellingpartnerapi-eu.amazon.com/feeds/2021-06-30/feeds",
    {
      feedType: "JSON_LISTINGS_FEED",
      marketplaceIds: ["A2VIGQ35RCS4UG"],
      inputFeedDocumentId:
        "amzn1.tortuga.4.eu.06b52f83-e04a-4b32-a17e-591140cee7c8.TPUK5BZRNUNU2",
    },
    { headers }
  );

  console.log(response.data);
};

// createFeed();

// Step 5: Get Feed Status
const getFeedStatus = async () => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const response = await axios.get(
    "https://sellingpartnerapi-eu.amazon.com/feeds/2021-06-30/feeds/50332019954",
    { headers }
  );

  console.log(response.data);
};

getFeedStatus();
