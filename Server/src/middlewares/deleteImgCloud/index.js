const cloudinary = require("../../config/cloudinary")

const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts.pop();
    const folder = parts.pop();
    const publicId = `${folder}/${filename.split(".")[0]}`;
    return publicId;
};

const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        const publicId = getPublicIdFromUrl(imageUrl);
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
    }
};

module.exports = deleteImageFromCloudinary;
