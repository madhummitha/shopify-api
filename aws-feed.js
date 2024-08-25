const axios = require("axios");
const zlib = require("zlib");
const crypto = require("crypto");
const path = require("path");

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

const getFeedStatus = async (feedId) => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const response = await axios.get(
    `https://sellingpartnerapi-eu.amazon.com/feeds/2021-06-30/feeds/${feedId}`,
    { headers }
  );

  console.log(response.data);
};

// Step 1: Create a Feed Document
const init = async () => {
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
    return data;
  };

  const { feedDocumentId, url } = await createFeedDocument();

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

  // const feedJSONData = [
  //   {
  //     sku: "B0D7RY22F7",
  //     patches: [
  //       {
  //         op: "replace",
  //         path: "/attributes/price",
  //         value: {
  //           valueWithTax: {
  //             value: 267.89,
  //             currency: "AED",
  //           },
  //         },
  //       },
  //       {
  //         op: "replace",
  //         path: "/attributes/fulfillmentAvailability",
  //         value: [
  //           {
  //             fulfillmentChannelCode: "DEFAULT",
  //             quantity: 100,
  //             handlingTime: {
  //               minimumHours: 240,
  //               maximumHours: 480,
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  // const postFlatFileInventoryData = {
  //   header: {
  //     sellerId: "A1AOGB15LFPGLL",
  //     version: "2.0",
  //     issueLocale: "en_US",
  //   },
  //   messages: [
  //     {
  //       messageId: 1,
  //       sku: "B0D7RY22F7",
  //       operationType: "UPDATE",
  //       attributes: {
  //         purchasable_offer: [
  //           {
  //             currency: "AED",
  //             our_price: [{ schedule: [{ value_with_tax: 256 }] }],
  //             marketplace_id: "A2VIGQ35RCS4UG",
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       messageId: 2,
  //       sku: "B0D7RY22F7",
  //       operationType: "PATCH",
  //       patches: [
  //         {
  //           op: "replace",
  //           path: "/attributes/fulfillment_availability",
  //           value: [
  //             {
  //               fulfillment_channel_code: "DEFAULT",
  //               quantity: 378,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const feedContent = {
  //   header: {
  //     sellerId: "A1AOGB15LFPGLL",
  //     version: "2.0",
  //     issueLocale: "en_US",
  //   },
  //   messages: [
  //     {
  //       messageId: 1,
  //       sku: "B0D7RY22F7",
  //       operationType: "UPDATE",
  //       price: {
  //         sku: "B0D7RY22F7",
  //         standard: {
  //           currencyCode: "AED",
  //           amount: 566.99,
  //         },
  //       },
  //       inventory: {
  //         sku: "B0D7RY22F7",
  //         fulfillmentCenterCode: "DEFAULT",
  //         quantity: 278,
  //       },
  //     },
  //   ],
  // };

  const feedContent = {
    header: {
      sellerId: "A1AOGB15LFPGLL",
      version: "2.0",
      issueLocale: "en_US",
    },
    messages: [
      {
        messageId: 1,
        sku: "B0D7RY22F7",
        operationType: "PATCH",
        productType: "FLASH_CARD",
        patches: [
          {
            op: "replace",
            path: "/attributes/purchasable_offer",
            value: [
              {
                currency: "AED",
                our_price: [
                  {
                    schedule: [
                      {
                        value_with_tax: 45,
                      },
                    ],
                  },
                ],
                marketplace_id: "A2VIGQ35RCS4UG",
              },
            ],
          },
          {
            op: "replace",
            path: "/attributes/fulfillment_availability",
            value: [
              {
                fulfillment_channel_code: "DEFAULT",
                quantity: 178,
                handling_time: {
                  minimum_hours: 24,
                  maximum_hours: 48,
                },
              },
            ],
          },
        ],
      },
    ],
  };

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
      url,
      feedContent
      // JSON.stringify(feedJSONData)
      // { headers }
    );

    // console.log(response);
    console.log(response.data);
  };

  uploadFeedData();

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
        inputFeedDocumentId: feedDocumentId,
      },
      { headers }
    );

    console.log(response.data);
    return response.data;
  };

  const { feedId } = await createFeed();
  // let feedId = 50338019960;

  // Step 5: Get Feed Status
  getFeedStatus(feedId);
};

const downloadFeedDocument = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const decompressedData = zlib.gunzipSync(response.data);
  console.log(decompressedData.toString());
};

const getResultDocument = async () => {
  const accessToken = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": new Date().toISOString(),
  };

  const resultDocumentId =
    "amzn1.tortuga.4.eu.558455ba-35cb-4d7f-afc5-4894138fd108.TQ7ULAXKR6KYF";

  const response = await axios.get(
    `https://sellingpartnerapi-eu.amazon.com/feeds/2021-06-30/documents/${resultDocumentId}`,
    { headers }
  );

  console.log(response.data);
  // Response.data example
  /*
  {
  compressionAlgorithm: 'GZIP',
  feedDocumentId: 'amzn1.tortuga.4.eu.0090d6e6-06e9-45bc-ab6a-cb13f5a9f290.T2RT15DO0L0R12',
  url: 'https://tortuga-prod-eu.s3-eu-west-1.amazonaws.com/af16349c-642c-475e-abd4-5c001a918fa8.amzn1.tortuga.4.eu.T2RT15DO0L0R12?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240825T203400Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIAX2ZVOZFBD26QHCVX%2F20240825%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=5135a379382faca6d94fb40065b17f427d828c0206ba30d1ed655ce967168774'
}
  */

  downloadFeedDocument(response.data.url);
};

init();
// getFeedStatus(50346019961);
// getResultDocument();
