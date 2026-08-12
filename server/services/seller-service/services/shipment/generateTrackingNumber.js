import crypto from "crypto";

export const generateTrackingNumber = () => {

    const year =
        new Date().getFullYear();

    const random =
        crypto.randomBytes(5)
        .toString("hex")
        .toUpperCase();

    return `CBTRK${year}${random}`;

};