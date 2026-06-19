
import express from "express"
import { addProduct } from "../controllers/AddProductController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()

router.post("/add-product", upload.any(), addProduct);

export default router