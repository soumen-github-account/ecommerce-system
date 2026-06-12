import crypto from "crypto"

export const generateSessionId = () => {

    const random =
        crypto.randomBytes(6)
            .toString("hex")
            .toUpperCase();

    return `PAY_${Date.now()}_${random}`;
};