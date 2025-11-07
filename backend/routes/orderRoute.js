import express from "express";
import { placeOrder, placeOrderStripe, placeOrderRazorpay, getAllOrdersAdmin, getUserOrders, updateOrderStatus, verifyStripePayment } from "../controllers/orderController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// ADMIN AUTH MIDDLEWARE CAN BE ADDED TO ROUTES THAT REQUIRE ADMIN PRIVILEGES
// All orders of a admin
orderRouter.post("/admin/orders", adminAuth, getAllOrdersAdmin);
// Update order status from admin panel
orderRouter.post("/admin/status", adminAuth, updateOrderStatus);

// PAYMENT FEATURES CAN BE ADDED TO THE ORDER PLACEMENT ROUTES
// Placing an order using Stripe
orderRouter.post("/stripe", userAuth, placeOrderStripe);
// Placing an order using Razorpay
orderRouter.post("/razorpay", userAuth, placeOrderRazorpay);
// Place Cash on Delivery order
orderRouter.post("/place", userAuth, placeOrder);
// Verify Stripe payment and update order status
orderRouter.post("/verifystripe", userAuth, verifyStripePayment);

// USER AUTH MIDDLEWARE CAN BE ADDED TO ROUTES THAT REQUIRE USER TO BE LOGGED IN
// All orders of a user
orderRouter.post("/userorders", userAuth, getUserOrders);

export default orderRouter;