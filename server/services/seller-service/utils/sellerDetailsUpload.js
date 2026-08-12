import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  file,
  folder = "ecommerce/sellers"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // Image + PDF + other supported files
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          public_id: result.public_id,
          url: result.secure_url,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          original_filename: result.original_filename,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};