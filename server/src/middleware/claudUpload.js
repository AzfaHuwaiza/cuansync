const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Kunci Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Penyimpanan ke Awan
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cuansync-uploads', // Nama folder di awan
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
});

const upload = multer({ storage: storage });
module.exports = upload;