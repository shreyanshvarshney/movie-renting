const jwt = require("jsonwebtoken");
const debug = require("debug")("app:auth.middleware");

const auth = (req, res, next) => {
    try {
        // Auth token string consists Bearer
        const token = req.headers.authorization.split(" ")[1];
        debug(token);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        debug(decodedToken);
        req.userData = {
            _id: decodedToken._id,
            email: decodedToken.email
        };
        next();
    } catch (err) {
        res.status(401).json({message: "Please login first!"});
    }
};

module.exports = auth;