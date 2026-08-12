// import axios from "axios";

// import services from "../config/services.js";

// import env from "../config/env.js";

// export default async function proxyRequest(req, res, service) {

//     try {
//         const target = services[service];
//         if (!target) {
//             return res.status(404).json({
//                 success: false,
//                 message: `Service '${service}' not found`
//             });
//         }

//         const path = req.originalUrl.replace("/api/v1", "");
//         const url = target + path;
//         const response = await axios({
//             method: req.method,
//             url,
//             data: req.body,
//             params: req.query,
//             timeout: env.requestTimeout,
//             headers: {
//                 authorization: req.headers.authorization,
//                 "content-type": req.headers["content-type"],
//                 "x-request-id": req.headers["x-request-id"]
//             }
//         });
//         return res.status(response.status).json(response.data);
//     }

//     catch (error) {
//         if (error.response) {
//             return res
//                 .status(error.response.status)
//                 .json(error.response.data);
//         }

//         if (error.code === "ECONNABORTED"){
//             return res.status(504).json({
//                 success: false,
//                 message: "Gateway Timeout"
//             });
//         }
//         if (
//             error.code === "ECONNREFUSED" ||
//             error.code === "ENOTFOUND"
//         ) {
//             return res.status(503).json({
//                 success: false,
//                 message: "Service Unavailable"
//             });
//         }

//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }

// }

import axios from "axios";

import services from "../config/services.js";
import env from "../config/env.js";

export default async function proxyRequest(req, res, service) {
  try {
    const target = services[service];

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `Service '${service}' not found`,
      });
    }

    const path = req.originalUrl.replace("/api/v1", "");
    const url = target + path;

    // ==========================================
    // CHECK MULTIPART REQUEST
    // ==========================================

    const isMultipart = req.headers["content-type"]?.includes(
      "multipart/form-data",
    );

    // ==========================================
    // MULTIPART / FILE REQUEST
    // ==========================================

    if (isMultipart) {
      const response = await axios({
        method: req.method,

        url,

        // IMPORTANT:
        // Forward original request stream
        data: req,

        params: req.query,

        timeout: env.requestTimeout,

        headers: {
          authorization: req.headers.authorization,
          "content-type": req.headers["content-type"],
          "content-length": req.headers["content-length"],
          "x-request-id": req.headers["x-request-id"],
        },

        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      return res.status(response.status).json(response.data);
    }

    // ==========================================
    // NORMAL JSON REQUEST
    // ==========================================

    const response = await axios({
      method: req.method,

      url,

      data: req.body,

      params: req.query,

      timeout: env.requestTimeout,

      headers: {
        authorization: req.headers.authorization,

        "content-type": req.headers["content-type"],

        "x-request-id": req.headers["x-request-id"],
        cookie: req.headers.cookie,
      },
    });

    const setCookie = response.headers["set-cookie"];

    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,

        message: "Gateway Timeout",
      });
    }

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,

        message: "Service Unavailable",
      });
    }

    console.error("Proxy Error:", error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
}
