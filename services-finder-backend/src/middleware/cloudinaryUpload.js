const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-images', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
