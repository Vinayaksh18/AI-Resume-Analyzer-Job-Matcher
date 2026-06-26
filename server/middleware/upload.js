import multer from "multer";
import path from "path";
import fs from "fs";

//Ensure uploads folder exists
const uploadDir = "uploads/"
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ["application/pdf"];
    allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only PDF files are allowed"), false);
}

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})