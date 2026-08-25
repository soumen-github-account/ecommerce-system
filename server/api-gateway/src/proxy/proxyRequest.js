// import axios from "axios";

// import services from "../config/services.js";
// import env from "../config/env.js";

// export default async function proxyRequest(req, res, service) {
//   try {
//     const target = services[service];

//     if (!target) {
//       return res.status(404).json({
//         success: false,
//         message: `Service '${service}' not found`,
//       });
//     }

//     const path = req.originalUrl.replace("/api/v1", "");
//     const url = target + path;

//     // ==========================================
//     // CHECK MULTIPART REQUEST
//     // ==========================================

//     const isMultipart = req.headers["content-type"]?.includes(
//       "multipart/form-data",
//     );

//     // ==========================================
//     // MULTIPART / FILE REQUEST
//     // ==========================================

//     if (isMultipart) {
//       const response = await axios({
//         method: req.method,

//         url,

//         // IMPORTANT:
//         // Forward original request stream
//         data: req,

//         params: req.query,

//         timeout: env.requestTimeout,

//         headers: {
//           authorization: req.headers.authorization,
//           "content-type": req.headers["content-type"],
//           "content-length": req.headers["content-length"],
//           "x-request-id": req.headers["x-request-id"],
//         },

//         maxBodyLength: Infinity,
//         maxContentLength: Infinity,
//       });

//       return res.status(response.status).json(response.data);
//     }

//     // ==========================================
//     // NORMAL JSON REQUEST
//     // ==========================================

//     const response = await axios({
//       method: req.method,

//       url,

//       data: req.body,

//       params: req.query,

//       timeout: env.requestTimeout,

//       headers: {
//         authorization: req.headers.authorization,

//         "content-type": req.headers["content-type"],

//         "x-request-id": req.headers["x-request-id"],
//         cookie: req.headers.cookie,
//       },
//     });

//     const setCookie = response.headers["set-cookie"];

//     if (setCookie) {
//       res.setHeader("set-cookie", setCookie);
//     }

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }

//     if (error.code === "ECONNABORTED") {
//       return res.status(504).json({
//         success: false,

//         message: "Gateway Timeout",
//       });
//     }

//     if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
//       return res.status(503).json({
//         success: false,

//         message: "Service Unavailable",
//       });
//     }

//     console.error("Proxy Error:", error);

//     return res.status(500).json({
//       success: false,

//       message: "Internal Server Error",
//     });
//   }
// }

import axios from "axios";

import services from "../config/services.js";
import env from "../config/env.js";

export default async function proxyRequest(req, res, service) {

    try {

        // ==========================================
        // TARGET SERVICE
        // ==========================================

        const target = services[service];

        if (!target) {

            return res.status(404).json({
                success: false,
                message: `Service '${service}' not found`,
            });

        }


        // ==========================================
        // BUILD PATH
        // ==========================================

        /*
         * IMPORTANT
         *
         * req.originalUrl contains:
         *
         * /api/v1/sellers/seller/orders?page=1&status=PACKED
         *
         * We DON'T want query string here.
         *
         * Query will be forwarded separately
         * using params: req.query
         */

        const path =
            req.path.replace("/api/v1", "");

        const url =
            `${target}${path}`;


        // ==========================================
        // DEBUG
        // ==========================================

        console.log(
            "[GATEWAY → SERVICE]",
            {
                service,
                method: req.method,
                path,
                url,
                query: req.query,
            }
        );


        // ==========================================
        // CHECK MULTIPART
        // ==========================================

        const isMultipart =
            req.headers["content-type"]
                ?.includes("multipart/form-data");


        // ==========================================
        // MULTIPART / FILE REQUEST
        // ==========================================

        if (isMultipart) {

            const response =
                await axios({

                    method: req.method,

                    url,

                    // Original request stream
                    data: req,

                    // Forward query parameters
                    params: req.query,

                    timeout:
                        env.requestTimeout,

                    headers: {

                        authorization:
                            req.headers.authorization,

                        "content-type":
                            req.headers["content-type"],

                        "content-length":
                            req.headers["content-length"],

                        "x-request-id":
                            req.headers["x-request-id"],

                        cookie:
                            req.headers.cookie,

                    },

                    maxBodyLength:
                        Infinity,

                    maxContentLength:
                        Infinity,

                });


            // --------------------------------------
            // Cookies
            // --------------------------------------

            const setCookie =
                response.headers["set-cookie"];

            if (setCookie) {

                res.setHeader(
                    "set-cookie",
                    setCookie
                );

            }


            return res
                .status(response.status)
                .json(response.data);

        }


        // ==========================================
        // NORMAL JSON REQUEST
        // ==========================================

        const response =
            await axios({

                method: req.method,

                url,

                // ----------------------------------
                // Request Body
                // ----------------------------------

                data:
                    req.body,

                // ----------------------------------
                // Query Parameters
                // ----------------------------------

                params:
                    req.query,

                timeout:
                    env.requestTimeout,

                headers: {

                    authorization:
                        req.headers.authorization,

                    "content-type":
                        req.headers["content-type"],

                    "x-request-id":
                        req.headers["x-request-id"],

                    cookie:
                        req.headers.cookie,

                },

            });


        // ==========================================
        // FORWARD COOKIES
        // ==========================================

        const setCookie =
            response.headers["set-cookie"];

        if (setCookie) {

            res.setHeader(
                "set-cookie",
                setCookie
            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res
            .status(response.status)
            .json(response.data);


    } catch (error) {

        // ==========================================
        // SERVICE RESPONSE ERROR
        // ==========================================

        if (error.response) {

            console.error(
                "[GATEWAY] SERVICE ERROR:",
                {
                    status:
                        error.response.status,

                    data:
                        error.response.data,

                    service,
                    method:
                        req.method,

                    url:
                        req.originalUrl,

                }
            );


            return res
                .status(
                    error.response.status
                )
                .json(
                    error.response.data
                );

        }


        // ==========================================
        // TIMEOUT
        // ==========================================

        if (
            error.code ===
                "ECONNABORTED" ||
            error.code ===
                "ETIMEDOUT"
        ) {

            return res.status(504).json({

                success: false,

                message:
                    "Gateway Timeout",

            });

        }


        // ==========================================
        // SERVICE UNAVAILABLE
        // ==========================================

        if (
            error.code ===
                "ECONNREFUSED" ||
            error.code ===
                "ENOTFOUND"
        ) {

            return res.status(503).json({

                success: false,

                message:
                    "Service Unavailable",

            });

        }


        // ==========================================
        // UNKNOWN ERROR
        // ==========================================

        console.error(
            "[GATEWAY] PROXY ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });
    }
}