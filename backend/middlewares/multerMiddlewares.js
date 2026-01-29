import multer from "multer";
import fs from "fs";

if(!fs.existsSync("./public/temp"))
{
    fs.mkdirSync("./public/temp");
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        let filename = file.originalname + "-" + Date.now();
        cb(null, filename);
    }
})

export let upload = multer({ storage });