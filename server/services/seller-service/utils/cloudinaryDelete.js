import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error(
      "[CLOUDINARY] DELETE ERROR:",
      error.message
    );

    return null;
  }
};