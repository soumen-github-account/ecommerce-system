import QRCode from "qrcode";
import fs from "fs/promises";
import path from "path";

export const generateQRCode = async (shipmentData) => {

    //------------------------------------
    // Create Folder
    //------------------------------------

    const outputDir = path.join(
        process.cwd(),
        "uploads",
        "qrcodes"
    );

    await fs.mkdir(outputDir, {
        recursive: true
    });

    //------------------------------------
    // File
    //------------------------------------

    const fileName =
        `${shipmentData.trackingNumber}.png`;

    const filePath =
        path.join(outputDir, fileName);

    //------------------------------------
    // QR Data
    //------------------------------------

    const qrData = JSON.stringify({

        shipmentNumber:
            shipmentData.shipmentNumber,

        trackingNumber:
            shipmentData.trackingNumber,

        orderNumber:
            shipmentData.orderNumber,

        seller:
            shipmentData.seller,

        generatedAt:
            new Date()

    });

    //------------------------------------
    // Generate QR
    //------------------------------------

    await QRCode.toFile(

        filePath,

        qrData,

        {

            errorCorrectionLevel: "H",

            width: 350,

            margin: 2

        }

    );

    //------------------------------------
    // Return
    //------------------------------------

    return {

        fileName,

        filePath

    };

};