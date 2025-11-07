import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if(!token) {
                return res.status(401).json({ success: false, message: "Not Authorized Token Requried", result: null }); 
            }
            const token_decode = jwt.verify(token, process.env.JWT_SECRET);
            req.body.userId = token_decode.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again", result: null }); 
        }
    } catch (error) {
        console.error("Error in admin auth:", error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ success: false, message: "Unauthorized access!", result: null });
        }
        if (error.name === 'TokenExpiredError') {
            res.status(440).json({ success: false, message: "Sesson expired try sign in!", result: null });
        }
        res.status(500).json({ success: false, message: "Internal server error!", result: null });
    }
}

export default userAuth;