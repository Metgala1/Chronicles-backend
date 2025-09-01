const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.random(Math.random() * 1e9);
        cb(
            null, 
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        )
    }
});

function fileFilter(req, file, cb) {
    const allowedType = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if(allowedType.test(ext)) {
        cb(null, true)
    }else {
        cb(new Error("Only images are allowed"), false)
    }
}

const upload = multer({storage, fileFilter})
module.exports = upload