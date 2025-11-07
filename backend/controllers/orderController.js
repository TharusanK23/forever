import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const deliveryCharge = 10; // Fixed delivery charge
// Stripe Gateway Integration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing an order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        });

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(200).json({ success: true, message: "Order placed successfully", result: newOrder });

    } catch (error) {
        console.error("Error in place order:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Placing an order using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        console.log(origin);
        
        const orderData = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        });

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: process.env.CURRENCY,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: process.env.CURRENCY,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            mode: 'payment',
            line_items,
        });

        res.status(200).json({ success: true, message: "Order placed successfully", result: {url: session.url} });


    } catch (error) {
        console.error("Error in place order via stripe:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Placing an order using Razorpay
const placeOrderRazorpay = async (req, res) => {}

// All orders of a admin
const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, message: "User orders fetched successfully", result: orders });

    } catch (error) {
        console.error("Error in admin orders:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// All orders of a user
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, message: "User orders fetched successfully", result: orders });

    } catch (error) {
        console.error("Error in user orders:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Update order status from admin panel
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Order status updated successfully", result: updatedOrder });
        
    } catch (error) {
        console.error("Error in update order status:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

//  Verify Stripe payment and update order status
const verifyStripePayment = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;
        if(success === 'true') {
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Confirmed" });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true, message: "Payment verified and order confirmed", result: updatedOrder });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(400).json({ success: false, message: "Payment verification failed", result: null });
        }
    } catch (error) {
        console.error("Error in verify Stripe payment:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}


export { placeOrder, placeOrderStripe, placeOrderRazorpay, getAllOrdersAdmin, getUserOrders, updateOrderStatus, verifyStripePayment };