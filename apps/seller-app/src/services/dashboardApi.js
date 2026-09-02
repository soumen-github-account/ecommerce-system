// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL

// /**
//  * Get seller dashboard data
//  *
//  * @param {Object} params
//  * @param {"7d"|"30d"|"90d"|"1y"} params.range
//  */

// export const getSellerDashboard = async ({ range = "7d" } = {}) => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/api/v1/sellers/dashboard`,
//       {
//         params: {
//           range,
//         },
//         withCredentials: true,
//       }
//     );

//     console.log(response.data)

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Seller dashboard API error:",
//       error?.response?.data || error.message
//     );

//     throw error;
//   }
// };

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


/**
 * Get seller dashboard data
 */

export const getSellerDashboard = async (
  { range = "7d" } = {}
) => {

  try {
    const response = await axios.get(
      `${API_URL}/api/v1/sellers/dashboard`,
      {
        params: {
          range,
        },

        withCredentials: true,
      }
    );


    console.log(
      "SELLER DASHBOARD API:",
      response.data
    );


    return response.data;

  } catch (error) {

    console.error(
      "Seller dashboard API error:",
      error?.response?.data || error.message
    );

    throw error;

  }

};