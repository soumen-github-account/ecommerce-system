import PDFDocument from "pdfkit";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const generateInvoice = async (
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
        "invoices"
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
        .text("TAX INVOICE", {
            align: "center"
        });

    doc.moveDown();

    doc
        .fontSize(10)
        .text(`Invoice No : ${shipment.shipmentNumber}`);

    doc.text(`Order No : ${order.orderNumber}`);

    doc.text(`Tracking No : ${shipment.trackingNumber}`);

    doc.text(`Date : ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    //------------------------------------
    // Seller
    //------------------------------------

    doc
        .fontSize(14)
        .text("Seller");

    doc
        .fontSize(10);

    doc.text(seller.business.businessName);

    doc.text(seller.business.address);

    doc.text(`Phone : ${seller.phone}`);

    doc.text(`GSTIN : ${seller.business.gstin || "-"}`);

    doc.moveDown();

    //------------------------------------
    // Buyer
    //------------------------------------

    doc
        .fontSize(14)
        .text("Bill To");

    doc
        .fontSize(10);

    doc.text(order.shippingAddress.fullName);

    doc.text(order.shippingAddress.phone);

    doc.text(order.shippingAddress.addressLine1);

    if (order.shippingAddress.addressLine2) {

        doc.text(order.shippingAddress.addressLine2);

    }

    if (order.shippingAddress.landmark) {

        doc.text(order.shippingAddress.landmark);

    }

    doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    );

    doc.text(order.shippingAddress.country);

    doc.text(order.shippingAddress.pincode);

    doc.moveDown();

    //------------------------------------
    // Products
    //------------------------------------

    doc
        .fontSize(14)
        .text("Items");

    doc.moveDown(0.5);

    doc.fontSize(10);

    order.items.forEach((item, index) => {

        if (
            item.seller.toString() !==
            seller._id.toString()
        ) return;

        doc.text(
            `${index + 1}. ${item.snapshot.title}`
        );

        doc.text(
            `Variant : ${item.snapshot.variantName}`
        );

        doc.text(
            `Qty : ${item.quantity}`
        );

        doc.text(
            `Price : ₹${item.pricing.sellingPrice}`
        );

        doc.text(
            `Total : ₹${item.pricing.total}`
        );

        doc.moveDown();

    });

    //------------------------------------
    // Total
    //------------------------------------

    doc
        .fontSize(14)
        .text("Order Summary");

    doc
        .fontSize(10);

    doc.text(
        `Subtotal : ₹${order.pricing.subtotal}`
    );

    doc.text(
        `Shipping : ₹${order.pricing.shippingCharge}`
    );

    doc.text(
        `Tax : ₹${order.pricing.tax}`
    );

    doc.text(
        `Discount : ₹${order.pricing.discount}`
    );

    doc.moveDown();

    doc
        .fontSize(13)
        .text(
            `Grand Total : ₹${order.pricing.totalAmount}`
        );

    doc.moveDown(2);

    //------------------------------------
    // Footer
    //------------------------------------

    doc
        .fontSize(9)
        .text(
            "This is a computer generated invoice.",
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