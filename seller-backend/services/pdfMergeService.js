import PDFMerger from "pdf-merger-js";
import fs from "fs/promises";
import path from "path";

export const mergeShippingLabels = async (pdfFiles) => {

    //------------------------------------
    // Folder
    //------------------------------------

    const outputDir = path.join(
        process.cwd(),
        "uploads",
        "merged-labels"
    );

    await fs.mkdir(outputDir, {
        recursive: true
    });

    //------------------------------------
    // Output File
    //------------------------------------

    const fileName =
        `ShippingLabels-${Date.now()}.pdf`;

    const outputPath =
        path.join(outputDir, fileName);

    //------------------------------------
    // Merge
    //------------------------------------

    const merger = new PDFMerger();

    for (const pdf of pdfFiles) {

        await merger.add(pdf);

    }

    await merger.save(outputPath);

    //------------------------------------
    // Return
    //------------------------------------

    return {

        fileName,

        filePath: outputPath

    };

};