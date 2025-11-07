import userModel from "../models/userModel.js";


// Add produst to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found", result: null });
        }
        let cartData = await userData.cartData;
        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Product added to cart", result: userModel.cartData });
    } catch (error) {
        console.error("Error in add user cart:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Get user cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found", result: null });
        }
        let cartData = await userData.cartData;
        res.status(200).json({ success: true, message: "User cart fetched", result: cartData });
    } catch (error) {
        console.error("Error in get user cart:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Remove product from user cart
const removeFromCart = async (req, res) => {}

// Update product quantity in user cart
const updateCartItem = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found", result: null });
        }
        let cartData = await userData.cartData;
        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Cart item updated", result: userModel.cartData });

    } catch (error) {
        console.error("Error in update user cart:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

export { addToCart, getCart, removeFromCart, updateCartItem };