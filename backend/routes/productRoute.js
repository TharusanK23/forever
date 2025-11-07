import express from "express";
import { addProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Route to add a new product
productRouter.post("/add", adminAuth, upload.fields([{name: 'image1', maxCount:1},{name: 'image2', maxCount:1},{name: 'image3', maxCount:1},{name: 'image4', maxCount:1}]),  addProduct);
// Route to get all products
productRouter.get("/list", getAllProducts);
// Route to get a single product by ID
productRouter.get("/single/:id", getProductById);
// Route to update a product by ID
productRouter.put("/update/:id", adminAuth, updateProductById);
// Route to delete a product by ID
productRouter.delete("/remove/:id", adminAuth, deleteProductById);

export default productRouter;