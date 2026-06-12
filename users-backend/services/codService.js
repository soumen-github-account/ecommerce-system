import { Order } from "../models/OrderModel.js";

export const processCOD = async (orderId) => {

    await Order.findByIdAndUpdate(
        orderId,
        {
            paymentStatus:
                "PENDING",

            orderStatus:
                "CONFIRMED"
        }
    );

        return {
            cod: true
        };
    };