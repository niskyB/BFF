import * as multer from "multer";
import * as path from "path";

const maxSize = 1 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, path.resolve('uploads'));
    },
    filename: function (req: any, file: any, cb: any) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded should be jpg/jpeg or png"), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize }
});
