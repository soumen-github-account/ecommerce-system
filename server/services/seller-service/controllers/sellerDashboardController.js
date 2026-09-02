// import { getSellerDashboard } from "../services/sellerDashboardService.js";

// export const sellerDashboardController = async (
//     req,
//     res
// ) => {
//     try {
//         /**
//          * Seller ID should come from authentication
//          *
//          * Example:
//          * req.seller._id
//          */

//         const sellerId =
//             req.seller?._id ||
//             req.seller?.id ||
//             req.sellerId;

//         if (!sellerId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Seller authentication required",
//             });
//         }

//         const {
//             from,
//             to,
//         } = req.query;

//         const dashboard =
//             await getSellerDashboard({
//                 sellerId,
//                 from,
//                 to,
//             });

//         return res.status(200).json({
//             success: true,

//             data: dashboard,
//         });
//     } catch (error) {
//         console.error(
//             "Seller Dashboard Controller Error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Failed to load seller dashboard",
//             error: error.message,
//         });
//     }
// };

import { getSellerDashboard } from "../services/sellerDashboardService.js";

const getDateRange = (range = "7d") => {

    const to = new Date();
    const from = new Date();

    switch (range) {

        case "7d":
            from.setDate(to.getDate() - 6);
            break;

        case "30d":
            from.setDate(to.getDate() - 29);
            break;

        case "90d":
            from.setDate(to.getDate() - 89);
            break;

        case "1y":
            from.setFullYear(to.getFullYear() - 1);
            break;

        default:
            from.setDate(to.getDate() - 6);
    }

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    return {
        from,
        to,
    };
};


export const sellerDashboardController = async (req, res) => {

    try {

        const sellerId =
            req.seller?._id ||
            req.seller?.id ||
            req.sellerId;

        if (!sellerId) {

            return res.status(401).json({
                success: false,
                message: "Seller authentication required",
            });

        }

        const {
            range = "7d",
        } = req.query;

        const {
            from,
            to,
        } = getDateRange(range);

        const dashboard =
            await getSellerDashboard({
                sellerId,
                from: from.toISOString(),
                to: to.toISOString(),
            });

        return res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (error) {

        console.error(
            "[SELLER DASHBOARD ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load seller dashboard",
        });

    }

};

