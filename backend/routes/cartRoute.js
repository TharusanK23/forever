import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();
// Route to add a product to the cart
cartRouter.post("/add", userAuth, addToCart);
// Route to get all items in the cart
cartRouter.post("/items", userAuth, getCart);
// Route to update a cart item
cartRouter.put("/update", userAuth, updateCartItem);
// Route to remove an item from the cart
cartRouter.delete("/remove", userAuth, removeFromCart);

export default cartRouter;