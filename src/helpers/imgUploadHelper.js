const cloudinary = require("cloudinary").v2;
const config = require("../globals/config");

cloudinary.config({
  cloud_name: config.get("cloudinary").CLOUDINARY_CLOUD_NAME,
  api_key: config.get("cloudinary").CLOUDINARY_API_KEY,
  api_secret: config.get("cloudinary").CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.url);
        }
      }
    );
    uploadStream.end(file);
  });
};

module.exports = {
  uploadToCloudinary,
};
