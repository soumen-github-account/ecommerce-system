import { razorpay } from "../config/razorpay.js";

export const createGatewayOrder =
    async ({
        amount,
        receipt
    }) => {

        const order =
            await razorpay.orders.create({

                amount:
                    Math.round(
                        amount * 100
                    ),

                currency: "INR",

                receipt
            });

        return order;
    };