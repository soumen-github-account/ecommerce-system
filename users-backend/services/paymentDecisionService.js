import { createGatewayOrder } from "./cardService.js";
import { processCOD } from "./codService.js";

export const processPaymentMethod =
    async ({
        paymentMethod,
        amount,
        sessionId,
        orderId
    }) => {

        if (
            paymentMethod === "COD"
        ) {

            return await processCOD(
                orderId
            );
        }

        const gatewayOrder =
            await createGatewayOrder({

                amount,

                receipt: sessionId
            });

        return {

            gatewayOrderId:
                gatewayOrder.id,

            amount:
                gatewayOrder.amount,

            currency:
                gatewayOrder.currency
        };
    };