
import express from "express"
import { addProduct, getAllSeller } from "../controllers/AddProductController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()

router.post("/add-product", upload.any(), addProduct);
router.get("/get-all-seller", getAllSeller);

export default router