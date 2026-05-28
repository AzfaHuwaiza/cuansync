const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ClientError = require('../exceptions/ClientError');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folderName = 'unknown';

        if(req.baseUrl.includes('/profiles') || req.baseUrl.includes('/profile')){
            folderName = 'profiles';
        }else if(req.baseUrl.includes('/umkm')){
            folderName = 'umkm';
        }

        const uploadDir = path.join(__dirname, `../../public/uploads/${folderName}`);
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);

    },

    filename: function(req, file, cb) {
        const uniqueFix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueFix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(new ClientError('Format file nggak didukung! Hanya JPG/PNG aja ya.', 400), false);
    };
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;