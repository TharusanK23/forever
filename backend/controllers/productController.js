import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        const image1 = req.files['image1'] && req.files['image1'][0];
        const image2 = req.files['image2'] && req.files['image2'][0];
        const image3 = req.files['image3'] && req.files['image3'][0];
        const image4 = req.files['image4'] && req.files['image4'][0];
        
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        
        let imageUrls = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(image.path, {resource_type: "image"});
            return result.secure_url;
        }));


        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestSeller === 'true' ? true : false,
            image: imageUrls,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        return res.status(200).json({ success: true, message: "Product added successfully", result: product });

    } catch (error) {
        console.error("Error in add product:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        return res.status(200).json({ success: true, message: "Products listed successfully", result: products });
    } catch (error) {
        console.log("Error in list product", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product Id is Required!", result: null });
        };
        const product = await productModel.findById({_id: id});
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found", result: null });
        }
        return res.status(200).json({ success: true, message: "Product finded successfully", result: product });
    } catch (error) {
        console.log("Error in single product", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Update a product by ID
const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product Id is Required!", result: null });
        };
        const product = await productModel.findById({_id: id});
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found", result: null });
        }
    } catch (error) {
        console.log("Error in update product", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Delete a product by ID
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ success: false, message: "Product Id is Required!", result: null });
        };
        const product = await productModel.findById({_id: id});
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found", result: null });
        }
        await productModel.findByIdAndDelete({_id: id});
        return res.status(200).json({ success: true, message: "Product deleted successfully", result: product });
    } catch (error) {
        console.log("Error in delete product", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

export { addProduct, getAllProducts, getProductById, updateProductById, deleteProductById };