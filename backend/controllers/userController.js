import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password", result: null });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password", result: null });
        }
        const token = createToken(user._id);
        res.status(200).json({ success: true, message: "Login successful", result: { _id: user._id, name: user.name, email: user.email, token } });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists", result: null });
        }
        // Validate email format & Strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format", result: null });
        }
        if (!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
            return res.status(400).json({ success: false, message: "Password enter strong password", result: null });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        const token = createToken(newUser._id);

        res.status(200).json({ success: true, message: "User registered successfully", result: { _id: newUser._id, name: newUser.name, email: newUser.email, token } });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = createToken(email + password);
            res.status(200).json({ success: true, message: "Admin login successful", result: { token } });
        } else {
            res.status(400).json({ success: false, message: "Admin login faild", result: null });
        }
    } catch (error) {
        console.error("Error in admin login:", error);
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

export { loginUser, registerUser, adminLogin };