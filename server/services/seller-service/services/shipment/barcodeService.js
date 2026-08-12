import bwipjs from "bwip-js";
import fs from "fs/promises";
import path from "path";

export const generateBarcode = async (trackingNumber) => {

    //------------------------------------
    // Create Folder
    //------------------------------------

    const outputDir = path.join(
        process.cwd(),
        "uploads",
        "barcodes"
    );

    await fs.mkdir(outputDir, {
        recursive: true
    });

    //------------------------------------
    // File Name
    //------------------------------------

    const fileName =
        `${trackingNumber}.png`;

    const filePath = path.join(
        outputDir,
        fileName
    );

    //------------------------------------
    // Generate Barcode
    //------------------------------------

    const png = await bwipjs.toBuffer({

        bcid: "code128",

        text: trackingNumber,

        scale: 3,

        height: 12,

        includetext: true,

        textxalign: "center"

    });

    //------------------------------------
    // Save
    //------------------------------------

    await fs.writeFile(
        filePath,
        png
    );

    //------------------------------------
    // Return
    //------------------------------------

    return {

        fileName,

        filePath

    };

};