import multer from "multer";
import{CloudinaryStorage} from "multer-storage-cloudinary";
import {v2 as cloudinary} from "cloudinary";
import { config } from "../../config.js";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_cloud_name,
    api_key:config.cloudinary.cloudinary_api_key,
    api_secret:config.cloudinary.cloudinary_api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:"Hospital Rosales",
        allowed_formats:["jpg", "png", "jpeg", "gif"]
    }
});

const upload = multer({storage:storage});
export default upload;