const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

const cloudinary = require("../../config/cloudinary")

const storage = (folder) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: () => folder,
        }
    })
}

const uploadCampaign = multer({
    storage: storage("campaign_images"),
})

const uploadAvatar = multer({
    storage: storage("user_avatars"),
})

module.exports = {
    uploadCampaign,
    uploadAvatar,
}