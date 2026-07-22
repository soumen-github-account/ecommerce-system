import PDFDocument from "pdfkit";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const generateShippingLabel = async (
    shipment,
    seller,
    order,
    barcodePath,
    qrPath
) => {

    //------------------------------------
    // Folder
    //------------------------------------

    const outputDir = path.join(
        process.cwd(),
        "uploads",
        "shipping-labels"
    );

    await fsPromises.mkdir(outputDir, {
        recursive: true
    });

    //------------------------------------
    // File
    //------------------------------------

    const fileName =
        `${shipment.shipmentNumber}.pdf`;

    const filePath =
        path.join(outputDir, fileName);

    //------------------------------------
    // PDF
    //------------------------------------

    const doc = new PDFDocument({

        size: "A6",

        margin: 20

    });

    const stream =
        fs.createWriteStream(filePath);

    doc.pipe(stream);

    //------------------------------------
    // Header
    //------------------------------------

    doc
        .fontSize(18)
        .text("CITYBASKET", {
            align: "center"
        });

    doc
        .fontSize(12)
        .text("Shipping Label", {
            align: "center"
        });

    doc.moveDown();

    //------------------------------------
    // Tracking
    //------------------------------------

    doc.fontSize(10);

    doc.text(
        `Tracking Number : ${shipment.trackingNumber}`
    );

    doc.text(
        `Shipment Number : ${shipment.shipmentNumber}`
    );

    doc.text(
        `Order Number : ${order.orderNumber}`
    );

    doc.moveDown();

    //------------------------------------
    // Seller
    //------------------------------------

    doc
        .fontSize(12)
        .text("SHIP FROM");

    doc.fontSize(10);

    doc.text(
        seller.store.storeName
    );

    doc.text(
        seller.business.businessName
    );

    doc.text(
        seller.business.address
    );

    doc.text(
        seller.phone
    );

    doc.moveDown();

    //------------------------------------
    // Customer
    //------------------------------------

    doc
        .fontSize(12)
        .text("SHIP TO");

    doc.fontSize(10);

    doc.text(
        shipment.shippingAddress.fullName
    );

    doc.text(
        shipment.shippingAddress.phone
    );

    doc.text(
        shipment.shippingAddress.addressLine1
    );

    if (
        shipment.shippingAddress.addressLine2
    ) {

        doc.text(
            shipment.shippingAddress.addressLine2
        );

    }

    if (
        shipment.shippingAddress.landmark
    ) {

        doc.text(
            shipment.shippingAddress.landmark
        );

    }

    doc.text(
        `${shipment.shippingAddress.city}, ${shipment.shippingAddress.state}`
    );

    doc.text(
        shipment.shippingAddress.country
    );

    doc.text(
        shipment.shippingAddress.pincode
    );

    doc.moveDown();

    //------------------------------------
    // Package
    //------------------------------------

    doc
        .fontSize(12)
        .text("PACKAGE");

    doc.fontSize(10);

    doc.text(
        `Weight : ${shipment.package.weight || 0} Kg`
    );

    doc.text(
        `Courier : ${shipment.courier || "-"}`
    );

    doc.moveDown();

    //------------------------------------
    // Barcode
    //------------------------------------

    if (
        barcodePath &&
        fs.existsSync(barcodePath)
    ) {

        doc.image(
            barcodePath,
            {
                fit: [220, 60],
                align: "center"
            }
        );

    }

    doc.moveDown();

    doc.text(
        shipment.trackingNumber,
        {
            align: "center"
        }
    );

    doc.moveDown();

    //------------------------------------
    // QR
    //------------------------------------

    if (
        qrPath &&
        fs.existsSync(qrPath)
    ) {

        doc.image(
            qrPath,
            {
                fit: [100, 100],
                align: "center"
            }
        );

    }

    doc.moveDown();

    //------------------------------------
    // Footer
    //------------------------------------

    doc
        .fontSize(8)
        .text(
            "This label is system generated.",
            {
                align: "center"
            }
        );

    //------------------------------------
    // Finish
    //------------------------------------

    doc.end();

    await new Promise((resolve, reject) => {

        stream.on("finish", resolve);

        stream.on("error", reject);

    });

    //------------------------------------
    // Return
    //------------------------------------

    return {

        fileName,

        filePath

    };

};