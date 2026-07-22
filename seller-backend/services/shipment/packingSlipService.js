import PDFDocument from "pdfkit";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const generatePackingSlip = async (
    shipment,
    seller,
    order
) => {

    //------------------------------------
    // Folder
    //------------------------------------

    const outputDir = path.join(
        process.cwd(),
        "uploads",
        "packing-slips"
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

        size: "A4",

        margin: 40

    });

    const stream =
        fs.createWriteStream(filePath);

    doc.pipe(stream);

    //------------------------------------
    // Header
    //------------------------------------

    doc
        .fontSize(22)
        .text("PACKING SLIP", {
            align: "center"
        });

    doc.moveDown();

    //------------------------------------
    // Shipment Details
    //------------------------------------

    doc.fontSize(10);

    doc.text(
        `Shipment Number : ${shipment.shipmentNumber}`
    );

    doc.text(
        `Tracking Number : ${shipment.trackingNumber}`
    );

    doc.text(
        `Order Number : ${order.orderNumber}`
    );

    doc.text(
        `Packing Date : ${new Date().toLocaleDateString()}`
    );

    doc.moveDown();

    //------------------------------------
    // Seller
    //------------------------------------

    doc
        .fontSize(14)
        .text("Packed By");

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
        .fontSize(14)
        .text("Ship To");

    doc.fontSize(10);

    doc.text(
        order.shippingAddress.fullName
    );

    doc.text(
        order.shippingAddress.phone
    );

    doc.text(
        order.shippingAddress.addressLine1
    );

    if (order.shippingAddress.addressLine2) {

        doc.text(
            order.shippingAddress.addressLine2
        );

    }

    if (order.shippingAddress.landmark) {

        doc.text(
            order.shippingAddress.landmark
        );

    }

    doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    );

    doc.text(
        order.shippingAddress.country
    );

    doc.text(
        order.shippingAddress.pincode
    );

    doc.moveDown();

    //------------------------------------
    // Product List
    //------------------------------------

    doc
        .fontSize(14)
        .text("Packed Items");

    doc.moveDown(0.5);

    doc.fontSize(10);

    let totalQty = 0;

    order.items.forEach((item, index) => {

        if (
            item.seller.toString() !==
            seller._id.toString()
        ) return;

        totalQty += item.quantity;

        doc.text(
            `${index + 1}. ${item.snapshot.title}`
        );

        doc.text(
            `Variant : ${item.snapshot.variantName}`
        );

        doc.text(
            `SKU : ${item.sku}`
        );

        doc.text(
            `Quantity : ${item.quantity}`
        );

        doc.moveDown();

    });

    //------------------------------------
    // Summary
    //------------------------------------

    doc
        .fontSize(14)
        .text("Summary");

    doc.fontSize(10);

    doc.text(
        `Total Items : ${totalQty}`
    );

    doc.text(
        `Courier : ${shipment.courier || "-"}`
    );

    doc.text(
        `Shipment Status : ${shipment.status}`
    );

    doc.moveDown(2);

    //------------------------------------
    // Footer
    //------------------------------------

    doc
        .fontSize(9)
        .text(
            "This packing slip is system generated.",
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